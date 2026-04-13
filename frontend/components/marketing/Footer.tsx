import Link from "next/link";
import { Compass, ArrowRight, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="bg-surface-lowest"
      style={{ borderTop: "1px solid var(--outline)" }}
    >
      {/* Big CTA block */}
      <div className="mx-auto max-w-[1200px] px-8 py-20 lg:py-28 text-center">
        <h2
          className="text-headline-lg text-on-surface mb-4 max-w-[720px] mx-auto"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Ready to find your growth levers?
        </h2>
        <p className="text-body-md text-on-surface-variant max-w-[520px] mx-auto mb-10 leading-relaxed">
          Upload a CSV, get answers in minutes. No credit card, no account, no
          tricks — MktgCompass is free forever.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-[12px] text-[0.9375rem] font-semibold text-white bg-primary-gradient btn-primary-lift"
            style={{ boxShadow: "0 4px 16px rgba(37,99,235,0.25)" }}
          >
            Start free
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-[12px] text-[0.9375rem] font-medium text-on-surface bg-surface-lowest hover:bg-surface-low transition-colors"
            style={{ border: "1px solid var(--outline)" }}
          >
            See live demo
          </Link>
        </div>
      </div>

      {/* Meta footer */}
      <div
        className="mx-auto max-w-[1200px] px-8 py-10"
        style={{ borderTop: "1px solid var(--outline)" }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center rounded-xl size-8 bg-primary-gradient">
              <Compass size={16} className="text-white" strokeWidth={1.75} />
            </div>
            <div>
              <p
                className="text-sm font-semibold text-on-surface"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
              >
                MktgCompass
              </p>
              <p className="text-xs text-on-surface-variant">
                &copy; {new Date().getFullYear()} — Free forever.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[0.8125rem] text-on-surface-variant">
            <a href="#features" className="hover:text-on-surface transition-colors">
              Product
            </a>
            <a href="#how-it-works" className="hover:text-on-surface transition-colors">
              How it works
            </a>
            <Link href="/dashboard" className="hover:text-on-surface transition-colors">
              Demo
            </Link>
            <a href="https://github.com" className="hover:text-on-surface transition-colors" aria-label="GitHub">
              <Github size={16} strokeWidth={1.75} />
            </a>
            <a href="https://twitter.com" className="hover:text-on-surface transition-colors" aria-label="Twitter">
              <Twitter size={16} strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
