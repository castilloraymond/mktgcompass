"use client";

import { Bell, Search, Settings, User, ChevronDown } from "lucide-react";

export function TopBar() {
  return (
    <header
      className="flex items-center justify-between gap-4 px-8 py-3 bg-surface-lowest border-b border-b-surface-container shrink-0"
      style={{ height: "56px" }}
    >
      {/* Left: section links */}
      <nav className="flex items-center gap-1">
        {["Dashboard", "Team", "Resources"].map((item) => (
          <button
            key={item}
            className="px-3 py-1.5 rounded-[8px] text-sm font-medium text-on-surface-variant hover:bg-surface-low hover:text-on-surface transition-colors"
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] text-sm text-on-surface-variant bg-surface-low hover:bg-surface-container transition-colors">
          <Search size={14} />
          <span>Search insights…</span>
          <kbd className="ml-1 text-xs text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded-[4px]">⌘K</kbd>
        </button>

        {/* Notifications */}
        <button className="relative flex items-center justify-center size-8 rounded-[8px] text-on-surface-variant hover:bg-surface-low transition-colors">
          <Bell size={16} strokeWidth={1.5} />
          <span className="absolute top-1 right-1 size-2 rounded-full bg-secondary" />
        </button>

        {/* Settings */}
        <button className="flex items-center justify-center size-8 rounded-[8px] text-on-surface-variant hover:bg-surface-low transition-colors">
          <Settings size={16} strokeWidth={1.5} />
        </button>

        {/* Avatar */}
        <button className="flex items-center gap-1.5 pl-2 pr-3 py-1 rounded-[8px] hover:bg-surface-low transition-colors">
          <div className="flex items-center justify-center size-7 rounded-full bg-primary-gradient text-white">
            <User size={14} />
          </div>
          <span className="text-sm font-medium text-on-surface">Raymond</span>
          <ChevronDown size={12} className="text-on-surface-variant" />
        </button>
      </div>
    </header>
  );
}
