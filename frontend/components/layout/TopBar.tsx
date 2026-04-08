"use client";

import { Bell, Search, Settings, User, ChevronDown } from "lucide-react";

export function TopBar() {
  return (
    <header
      className="flex items-center justify-between gap-4 px-8 bg-surface-lowest shrink-0"
      style={{ height: "64px", borderBottom: "1px solid var(--outline)" }}
    >
      {/* Left — empty for now, breadcrumb can go here */}
      <div />

      {/* Right — actions */}
      <div className="flex items-center gap-1.5">
        {/* Search */}
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-[10px] text-[0.8125rem] text-on-surface-variant hover:bg-surface-container transition-colors"
          style={{ border: "1px solid var(--outline)" }}
        >
          <Search size={14} strokeWidth={1.75} />
          <span>Search insights…</span>
          <kbd
            className="ml-1 text-[11px] text-on-surface-variant px-1.5 py-0.5 rounded-md"
            style={{ background: "var(--surface-container)", fontFamily: "var(--font-mono)" }}
          >
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button className="relative flex items-center justify-center size-9 rounded-[10px] text-on-surface-variant hover:bg-surface-container transition-colors">
          <Bell size={16} strokeWidth={1.75} />
          <span
            className="absolute top-2 right-2 size-1.5 rounded-full"
            style={{ background: "var(--accent-primary)" }}
          />
        </button>

        {/* Settings */}
        <button className="flex items-center justify-center size-9 rounded-[10px] text-on-surface-variant hover:bg-surface-container transition-colors">
          <Settings size={16} strokeWidth={1.75} />
        </button>

        {/* Divider */}
        <div className="h-6 w-px mx-1" style={{ background: "var(--outline)" }} />

        {/* Avatar */}
        <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-[10px] hover:bg-surface-container transition-colors">
          <div className="flex items-center justify-center size-7 rounded-full bg-primary-gradient text-white shrink-0">
            <User size={13} strokeWidth={2} />
          </div>
          <span className="text-[0.875rem] font-medium text-on-surface">Raymond</span>
          <ChevronDown size={13} className="text-on-surface-variant" />
        </button>
      </div>
    </header>
  );
}
