"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

export function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div
      className="flex items-center justify-between gap-4 px-6 py-2 text-xs font-medium"
      style={{
        background: "var(--accent-primary)",
        color: "#ffffff",
        height: "40px",
      }}
    >
      <div className="flex items-center gap-2">
        <AlertTriangle size={14} />
        <span>
          <strong>Demo version</strong> — Do not upload sensitive data. All results shown are simulated from sample data.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss banner"
      >
        <X size={14} />
      </button>
    </div>
  );
}
