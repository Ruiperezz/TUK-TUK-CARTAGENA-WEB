import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ── Distributed rate limiters (Upstash Redis / Edge-compatible) ───────────
// Lazily initialised so missing env vars don't crash cold starts
let _limiters = null;

function getLimiters() {
  if (_limiters) return _limiters;
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const redis = new Redis({ url, token });
  const lim = (n, w) => new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(n, w), analytics: false });

  _limiters = {
    bookings:  lim(10, "1 m"),
    contact:   lim(5,  "1 m"),
    admin:     lim(30, "1 m"),
    bySession: lim(30, "1 m"),
  };
  return _limiters;
}

// In-memory fallback (per-instance, for when Redis is not yet configured)
const _mem = new Map();
const MEM_RULES = {
  "/api/bookings":              { max: 10, windowMs: 60_000 },
  "/api/bookings/by-session":   { max: 30, windowMs: 60_000 },
  "/api/contact":               { max: 5,  windowMs: 60_000 },
  "/api/admin":                 { max: 30, windowMs: 60_000 },
};

function memLimit(ip, pathname) {
  const rule = Object.entries(MEM_RULES).find(([p]) =>
    pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p)
  )?.[1];
  if (!rule) return true;
  const key = `${ip}:${pathname}`;
  const now = Date.now();
  const e = _mem.get(key);
  if (!e || now - e.start > rule.windowMs) { _mem.set(key, { start: now, count: 1 }); return true; }
  e.count++;
  return e.count <= rule.max;
}

function pickLimiter(pathname, limiters) {
  if (!limiters) return null;
  if (pathname === "/api/bookings") return limiters.bookings;
  if (pathname.startsWith("/api/bookings/by-session")) return limiters.bySession;
  if (pathname.startsWith("/api/bookings")) return limiters.bookings;
  if (pathname.startsWith("/api/contact")) return limiters.contact;
  if (pathname.startsWith("/api/admin")) return limiters.admin;
  return null;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // ── Rate limiting ──────────────────────────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    const limiters = getLimiters();
    const limiter  = pickLimiter(pathname, limiters);

    let allowed = true;
    if (limiter) {
      const { success } = await limiter.limit(ip);
      allowed = success;
    } else {
      allowed = memLimit(ip, pathname);
    }

    if (!allowed) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Inténtalo más tarde." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
  }

  // ── Block path traversal ──────────────────────────────────────────────────
  if (pathname.startsWith("/_next/") && pathname.includes("..")) {
    return new NextResponse(null, { status: 404 });
  }

  // ── Per-request CSP nonce (removes unsafe-inline) ────────────────────────
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://maps.gstatic.com https://maps.googleapis.com",
    "frame-src 'self' https://www.google.com/maps https://www.google.com/maps/ https://maps.google.com",
    "connect-src 'self' https://*.supabase.co https://api.stripe.com",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://checkout.stripe.com",
    "upgrade-insecure-requests",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set("Content-Security-Policy", csp);

  if (pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("Pragma", "no-cache");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon|logo|images|video|icons).*)",
  ],
};
