"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, AlertCircle, CheckCircle, Info, X, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ValidationResult } from "@/lib/types";

const MOCK_VALIDATION: ValidationResult = {
  status: "warnings",
  can_proceed: true,
  issues: [
    {
      severity: "warning",
      category: "quality",
      what: "Paid Search and Google Shopping spend are highly correlated (r=0.89)",
      why: "When two channels always move together, the model has trouble separating their individual effects. Think of it like trying to credit either the drums or bass when they always play the same rhythm.",
      fix: "The model will still run, but ROI estimates for these two channels will be less precise. Look for periods where you changed one without the other.",
      column: "paid_search_spend",
    },
    {
      severity: "info",
      category: "completeness",
      what: "No control variables detected (seasonality, pricing, promotions)",
      why: "Control variables help the model account for things that affect revenue but aren't marketing. Without them, some revenue might get incorrectly attributed to your channels.",
      fix: "Consider adding columns like: is_holiday, month_of_year, price_index, or competitor_activity.",
    },
  ],
  data_summary: {
    row_count: 104,
    column_count: 9,
    date_range: "Jan 2024 — Dec 2025",
    channels_detected: ["Paid Search", "Social Meta", "YouTube", "Email", "Display"],
    kpi_column: "revenue",
    total_spend: 122_800,
    total_kpi: 1_420_850,
  },
};

const SEVERITY_STYLES = {
  error:   { icon: AlertCircle,    bg: "bg-error/5",   border: "border-l-error",   text: "text-error",   label: "Error" },
  warning: { icon: AlertCircle,    bg: "bg-[#FFFBEB]", border: "border-l-primary", text: "text-primary", label: "Warning" },
  info:    { icon: Info,           bg: "bg-info/5",    border: "border-l-info",    text: "text-info",    label: "Info" },
};

interface IssueCardProps {
  issue: ValidationResult["issues"][0];
}

