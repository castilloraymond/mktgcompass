---
name: data-validation
description: >
  Use when validating uploaded CSV data for MMM readiness. Covers schema
  validation, data quality checks, missing value handling, multicollinearity
  detection, outlier flagging, and generating user-friendly feedback for
  non-technical marketers. Also use when building the educational data
  quality feedback UI or the idealized data template.
---

# Data Validation Skill

## Validation Pipeline
Run checks in this exact order. Each check returns structured feedback.
All feedback must be written for non-technical marketers (no jargon).

### Step 1: Parse & Schema Check
```python
def validate_schema(df: pd.DataFrame, config: dict) -> list[Issue]:
    checks = [
        # Can we parse the date column?
        # Are there at least 2 media/spend columns?
        # Is there a KPI column with numeric values?
        # Are column names unique?
        # Are numeric columns actually numeric (strip $, commas first)?
    ]
```

**Common user mistakes to catch:**
- Dollar signs in spend columns ("$1,234.56" → 1234.56)
- Comma-separated thousands
- Date formats: auto-detect (YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY, etc.)
- Column headers with trailing spaces
- BOM characters in CSV (common from Excel exports)

### Step 2: Completeness Check
```python
def validate_completeness(df: pd.DataFrame) -> list[Issue]:
    checks = [
        # Minimum 52 rows (weeks) — ERROR if < 26, WARNING if < 52
        # 104+ weeks ideal — INFO if < 104
        # No gaps in date sequence
        # Missing value percentage per column (flag > 10%)
        # Zero/negative KPI rows (flag if > 5%)
        # Any channel with all-zero spend
    ]
```

### Step 3: Quality Check
```python
def validate_quality(df: pd.DataFrame) -> list[Issue]:
    checks = [
        # Multicollinearity: correlation matrix, flag pairs > 0.85
        # Zero variance: channels that never change spend
        # Outliers: values > 3 std devs from mean
        # KPI stationarity: basic augmented Dickey-Fuller test
        # Spend-KPI ratio: flag if any channel spend > KPI
        # Temporal patterns: flag if spend is identical across weeks
    ]
```

### Step 4: Meridian-Specific Checks
```python
def validate_meridian_readiness(df: pd.DataFrame, config: dict) -> list[Issue]:
    checks = [
        # Enough channels (at least 2) to decompose effects
        # Control variables present (at least seasonality)
        # Data granularity consistent (all weekly or all monthly)
        # No future dates in the dataset
        # KPI and spend in same time alignment
    ]
```

## Feedback Schema
```python
class Issue(BaseModel):
    severity: Literal["error", "warning", "info"]  # error blocks model run
    category: str       # "schema", "completeness", "quality", "readiness"
    what: str           # Plain English: "Your dataset has 38 weeks of data"
    why: str            # Why it matters: "MMM needs at least a year to separate..."
    fix: str            # How to fix: "Add more historical data if available"
    column: str | None  # Which column (if applicable)
    
class ValidationResult(BaseModel):
    status: Literal["pass", "warnings", "errors"]
    can_proceed: bool           # True if no errors (warnings OK)
    issues: list[Issue]
    data_summary: DataSummary   # Basic stats about the upload
    
class DataSummary(BaseModel):
    row_count: int
    column_count: int
    date_range: str             # "Jan 2024 — Dec 2025"
    channels_detected: list[str]
    kpi_column: str
    total_spend: float
    total_kpi: float
```

## Example Feedback Messages

### Error (blocks model)
```json
{
  "severity": "error",
  "what": "Your dataset only has 18 weeks of data",
  "why": "Marketing Mix Models need at least 6 months of weekly data to reliably separate the effects of different channels from seasonal patterns. With only 18 weeks, the model can't tell if a spike in revenue was caused by your ad spend or just holiday shopping.",
  "fix": "Try to gather at least 52 weeks (1 year) of data. If you have monthly data going back further, that could work too — upload it and we'll check."
}
```

### Warning (degrades quality)
```json
{
  "severity": "warning",
  "what": "Your Paid Search and Google Shopping spend are highly correlated (r=0.91)",
  "why": "When two channels always go up and down together, the model struggles to figure out which one is actually driving results. It's like trying to credit either the drums or bass when they always play the same rhythm.",
  "fix": "This is common and the model will still run, but the ROI estimates for these two channels will be less precise. If possible, look for periods where you changed one without the other."
}
```

### Info (FYI)
```json
{
  "severity": "info",
  "what": "No control variables detected (like seasonality or pricing)",
  "why": "Control variables help the model account for things that affect revenue but aren't marketing — like holiday seasons, price changes, or economic conditions. Without them, some of that effect might get incorrectly attributed to your marketing channels.",
  "fix": "Consider adding columns for: seasonal indicators (is_holiday, month_of_year), pricing changes, or major promotions. The model will still work without them, but results will be more accurate with them."
}
```

## Idealized Data Template
Generate a downloadable sample CSV with this structure:
- 104 rows (2 years, weekly)
- Columns: week, paid_search_spend, paid_search_impressions, social_meta_spend, social_meta_impressions, youtube_spend, youtube_impressions, email_spend, email_sends, display_spend, display_impressions, is_holiday, price_index, competitor_activity, revenue
- Realistic-looking synthetic data with appropriate seasonality and channel correlations
- Include this as `sample_data.csv` in the repo for testing
