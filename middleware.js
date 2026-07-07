import { NextResponse } from "next/server";

// In-memory rate limiter (por IP, por ventana de tiempo)
// Nota: En Vercel serverless, cada instancia tiene su propio mapa.
// Para rate limiting distribuido real se necesitaría Redis/KV.
// Esto protege contra ráfagas de una misma instancia.
const rateLimitMap = new Map();

const RATE_LIMIT_RULES = {
  "/api/bookings": { max: 10, windowMs: 60_000 },  // 10 reservas/min por IP
  "/api/contact":  { max: 5,  windowMs: 60_000 },  // 5 mensajes/min por IP
  "/api/admin":    { max: 30, windowMs: 60_000 },  // 30 peticiones admin/min
};

function getRateLimit(pathname) {
  for (const [prefix, rule] of Object.entries(RATE_LIMIT_RULES)) {
    if (pathname.startsWith(prefix)) return rule;
  }
  return null;
}

function checkRateLimit(ip, pathname) {
  const rule = getRateLimit(pathname);
  if (!rule) return true;

  const key = `${ip}:${pathname.split("/").slice(0, 3).join("/")}`;
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now - entry.start > rule.windowMs) {
    rateLimitMap.set(key, { start: now, count: 1 });
    return true;
  }

  entry.count++;
  if (entry.count > rule.max) return false;
  return true;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // IP del cliente (Vercel pone la IP real en x-forwarded-for)
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // ── Rate limiting en rutas de API ──────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    if (!checkRateLimit(ip, pathname)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Inténtalo más tarde." },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Limit": "10",
          },
        }
      );
    }
  }

  // ── Bloquear acceso directo a rutas internas de Next.js ───────────────
  if (pathname.startsWith("/_next/") && pathname.includes("..")) {
    return new NextResponse(null, { status: 404 });
  }

  // ── Añadir headers de seguridad adicionales en respuesta ──────────────
  const response = NextResponse.next();

  // Evitar caché de datos sensibles en rutas de API
  if (pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("Pragma", "no-cache");
  }

  return response;
}

export const config = {
  matcher: [
    // Aplicar a API routes y páginas (excluir assets estáticos)
    "/((?!_next/static|_next/image|favicon|logo|images|video|icons).*)",
  ],
};
