"""Claude-powered chat agent for the MktgCompass AI Strategist."""

from __future__ import annotations

import json
import os
from typing import AsyncGenerator, Optional

import anthropic

from models.schemas import ChatMessage, DashboardResults

SYSTEM_PROMPT = """You are the MktgCompass AI Strategist — a friendly, expert marketing analyst
who helps non-technical marketers understand their Meridian MMM results.

PERSONALITY:
- Warm, approachable, and encouraging
- Explains Bayesian modeling concepts in plain English with analogies
- Never uses jargon without explaining it immediately
- Proactively suggests actions ("Based on the Hill curve, I'd recommend...")
- Celebrates wins ("Your Email channel has an outstanding 7.3x ROI!")

CAPABILITIES:
- Answer questions about Meridian model results in plain English
- Explain what incremental ROI, CPIK, Hill curves, and adstock mean
- Run what-if budget scenarios
- Suggest budget reallocation based on Hill saturation curves and the Meridian optimizer
- Flag potential issues (channels past half-saturation, wide credible intervals, convergence concerns)
- Educate users on Bayesian MMM concepts when asked

KEY MERIDIAN CONCEPTS (use these correctly):
- "Incremental ROI" (not ROAS): Revenue generated per $1 of spend, as attributed by the model
- "CPIK" (Cost Per Incremental KPI): How much it costs to generate one unit of incremental outcome
- "Hill curve": The saturation/response function — response = spend^slope / (spend^slope + ec^slope)
- "ec" (half-saturation point): The spend level where the channel reaches 50% of its maximum response
- "slope": How steep the curve is — higher slope = sharper diminishing returns after ec
- "Adstock/carryover": How long a channel's impact persists after spend stops (geometric decay)
- "Credible interval" (not confidence interval): Bayesian posterior uncertainty range, typically 90%
- "R-hat": MCMC convergence diagnostic — values < 1.1 mean the model converged properly
- "Intercept": Baseline demand that exists without any marketing spend

CONSTRAINTS:
- Always caveat uncertainty: "The model estimates X with a 90% credible interval of [Y, Z]"
- Remind users this is a demo version if they try to make real budget decisions
- Keep responses concise (2-4 paragraphs max)
- Use numbers from the context when available
- If asked about things outside MMM scope, redirect helpfully

FORMATTING:
- Use plain prose, no markdown headers
- Use bullet points sparingly
- Lead with the key insight, then explain
"""


def _build_context(results: Optional[dict]) -> str:
    if not results:
        return "No model results available yet. The user is in demo mode."
    try:
        d = DashboardResults(**results)
        ov = d.overview

        top_channel = max(d.efficiency_matrix, key=lambda c: c.roi)
        worst_channel = min(d.efficiency_matrix, key=lambda c: c.roi)

        # Find channel closest to / past half-saturation
        most_saturated = None
        if d.hill_curves:
            most_saturated = max(
                d.hill_curves,
                key=lambda c: c.current_spend / c.ec if c.ec > 0 else 0,
            )

        context = f"""
CURRENT MODEL RESULTS (use these numbers when answering):
- Total Revenue: ${ov.total_revenue:,.0f} ({ov.total_revenue_delta:+.1f}% vs prior period)
- Incremental ROI: {ov.incremental_roi:.2f}x (90% CI: [{ov.incremental_roi_ci[0]:.2f}x, {ov.incremental_roi_ci[1]:.2f}x])
- Model Fit (R²): {ov.model_r_squared:.2f}
- Incremental Revenue: ${ov.incremental_revenue:,.0f} (90% CI: [${ov.incremental_revenue_ci[0]:,.0f}, ${ov.incremental_revenue_ci[1]:,.0f}])

CHANNEL PERFORMANCE (sorted by ROI):
{chr(10).join(f"- {c.channel}: ROI {c.roi:.2f}x (90% CI: [{c.roi_ci[0]:.2f}x, {c.roi_ci[1]:.2f}x]), CPIK ${c.cpik:.2f}, Grade {c.grade} ({c.grade_label}), Spend ${c.spend:,.0f}" for c in d.efficiency_matrix)}

TOP PERFORMER: {top_channel.channel} at {top_channel.roi:.2f}x incremental ROI
NEEDS ATTENTION: {worst_channel.channel} at {worst_channel.roi:.2f}x incremental ROI"""

        if most_saturated:
            sat_ratio = most_saturated.current_spend / most_saturated.ec if most_saturated.ec > 0 else 0
            sat_label = "past" if sat_ratio > 1 else "approaching" if sat_ratio > 0.8 else "below"
            context += f"""
SATURATION STATUS: {most_saturated.channel} is {sat_label} its half-saturation point (ec=${most_saturated.ec:,.0f}, current spend=${most_saturated.current_spend:,.0f}, slope={most_saturated.slope:.1f})"""

        if d.hill_curves:
            context += f"""

HILL CURVE PARAMETERS:
{chr(10).join(f"- {h.channel}: ec=${h.ec:,.0f} (90% CI: [${h.ec_ci[0]:,.0f}, ${h.ec_ci[1]:,.0f}]), slope={h.slope:.1f}" for h in d.hill_curves)}"""

        context += f"""

MODEL HEALTH:
- R²: {d.model_health.fit_metrics.r_squared:.2f}, MAPE: {d.model_health.fit_metrics.mape:.1f}%, WMAPE: {d.model_health.fit_metrics.wmape:.1f}%
- Convergence: {d.model_health.convergence_status}

BUDGET RECOMMENDATION:
- Current total: ${d.budget_optimization.total_budget:,.0f}
- Projected lift from reallocation: +{d.budget_optimization.projected_lift_pct}%
- {d.budget_optimization.credible_interval}"""

        return context
    except Exception:
        return "Model results available but couldn't be parsed."


async def stream_response(
    message: str,
    history: list[ChatMessage],
    results: Optional[dict] = None,
) -> AsyncGenerator[str, None]:
    client = anthropic.AsyncAnthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    context = _build_context(results)
    system = f"{SYSTEM_PROMPT}\n\n{context}"

    messages = [{"role": m.role, "content": m.content} for m in history[-10:]]
    messages.append({"role": "user", "content": message})

    async with client.messages.stream(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=system,
        messages=messages,
    ) as stream:
        async for text in stream.text_stream:
            yield text