function IssueCard({ issue }: IssueCardProps) {
  const [open, setOpen] = useState(false);
  const s = SEVERITY_STYLES[issue.severity];
  const Icon = s.icon;

  return (
    <div className={cn("rounded-[12px] p-4 border-l-4", s.bg, s.border)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Icon size={16} className={cn("mt-0.5 shrink-0", s.text)} />
          <div>
            <span className={cn("text-xs font-bold uppercase tracking-wider", s.text)}>
              {s.label}
            </span>
            <p className="text-sm font-medium text-on-surface mt-0.5">{issue.what}</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
        >
          {open ? "Less" : "Why?"}
        </button>
      </div>

      {open && (
        <div className="mt-3 ml-7 space-y-2 text-sm text-on-surface-variant">
          <p><strong className="text-on-surface">Why it matters:</strong> {issue.why}</p>
          <p><strong className="text-on-surface">How to fix:</strong> {issue.fix}</p>
        </div>
      )}
    </div>
  );
}

export function CSVUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [validating, setValidating] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [training, setTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");

  const onDrop = useCallback(async (accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    setValidating(true);

    // Simulate validation (2s)
    await new Promise((r) => setTimeout(r, 2000));
    setResult(MOCK_VALIDATION);
    setValidating(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"], "application/vnd.ms-excel": [".csv"] },
    maxFiles: 1,
  });

  const startTraining = async () => {
    setTraining(true);
    const steps: [number, string][] = [
      [10, "Preparing your data…"],
      [25, "Dispatching to GPU…"],
      [40, "Running MCMC sampling (this takes a few minutes)…"],
      [60, "Estimating channel contributions…"],
      [75, "Calculating saturation curves…"],
      [88, "Optimizing budget allocation…"],
      [95, "Generating insights…"],
      [100, "Complete! Loading your dashboard…"],
    ];
    for (const [pct, msg] of steps) {
      await new Promise((r) => setTimeout(r, 1400));
      setProgress(pct);
      setProgressMsg(msg);
    }
    // In real app: redirect to dashboard
    await new Promise((r) => setTimeout(r, 800));
    window.location.href = "/";
  };

  if (training) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 max-w-[520px] mx-auto">
        <div
          className="text-center animate-fade-up"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <h2 className="text-headline-md font-bold text-on-surface">Training your model</h2>
          <p className="text-body-md text-on-surface-variant mt-2">
            Meridian is running on a T4 GPU. This usually takes 5–15 minutes.
          </p>
        </div>

        <div className="w-full space-y-3 animate-fade-up" style={{ "--stagger-delay": "60ms" } as React.CSSProperties}>
          <div className="flex justify-between text-sm font-medium">
            <span className="text-on-surface-variant">{progressMsg}</span>
            <span className="text-on-surface font-mono">{progress}%</span>
          </div>
          <div className="h-2 bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-gradient rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 w-full animate-fade-up" style={{ "--stagger-delay": "120ms" } as React.CSSProperties}>
          {[
            ["MCMC Chains", "4 of 4"],
            ["Iterations", `${Math.floor(progress * 20)}/2000`],
            ["R-hat", progress > 80 ? "1.003 ✓" : "..."],
          ].map(([label, value]) => (
            <div key={label} className="bg-surface-lowest rounded-[12px] p-4 text-center" style={{ boxShadow: "var(--shadow-float)" }}>
              <p className="text-label-md text-on-surface-variant">{label}</p>
              <p className="text-sm font-semibold font-mono text-on-surface mt-1">{value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto space-y-6">
      <div className="animate-fade-up">
        <h1
          className="text-headline-md font-bold text-on-surface"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Upload Your Marketing Data
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Upload a CSV with weekly or monthly spend and revenue data. We'll handle the rest.
        </p>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-4 p-12 rounded-card border-2 border-dashed cursor-pointer transition-all animate-fade-up",
          isDragActive
            ? "border-primary bg-primary/5"
            : file
            ? "border-grade-elite bg-grade-elite/5"
            : "border-outline-variant bg-surface-lowest hover:border-primary hover:bg-primary/3"
        )}
        style={{ "--stagger-delay": "60ms" } as React.CSSProperties}
      >
        <input {...getInputProps()} />
        <div
          className={cn(
            "flex items-center justify-center size-14 rounded-[16px]",
            file ? "bg-grade-elite/10" : "bg-surface-container"
          )}
        >
          {file ? (
            <CheckCircle size={28} className="text-grade-elite" />
          ) : (
            <Upload size={28} className="text-on-surface-variant" strokeWidth={1.25} />
          )}
        </div>

        {file ? (
          <div className="text-center">
            <p className="text-sm font-semibold text-on-surface">{file.name}</p>
            <p className="text-xs text-on-surface-variant mt-1">
              {(file.size / 1024).toFixed(1)} KB · Click to replace
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null); }}
              className="mt-2 text-xs text-error hover:opacity-70 transition-opacity flex items-center gap-1 mx-auto"
            >
              <X size={12} /> Remove file
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm font-semibold text-on-surface">
              {isDragActive ? "Drop it here" : "Drop your CSV here or click to browse"}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              Weekly or monthly data · .csv files only
            </p>
          </div>
        )}
      </div>

      {/* Download template */}
      <a
        href="/sample_data.csv"
        download
        className="flex items-center gap-2 text-sm font-medium text-primary hover:opacity-70 transition-opacity animate-fade-up"
        style={{ "--stagger-delay": "120ms" } as React.CSSProperties}
      >
        <Download size={14} />
        Download sample data template (104 weeks)
      </a>

      {/* Validating */}
      {validating && (
        <div className="flex items-center gap-3 bg-surface-lowest rounded-card p-4 animate-fade-up" style={{ boxShadow: "var(--shadow-float)" }}>
          <div className="size-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-on-surface-variant">Checking your data quality…</p>
        </div>
      )}

      {/* Validation results */}
      {result && (
        <div className="space-y-4 animate-fade-up">
          {/* Summary */}
          <div
            className="flex items-start gap-4 bg-surface-lowest rounded-card p-5"
            style={{ boxShadow: "var(--shadow-float)" }}
          >
            <div
              className={cn(
                "flex items-center justify-center size-10 rounded-[12px] shrink-0",
                result.status === "pass" ? "bg-grade-elite/10" :
                result.status === "warnings" ? "bg-[#FFFBEB]" : "bg-error/10"
              )}
            >
              {result.status === "pass"
                ? <CheckCircle size={20} className="text-grade-elite" />
                : <AlertCircle size={20} className={result.status === "errors" ? "text-error" : "text-primary"} />
              }
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-on-surface">
                {result.status === "pass"     ? "Data looks great! Ready to model."
                : result.status === "warnings" ? "Data is good — a few things to be aware of"
                :                               "Issues found — please review before training"}
              </p>
              <div className="grid grid-cols-3 gap-3 mt-3">
                {[
                  ["Date Range",  result.data_summary.date_range],
                  ["Rows",        result.data_summary.row_count.toString()],
                  ["Channels",    result.data_summary.channels_detected.length.toString()],
                ].map(([k, v]) => (
                  <div key={k} className="text-xs">
                    <span className="text-on-surface-variant">{k}: </span>
                    <span className="font-semibold text-on-surface">{v}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-on-surface-variant mt-2">
                Channels: {result.data_summary.channels_detected.join(", ")}
              </p>
            </div>
          </div>

          {/* Issues */}
          {result.issues.length > 0 && (
            <div className="space-y-3">
              {result.issues.map((issue, i) => <IssueCard key={i} issue={issue} />)}
            </div>
          )}

          {/* CTA */}
          {result.can_proceed && (
            <button
              onClick={startTraining}
              className="w-full h-12 rounded-[12px] bg-primary-gradient text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Run Marketing Mix Model →
            </button>
          )}
        </div>
      )}

      {/* What to include */}
      {!file && (
        <div className="bg-surface-lowest rounded-card p-5 animate-fade-up" style={{ boxShadow: "var(--shadow-float)", "--stagger-delay": "180ms" } as React.CSSProperties}>
          <div className="flex items-center gap-2 mb-3">
            <FileText size={16} className="text-on-surface-variant" />
            <h3 className="text-sm font-semibold text-on-surface">What to include in your CSV</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Date column",    desc: "Weekly or monthly dates (2+ years ideal)",  required: true  },
              { label: "Spend per channel", desc: "One column per marketing channel",          required: true  },
              { label: "Revenue / KPI",  desc: "Your primary success metric",               required: true  },
              { label: "Impressions",    desc: "Optional but improves reach/frequency modeling", required: false },
              { label: "Seasonality",    desc: "Holiday flags, promo periods",              required: false },
              { label: "Price index",    desc: "Price changes that affect demand",          required: false },
            ].map(({ label, desc, required }) => (
              <div key={label} className="flex items-start gap-2 text-xs">
                <span className={cn(
                  "mt-0.5 shrink-0 size-4 rounded-full flex items-center justify-center text-[9px] font-bold",
                  required ? "bg-grade-elite/10 text-grade-elite" : "bg-surface-container text-on-surface-variant"
                )}>
                  {required ? "✓" : "?"}
                </span>
                <div>
                  <span className="font-medium text-on-surface">{label}</span>
                  <p className="text-on-surface-variant">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
