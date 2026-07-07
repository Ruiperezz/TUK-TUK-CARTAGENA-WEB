/** @type {import('next').NextConfig} */

const SECURITY_HEADERS = [
  // Evita que la web sea embebida como iframe en otros dominios (clickjacking)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Evita MIME sniffing de tipos de contenido
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Fuerza HTTPS durante 1 año, incluye subdominios
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  // Bloquea XSS en navegadores antiguos
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Controla qué información de referencia se envía
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restringe acceso a APIs del navegador (cámara, micrófono, geolocalización…)
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(self), fullscreen=(self)",
  },
  // Content Security Policy: solo carga recursos de orígenes permitidos
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: propio + inline necesario para Next.js (sin unsafe-eval)
      "script-src 'self' 'unsafe-inline'",
      // Estilos: propio + inline + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fuentes: propio + Google Fonts CDN
      "font-src 'self' https://fonts.gstatic.com",
      // Imágenes: propio + data URIs + Google Maps
      "img-src 'self' data: blob: https://maps.gstatic.com https://maps.googleapis.com",
      // Iframes: solo Google Maps (para el mapa de punto de encuentro)
      "frame-src 'self' https://www.google.com/maps/",
      // Conexiones de red: propio + Supabase + Stripe
      "connect-src 'self' https://*.supabase.co https://api.stripe.com",
      // Multimedia
      "media-src 'self'",
      // Sin plugins
      "object-src 'none'",
      // Sin iframes de base
      "base-uri 'self'",
      // Solo formularios propios
      "form-action 'self' https://checkout.stripe.com",
      // Versión del CSP
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,

  // Cabeceras de seguridad para todas las rutas
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
    ];
  },

  // Optimización de imágenes — solo dominios propios
  images: {
    remotePatterns: [],
  },

  // Evitar que las rutas de API aparezcan en el index de build
  experimental: {},

  // No exponer cabecera X-Powered-By (ocultar tecnología)
  poweredByHeader: false,
};

export default nextConfig;
