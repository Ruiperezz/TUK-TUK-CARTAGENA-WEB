import Link from "next/link";
import Logo from "./Logo";

export default function LegalPage({ title, children }) {
  return (
    <div
      className="min-h-screen text-cream bg-bg-primary"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Header */}
      <header
        className="px-6 md:px-16 py-5 flex items-center justify-between border-b"
        style={{ borderColor: "rgba(248,246,241,0.08)" }}
      >
        <Link href="/" aria-label="Volver al inicio">
          <Logo size="sm" />
        </Link>
        <Link
          href="/"
          className="text-[11px] tracking-[0.22em] uppercase opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: "#C9A961" }}
        >
          ← Inicio
        </Link>
      </header>

      {/* Content */}
      <main className="px-6 md:px-16 py-16 md:py-24 max-w-4xl mx-auto">
        <div className="label-eyebrow mb-6">Legal</div>
        <h1 className="serif text-4xl md:text-6xl font-medium mb-16 leading-tight">
          {title}
        </h1>
        <div className="legal-content">{children}</div>
      </main>

      {/* Footer */}
      <footer
        className="px-6 md:px-16 py-8 border-t mt-16"
        style={{ borderColor: "rgba(248,246,241,0.08)" }}
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] tracking-[0.22em] uppercase opacity-40">
            © {new Date().getFullYear()} TUK TUK Cartagena · MELLADA DPAICO S.L.
          </div>
          <nav className="flex gap-6 text-xs opacity-50">
            <Link href="/aviso-legal" className="hover:opacity-100 transition-opacity">Aviso Legal</Link>
            <Link href="/politica-privacidad" className="hover:opacity-100 transition-opacity">Privacidad</Link>
            <Link href="/politica-cookies" className="hover:opacity-100 transition-opacity">Cookies</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
