"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, AlertCircle, CheckCircle, Info, X, Download, ArrowRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ValidationResult, ColumnMapping } from "@/lib/types";

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

// Simulated auto-detected column mapping
const MOCK_COLUMNS = [
  "week", "paid_search_spend", "paid_search_impressions",
  "social_meta_spend", "social_meta_impressions",
  "youtube_spend", "youtube_impressions",
  "email_spend", "email_sends",
  "display_spend", "display_impressions",
  "is_holiday", "price_index", "revenue",
];

const SEVERITY_STYLES = {
  error:   { icon: AlertCircle, bg: "bg-error/5",   border: "border-l-error",   text: "text-error",   label: "Error" },
  warning: { icon: AlertCircle, bg: "bg-surface-warning", border: "border-l-primary", text: "text-primary", label: "Warning" },
  info:    { icon: Info,        bg: "bg-info/5",    border: "border-l-info",    text: "text-info",    label: "Info" },
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

function ColumnMappingStep({
  columns,
  onConfirm,
  onBack,
}: {
  columns: string[];
  onConfirm: (mapping: ColumnMapping) => void;
  onBack: () => void;
}) {
  const dateColCandidates = columns.filter((c) => /date|week|month|time|period/i.test(c));
  const kpiColCandidates = columns.filter((c) => /revenue|sales|conversion|order|kpi/i.test(c));
  const spendColCandidates = columns.filter((c) => /spend|cost|budget/i.test(c));
  const impressionColCandidates = columns.filter((c) => /impression|click|reach|send|view/i.test(c));
  const controlColCandidates = columns.filter(
    (c) => !dateColCandidates.includes(c) && !kpiColCandidates.includes(c)
         && !spendColCandidates.includes(c) && !impressionColCandidates.includes(c)
  );

  const [timeCol, setTimeCol] = useState(dateColCandidates[0] ?? "");
  const [kpiCol, setKpiCol] = useState(kpiColCandidates[0] ?? "");
  const [kpiType, setKpiType] = useState<"revenue" | "non_revenue">("revenue");
  const [spendCols, setSpendCols] = useState<Set<string>>(new Set(spendColCandidates));
  const [mediaCols, setMediaCols] = useState<Set<string>>(new Set(impressionColCandidates));
  const [controlCols, setControlCols] = useState<Set<string>>(new Set(controlColCandidates));

  const toggleCol = (set: Set<string>, col: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(col)) next.delete(col); else next.add(col);
    setter(next);
  };

  const handleConfirm = () => {
    onConfirm({
      time_col: timeCol,
      kpi_col: kpiCol,
      kpi_type: kpiType,
      spend_cols: Array.from(spendCols),
      media_cols: Array.from(mediaCols),
      control_cols: Array.from(controlCols),
    });
  };

  return (
    <div className="space-y-5 animate-fade-up">
      <div
        className="bg-surface-lowest rounded-card p-5"
        style={{ boxShadow: "var(--shadow-float)" }}
      >
        <h3 className="text-sm font-semibold text-on-surface mb-1">
          Review Column Mapping
        </h3>
        <p className="text-xs text-on-surface-variant mb-4">
          Confirm how each CSV column maps to Meridian's inputs. We auto-detected these from column names.
        </p>

        <div className="space-y-4">
          {/* Date Column */}
          <div>
            <label className="text-label-md text-on-surface-variant font-medium block mb-1">
              Date Column <span className="text-error">*</span>
            </label>
            <select
              value={timeCol}
              onChange={(e) => setTimeCol(e.target.value)}
              className="w-full h-10 px-3 rounded-[10px] bg-surface-lowest border border-outline text-sm text-on-surface focus-ring"
            >
              {columns.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* KPI Column + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-label-md text-on-surface-variant font-medium block mb-1">
                KPI Column <span className="text-error">*</span>
              </label>
              <select
                value={kpiCol}
                onChange={(e) => setKpiCol(e.target.value)}
                className="w-full h-10 px-3 rounded-[10px] bg-surface-lowest border border-outline text-sm text-on-surface focus-ring"
              >
                {columns.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-label-md text-on-surface-variant font-medium block mb-1">
                KPI Type
              </label>
              <div className="flex gap-2 mt-1">
                {(["revenue", "non_revenue"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setKpiType(t)}
                    className={cn(
                      "flex-1 h-10 rounded-[10px] text-xs font-medium border transition-colors",
                      kpiType === t
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-surface-lowest border-outline text-on-surface-variant hover:bg-surface-low"
                    )}
                  >
                    {t === "revenue" ? "Revenue" : "Non-Revenue"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Spend Columns */}
          <div>
            <label className="text-label-md text-on-surface-variant font-medium block mb-1.5">
              Spend Columns <span className="text-error">*</span>
              <span className="text-on-surface-variant font-normal ml-1">({spendCols.size} selected)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {columns.filter((c) => c !== timeCol && c !== kpiCol).map((c) => (
                <button
                  key={c}
                  onClick={() => toggleCol(spendCols, c, setSpendCols)}
                  className={cn(
                    "px-2.5 py-1 rounded-badge text-xs font-medium border transition-colors",
                    spendCols.has(c)
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-surface-lowest border-outline text-on-surface-variant hover:bg-surface-low"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Impression Columns (optional) */}
          <div>
            <label className="text-label-md text-on-surface-variant font-medium block mb-1.5">
              Impression / Reach Columns
              <span className="text-on-surface-variant font-normal ml-1">(optional, {mediaCols.size} selected)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {columns.filter((c) => c !== timeCol && c !== kpiCol && !spendCols.has(c)).map((c) => (
                <button
                  key={c}
                  onClick={() => toggleCol(mediaCols, c, setMediaCols)}
                  className={cn(
                    "px-2.5 py-1 rounded-badge text-xs font-medium border transition-colors",
                    mediaCols.has(c)
                      ? "bg-info/10 border-info text-info"
                      : "bg-surface-lowest border-outline text-on-surface-variant hover:bg-surface-low"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Control Columns (optional) */}
          <div>
            <label className="text-label-md text-on-surface-variant font-medium block mb-1.5">
              Control Variables
              <span className="text-on-surface-variant font-normal ml-1">(optional, {controlCols.size} selected)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {columns.filter((c) => c !== timeCol && c !== kpiCol && !spendCols.has(c) && !mediaCols.has(c)).map((c) => (
                <button
                  key={c}
                  onClick={() => toggleCol(controlCols, c, setControlCols)}
                  className={cn(
                    "px-2.5 py-1 rounded-badge text-xs font-medium border transition-colors",
                    controlCols.has(c)
                      ? "bg-grade-elite/10 border-grade-elite text-grade-elite"
                      : "bg-surface-lowest border-outline text-on-surface-variant hover:bg-surface-low"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Priors — Coming Soon */}
      <div
        className="bg-surface-lowest rounded-card p-5 flex items-start gap-3"
        style={{ boxShadow: "var(--shadow-float)" }}
      >
        <Lock size={16} className="text-on-surface-variant mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-on-surface">Upload Custom Priors</p>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Coming soon — set informative priors from past studies or calibration experiments to improve model accuracy.
          </p>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0" style={{ background: "var(--surface-container)", color: "var(--on-surface-variant)" }}>
          Soon
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="h-10 px-4 rounded-[12px] bg-surface-lowest border border-outline text-on-surface text-sm font-medium hover:bg-surface-low transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleConfirm}
          disabled={!timeCol || !kpiCol || spendCols.size < 2}
          className="flex-1 flex items-center justify-center gap-2 h-10 rounded-[12px] bg-primary-gradient text-white font-semibold text-sm btn-primary-lift disabled:opacity-40"
        >
          Confirm & Train Model
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

export function CSVUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [validating, setValidating] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [showMapping, setShowMapping] = useState(false);
  const [training, setTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");

  const onDrop = useCallback(async (accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    setShowMapping(false);
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

  const handleMappingConfirm = async (_mapping: ColumnMapping) => {
    setTraining(true);
    const steps: [number, string][] = [
      [10, "Preparing your data…"],
      [25, "Dispatching to GPU (T4)…"],
      [40, "Running MCMC sampling — this takes a few minutes…"],
      [60, "Estimating channel contributions…"],
      [75, "Fitting Hill saturation curves…"],
      [88, "Running budget optimizer…"],
      [95, "Generating AI insights…"],
      [100, "Complete! Loading Model Health…"],
    ];
    for (const [pct, msg] of steps) {
      await new Promise((r) => setTimeout(r, 1400));
      setProgress(pct);
      setProgressMsg(msg);
    }
    await new Promise((r) => setTimeout(r, 800));
    window.location.href = "/model-health";
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

      {/* Step indicators */}
      <div className="flex items-center gap-2 text-xs text-on-surface-variant animate-fade-up">
        <span className={cn("px-2 py-0.5 rounded-badge font-semibold", !result ? "bg-primary/10 text-primary" : "bg-grade-elite/10 text-grade-elite")}>
          1. Upload
        </span>
        <span className="text-outline">→</span>
        <span className={cn("px-2 py-0.5 rounded-badge font-semibold", result && !showMapping ? "bg-primary/10 text-primary" : result ? "bg-grade-elite/10 text-grade-elite" : "bg-surface-container text-on-surface-variant")}>
          2. Validate
        </span>
        <span className="text-outline">→</span>
        <span className={cn("px-2 py-0.5 rounded-badge font-semibold", showMapping ? "bg-primary/10 text-primary" : "bg-surface-container text-on-surface-variant")}>
          3. Map Columns
        </span>
        <span className="text-outline">→</span>
        <span className="px-2 py-0.5 rounded-badge font-semibold bg-surface-container text-on-surface-variant">
          4. Train
        </span>
      </div>

      {/* Column Mapping Step */}
      {showMapping && (
        <ColumnMappingStep
          columns={MOCK_COLUMNS}
          onConfirm={handleMappingConfirm}
          onBack={() => setShowMapping(false)}
        />
      )}

      {/* Drop zone — hide when mapping is shown */}
      {!showMapping && (
        <>
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
                    result.status === "warnings" ? "bg-surface-warning" : "bg-error/10"
                  )}
                >
                  {result.status === "pass"
                    ? <CheckCircle size={20} className="text-grade-elite" />
                    : <AlertCircle size={20} className={result.status === "errors" ? "text-error" : "text-primary"} />
                  }
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-on-surface">
                    {result.status === "pass"     ? "Data looks great! Ready to configure."
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

              {/* CTA — proceed to column mapping */}
              {result.can_proceed && (
                <button
                  onClick={() => setShowMapping(true)}
                  className="w-full flex items-center justify-center gap-2 h-12 rounded-[12px] bg-primary-gradient text-white font-semibold text-sm btn-primary-lift"
                >
                  Review Column Mapping
                  <ArrowRight size={14} />
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
                  { label: "Date column",       desc: "Weekly or monthly dates (2+ years ideal)",           required: true  },
                  { label: "Spend per channel",  desc: "One column per marketing channel",                  required: true  },
                  { label: "Revenue / KPI",      desc: "Your primary success metric",                       required: true  },
                  { label: "Impressions",        desc: "Optional — improves model accuracy",                required: false },
                  { label: "Control variables",  desc: "Holiday flags, pricing, competitor activity",       required: false },
                  { label: "Population",         desc: "For multi-geo models (national models auto-fill)",  required: false },
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
        </>
      )}
    </div>
  );
}
