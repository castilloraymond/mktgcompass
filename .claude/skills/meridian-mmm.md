---
name: meridian-mmm
description: >
  Use when working on Google Meridian MMM model training, configuration, result
  interpretation, or budget optimization. Trigger for any task involving MCMC
  sampling, posterior analysis, channel contribution estimation, saturation curves,
  adstock modeling, or transforming Meridian outputs into dashboard-ready JSON.
  Also trigger when debugging Modal GPU functions or Meridian installation issues.
---

# Meridian MMM Skill

## Meridian Basics
- Google Meridian v1.5.x, installed via `pip install google-meridian[and-cuda]`
- Requires Python 3.11-3.13, GPU recommended (T4 minimum, 16GB VRAM)
- Uses NUTS sampler (No U-Turn Sampler) for Bayesian MCMC inference
- Built on JAX, not PyTorch — GPU via CUDA toolkit
- Docs: https://developers.google.com/meridian
- GitHub: https://github.com/google/meridian

## Core Classes
```python
from meridian.data import input_data as input_data_lib
from meridian.model import model as model_lib
from meridian.model import spec as spec_lib
from meridian import optimizer as optimizer_lib
from meridian import visualizer as visualizer_lib
```

## Data Preparation Pattern
```python
# 1. Define channel-to-column mapping
coord_to_columns = input_data_lib.CoordToColumns(
    time="week",                          # date column
    geo="geo",                            # geo column (optional, use for geo-level)
    media=["ch_search", "ch_social"],     # impression/reach columns
    media_spend=["sp_search", "sp_social"], # spend columns (same order as media)
    controls=["seasonality", "promo"],     # control variables
    kpi="revenue",                         # target KPI
    population="population",               # population column (optional, for geo)
)

# 2. Create InputData object
input_data = input_data_lib.InputData(
    df=cleaned_dataframe,
    coord_to_columns=coord_to_columns,
)
```

## Model Training Pattern
```python
# 3. Define model spec (mostly defaults are fine for MVP)
model_spec = spec_lib.ModelSpec(
    max_lag=8,              # weeks of adstock carryover
    hill_before_adstock=False,  # standard: adstock then saturation
)

# 4. Create and fit model
mmm = model_lib.Meridian(
    input_data=input_data,
    model_spec=model_spec,
)

# 5. Sample (this is the expensive GPU part)
mmm.sample(
    n_chains=4,
    n_adapt=500,
    n_burnin=500,
    n_keep=1000,
    seed=42,
)
```

## Modal Deployment Pattern
```python
import modal

app = modal.App("mktgcompass-meridian")

meridian_image = (
    modal.Image.debian_slim(python_version="3.12")
    .pip_install(
        "google-meridian[and-cuda]==1.5.3",
        "pandas",
        "numpy",
    )
)

@app.function(
    gpu="T4",
    timeout=1800,       # 30 min max
    image=meridian_image,
    retries=1,
)
def train_meridian(config: dict, data_csv_b64: str) -> dict:
    """
    Train a Meridian model on Modal GPU.
    
    Args:
        config: Model configuration (channels, KPI, controls, etc.)
        data_csv_b64: Base64-encoded CSV data
    
    Returns:
        dict with model results ready for dashboard
    """
    import base64
    import io
    import pandas as pd
    from meridian.data import input_data as input_data_lib
    from meridian.model import model as model_lib
    
    # Decode CSV
    csv_bytes = base64.b64decode(data_csv_b64)
    df = pd.read_csv(io.BytesIO(csv_bytes))
    
    # Build model from config, train, extract results
    # ... (implementation)
    
    return {
        "overview": {...},
        "contributions": [...],
        "saturation_curves": [...],
        "efficiency_matrix": [...],
        "budget_optimization": [...],
        "diagnostics": {...},
    }
```

## Dashboard Data Schemas

### Overview Metrics
```json
{
  "total_revenue": 1420850,
  "total_revenue_delta": 12.4,
  "blended_roas": 3.85,
  "blended_roas_vs_target": 0.35,
  "weighted_cpa": 42.18,
  "weighted_cpa_delta": -4.1,
  "incrementality_lift": 18.4,
  "incrementality_confidence": "high"
}
```

### Contribution Waterfall
```json
[
  {"label": "Baseline", "value": 800000, "type": "baseline"},
  {"label": "Paid Social", "value": 240000, "type": "positive"},
  {"label": "Search", "value": 95000, "type": "positive"},
  {"label": "Discounting", "value": -45000, "type": "negative"},
  {"label": "Influencers", "value": 30000, "type": "positive"},
  {"label": "Total Revenue", "value": 1420850, "type": "total"}
]
```

### Saturation Curves
```json
[
  {
    "channel": "META (Active)",
    "current_spend": 42150,
    "saturation_pct": 85,
    "curve_points": [
      {"spend": 0, "marginal_return": 0},
      {"spend": 10000, "marginal_return": 8500},
      {"spend": 20000, "marginal_return": 15200},
      ...
    ]
  }
]
```

### Efficiency Matrix
```json
[
  {
    "channel": "Meta Ads",
    "channel_type": "Paid Social",
    "spend": 42150,
    "cpa": 32.10,
    "roas": 5.2,
    "grade": "A+",
    "grade_label": "ELITE"
  }
]
```

### Budget Optimization
```json
{
  "total_budget": 150000,
  "current_allocation": [
    {"channel": "Paid Search", "amount": 45000},
    {"channel": "Social Meta", "amount": 82500},
    {"channel": "Connected TV", "amount": 12000}
  ],
  "recommended_allocation": [
    {"channel": "Paid Search", "amount": 30000, "delta": -15000},
    {"channel": "Social Meta", "amount": 95000, "delta": 12500},
    {"channel": "Connected TV", "amount": 25000, "delta": 13000}
  ],
  "projected_lift_pct": 14.2,
  "confidence_interval": "98.4% ± 0.2"
}
```

## Common Issues and Fixes
- **"No GPU found"**: Ensure Modal function has `gpu="T4"` and image includes `[and-cuda]`
- **MCMC divergences**: Reduce model complexity, increase n_adapt, check data quality
- **R-hat > 1.1**: Increase n_keep to 2000, or simplify model (fewer channels)
- **Out of memory on T4**: Reduce n_chains from 4 to 2, or use national-level (no geo)
- **Negative ROI estimates**: Check for multicollinearity, consider informing priors
