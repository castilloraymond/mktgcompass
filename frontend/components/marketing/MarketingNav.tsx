import Link from "next/link";
import { Compass } from "lucide-react";

export function MarketingNav() {
  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-8 h-16 bg-surface-lowest/85 backdrop-blur-md"
      style={{ borderBottom: "1px solid var(--outline)" }}
    >
      <Link href="/" className="flex items-center gap-2.5">
        <div className="flex items-center justify-center rounded-xl size-8 bg-primary-gradient">
          <Compass size={16} className="text-white" strokeWidth={1.75} />
        </div>
        <span
          className="font-semibold text-on-surface"
          style={{ fontFamily: "var(--font-display)", fontSize: "1.0625rem", letterSpacing: "-0.01em" }}
        >
          MktgCompass
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-8 text-[0.875rem] font-medium text-on-surface-variant">
        <a href="#features" className="hover:text-on-surface transition-colors">Product</a>
        <a href="#how-it-works" className="hover:text-on-surface transition-colors">How it works</a>
        <a href="https://github.com" className="hover:text-on-surface transition-colors">Docs</a>
        <Link href="/dashboard" className="hover:text-on-surface transition-colors">Log in</Link>
      </nav>

      <Link
        href="/upload"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[0.875rem] font-semibold text-white bg-primary-gradient btn-primary-lift"
        style={{ boxShadow: "0 2px 8px rgba(37,99,235,0.25)" }}
      >
        Start free
      </Link>
    </header>
  );
}
