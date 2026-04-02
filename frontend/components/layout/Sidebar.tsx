"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, GitMerge, Lightbulb, TrendingUp,
  FlaskConical, FileBarChart, Settings, Plus, HelpCircle, LogOut,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/",            label: "Overview",     icon: LayoutDashboard },
  { href: "/attribution", label: "Attribution",  icon: GitMerge },
  { href: "/insights",    label: "Insights",     icon: Lightbulb },
  { href: "/performance", label: "Performance",  icon: TrendingUp },
  { href: "/experiments", label: "Experiments",  icon: FlaskConical, soon: true },
  { href: "/reports",     label: "Reports",      icon: FileBarChart, soon: true },
  { href: "/settings",    label: "Settings",     icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col shrink-0 bg-surface-lowest border-r border-r-surface-container"
      style={{ width: "220px" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-b-surface-container">
        <div
          className="flex items-center justify-center rounded-[10px] size-8 bg-primary"
        >
          <Compass size={16} className="text-white" strokeWidth={1.5} />
        </div>
        <span
          className="font-semibold text-on-surface"
          style={{ fontFamily: "var(--font-display)", fontSize: "1rem" }}
        >
          MktgCompass
        </span>
      </div>

      {/* New Campaign Button */}
      <div className="px-4 pt-4 pb-2">
        <Link
          href="/upload"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-[12px] text-sm font-medium text-on-primary bg-primary-gradient hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          New Analysis
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon, soon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={soon ? "#" : href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-[10px] text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface-variant hover:bg-surface-low hover:text-on-surface",
                soon && "opacity-50 cursor-not-allowed"
              )}
            >
              <Icon size={18} strokeWidth={1.5} />
              <span>{label}</span>
              {soon && (
                <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                  Soon
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-t-surface-container px-3 py-3 space-y-0.5">
        <Link
          href="/help"
          className="flex items-center gap-3 px-3 py-2 rounded-[10px] text-sm font-medium text-on-surface-variant hover:bg-surface-low hover:text-on-surface transition-colors"
        >
          <HelpCircle size={18} strokeWidth={1.5} />
          Help Center
        </Link>
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-[10px] text-sm font-medium text-on-surface-variant hover:bg-surface-low hover:text-on-surface transition-colors">
          <LogOut size={18} strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
