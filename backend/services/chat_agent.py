"""Claude-powered chat agent for the MktgCompass AI Strategist."""

from __future__ import annotations

import json
import os
from typing import AsyncGenerator, Optional

import anthropic

from models.schemas import ChatMessage, DashboardResults

SYSTEM_PROMPT = """You are the MktgCompass AI Strategist — a friendly, expert marketing analyst
who helps non-technical marketers understand their campaign performance.

PERSONALITY:
- Warm, approachable, and encouraging
- Explains statistical concepts in plain English with analogies
- Never uses jargon without explaining it immediately
- Proactively suggests actions ("Based on the saturation curve, I'd recommend...")
- Celebrates wins ("Your Meta campaigns are performing really well!")

CAPABILITIES:
- Answer questions about MMM model results in plain English
- Explain what specific metrics mean and why they matter
- Run what-if budget scenarios
- Suggest budget reallocation based on saturation curves and optimization output
- Flag potential issues (channel saturation, data quality concerns)
- Educate users on MMM concepts when asked

CONSTRAINTS:
- Always caveat uncertainty: "The model estimates X with high confidence"
- Remind users this is a demo version if they try to make real budget decisions
- Keep responses concise (2–4 paragraphs max)
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
        top_channel = max(d.efficiency_matrix, key=lambda c: c.roas)
        worst_channel = min(d.efficiency_matrix, key=lambda c: c.roas)
        most_saturated = max(d.saturation_curves, key=lambda c: c.saturation_pct)
        return f"""
CURRENT MODEL RESULTS (use these numbers when answering):
- Total Revenue: ${ov.total_revenue:,.0f} ({ov.total_revenue_delta:+.1f}% vs prior period)
- Blended ROAS: {ov.blended_roas:.2f}x
- Weighted CPA: ${ov.weighted_cpa:.2f}
- Incrementality Lift: {ov.incrementality_lift}% ({ov.incrementality_confidence} confidence)

CHANNEL PERFORMANCE:
{chr(10).join(f"- {c.channel}: ROAS {c.roas:.2f}x, Grade {c.grade} ({c.grade_label}), Spend ${c.spend:,.0f}" for c in d.efficiency_matrix)}

TOP PERFORMER: {top_channel.channel} at {top_channel.roas:.2f}x ROAS
NEEDS ATTENTION: {worst_channel.channel} at {worst_channel.roas:.2f}x ROAS
MOST SATURATED: {most_saturated.channel} at {most_saturated.saturation_pct:.0f}% saturation

BUDGET RECOMMENDATION:
- Current total: ${d.budget_optimization.total_budget:,.0f}
- Projected lift from reallocation: +{d.budget_optimization.projected_lift_pct}%
"""
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
