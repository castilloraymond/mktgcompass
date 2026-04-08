"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, GitMerge, Lightbulb, TrendingUp,
  FlaskConical, FileBarChart, Settings, Plus, HelpCircle, LogOut,
  Compass, PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_SECTIONS = [
  {
    label: "Workspace",
    items: [
      { href: "/",            label: "Overview",    icon: LayoutDashboard },
      { href: "/attribution", label: "Attribution", icon: GitMerge },
      { href: "/insights",    label: "Insights",    icon: Lightbulb },
      { href: "/performance", label: "Performance", icon: TrendingUp },
    ],
  },
  {
    label: "Tools",
    items: [
      { href: "/experiments", label: "Experiments", icon: FlaskConical, soon: true },
      { href: "/reports",     label: "Reports",     icon: FileBarChart, soon: true },
      { href: "/settings",    label: "Settings",    icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === ".") {
        e.preventDefault();
        setCollapsed(c => !c);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <aside
      className="flex flex-col shrink-0 bg-surface overflow-hidden transition-[width] duration-200 ease-in-out"
      style={{
        width: collapsed ? "64px" : "260px",
        borderRight: "1px solid var(--outline)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center h-[64px] shrink-0 px-4 gap-3"
        style={{ borderBottom: "1px solid var(--outline)" }}
      >
        <div className="flex items-center justify-center rounded-xl size-8 bg-primary-gradient shrink-0">
          <Compass size={16} className="text-white" strokeWidth={1.75} />
        </div>
        {!collapsed && (
          <span
            className="font-semibold text-on-surface whitespace-nowrap flex-1"
            style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: "-0.01em" }}
          >
            MktgCompass
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors shrink-0",
            collapsed && "mx-auto"
          )}
          title={collapsed ? "Expand sidebar (⌘.)" : "Collapse sidebar (⌘.)"}
        >
          {collapsed
            ? <PanelLeftOpen size={15} strokeWidth={1.75} />
            : <PanelLeftClose size={15} strokeWidth={1.75} />
          }
        </button>
      </div>

      {/* New Analysis Button */}
      <div className="px-3 pt-4 pb-2">
        <Link
          href="/upload"
          title={collapsed ? "New Analysis" : undefined}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[10px] text-sm font-semibold text-white bg-secondary-gradient hover:opacity-90 active:scale-[0.98] transition-all"
          style={{ boxShadow: "0 2px 8px rgba(37,99,235,0.25)" }}
        >
          <Plus size={15} strokeWidth={2.5} className="shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">New Analysis</span>}
        </Link>
      </div>

      {/* Nav Sections */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-5">
        {NAV_SECTIONS.map(({ label, items }) => (
          <div key={label}>
            {!collapsed && (
              <p className="text-overline text-on-surface-variant px-3 mb-1.5 whitespace-nowrap">{label}</p>
            )}
            <div className="space-y-0.5">
              {items.map(({ href, label: itemLabel, icon: Icon, soon }) => {
                const active = pathname === href || (href !== "/" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={soon ? "#" : href}
                    title={collapsed ? itemLabel : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.875rem] font-medium transition-colors",
                      collapsed && "justify-center px-2",
                      active
                        ? "bg-secondary/8 text-secondary"
                        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                      soon && "opacity-40 cursor-not-allowed pointer-events-none"
                    )}
                    style={active ? { background: "var(--accent-primary-light)", color: "var(--accent-primary)" } : {}}
                  >
                    <Icon
                      size={17}
                      strokeWidth={1.75}
                      className={active ? "text-secondary" : "text-on-surface-variant"}
                      style={active ? { color: "var(--accent-primary)" } : {}}
                    />
                    {!collapsed && (
                      <>
                        <span className="whitespace-nowrap">{itemLabel}</span>
                        {soon && (
                          <span
                            className="ml-auto text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded whitespace-nowrap"
                            style={{ background: "var(--surface-container)", color: "var(--on-surface-variant)" }}
                          >
                            Soon
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="px-2 pb-4 space-y-0.5"
        style={{ borderTop: "1px solid var(--outline)", paddingTop: "12px" }}
      >
        <Link
          href="/help"
          title={collapsed ? "Help Center" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.875rem] font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors",
            collapsed && "justify-center px-2"
          )}
        >
          <HelpCircle size={17} strokeWidth={1.75} className="shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">Help Center</span>}
        </Link>
        <button
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[0.875rem] font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Sign out" : undefined}
        >
          <LogOut size={17} strokeWidth={1.75} className="shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
