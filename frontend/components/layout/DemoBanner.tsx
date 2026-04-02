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
        background: "linear-gradient(90deg, #855300 0%, #D97706 100%)",
        color: "#fff",
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
        className="opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Dismiss banner"
      >
        <X size={14} />
      </button>
    </div>
  );
}
