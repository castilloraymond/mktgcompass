"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, Send, X, ChevronRight, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";

const STARTER_PROMPTS = [
  "Which channel has the highest incremental ROI?",
  "Why is Meta past its half-saturation point?",
  "What happens if I cut YouTube by 20%?",
  "Explain the credible intervals in plain English",
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 animate-fade-up">
      <div className="flex items-center justify-center size-7 rounded-full bg-surface-container shrink-0">
        <Bot size={14} className="text-secondary" />
      </div>
      <div className="flex items-center gap-1 bg-surface-lowest rounded-2xl rounded-bl-sm px-4 py-3 shadow-float">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block size-1.5 rounded-full bg-outline animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function Message({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={cn("flex items-end gap-2 animate-fade-up", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex items-center justify-center size-7 rounded-full shrink-0",
          isUser ? "bg-primary-gradient text-white" : "bg-surface-container"
        )}
      >
        {isUser ? <User size={14} /> : <Bot size={14} className="text-secondary" />}
      </div>
      <div
        className={cn(
          "max-w-[85%] px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-secondary text-white rounded-2xl rounded-br-sm"
            : "bg-surface-lowest text-on-surface rounded-2xl rounded-bl-sm shadow-float"
        )}
      >
        {msg.content}
      </div>
    </div>
  );
}

export function ChatPanel() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your MktgCompass AI Strategist. I've analyzed your Meridian model results and I'm ready to help you understand what's driving your revenue — and where to invest next. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      // Demo mode: fake response after short delay
      await new Promise((r) => setTimeout(r, 1200));
      const responses: Record<string, string> = {
        "which channel": "Based on your Meridian model, Email has the highest incremental ROI at 7.3x (90% CI: [5.8x, 8.9x]) — meaning every $1 you spend generates $7.30 in incremental revenue that wouldn't have happened without the campaign. It's also well below its half-saturation point (ec = $22K vs current $8.4K spend), so there's significant room to scale before diminishing returns kick in.",
        "meta": "Meta Ads is currently spending $42K, which is past its half-saturation point (ec = $32K). On the Hill curve, this means you're on the steep part of diminishing returns — each additional dollar generates progressively less incremental revenue. The model estimates reallocating $7-10K from Meta to Google Search could increase incremental revenue by about $12K.",
        "youtube": "Cutting YouTube by 20% (about $3,640) would reduce incremental revenue by approximately $5,200, based on the model's response curve. That's a 1.43x incremental ROI on that marginal spend, below your portfolio average of 3.85x. However, YouTube has high adstock carryover (alpha = 0.78), meaning its effects persist for weeks — so you'd see the full impact over 5-6 weeks, not immediately.",
        "credible": "Think of credible intervals like a weather forecast range. When the model says your incremental ROI is 3.85x with a 90% credible interval of [3.22x, 4.51x], it means: given the data, there's a 90% probability the true ROI falls in that range. The narrower the interval, the more data supports the estimate. Your high-data channels (Meta, Search) have tight intervals — the model is confident. YouTube's interval is wider because there's more uncertainty in the posterior.",
      };
      const key = Object.keys(responses).find((k) => text.toLowerCase().includes(k));
      const reply =
        key
          ? responses[key]
          : "That's a great question! Based on your Meridian model results, I can see some interesting patterns. Could you be more specific about which channel or metric you're curious about? I can walk you through the incremental ROI, Hill curves, or budget optimization in plain English.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "assistant", content: reply, timestamp: new Date() },
      ]);
      setLoading(false);
    },
    [loading]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* FAB */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 rounded-button bg-primary-gradient text-white text-sm font-semibold btn-primary-lift z-40"
          style={{ boxShadow: "var(--shadow-overlay)" }}
        >
          <Sparkles size={16} />
          Ask AI Strategist
          <ChevronRight size={14} />
        </button>
      )}

      {/* Drawer — glassmorphism over surface */}
      {open && (
        <aside
          className="flex flex-col shrink-0 animate-fade-up"
          style={{
            width: "360px",
            background: "color-mix(in srgb, var(--surface-lowest) 85%, transparent)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderLeft: "1px solid color-mix(in srgb, var(--outline-variant) 15%, transparent)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid color-mix(in srgb, var(--outline-variant) 15%, transparent)" }}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center size-8 rounded-xl bg-secondary/10">
                <Sparkles size={16} className="text-secondary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface" style={{ fontFamily: "var(--font-display)" }}>AI Strategist</p>
                <p className="text-xs text-on-surface-variant">Powered by Claude</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="size-8 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((msg) => (
              <Message key={msg.id} msg={msg} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Starter prompts */}
          {messages.length <= 1 && !loading && (
            <div className="px-4 pb-3 space-y-1.5">
              <p className="text-xs font-medium text-on-surface-variant mb-2">Try asking:</p>
              {STARTER_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="w-full text-left text-xs px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div
            className="px-4 py-4"
            style={{ borderTop: "1px solid color-mix(in srgb, var(--outline-variant) 15%, transparent)" }}
          >
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your results…"
                rows={1}
                className="flex-1 resize-none text-sm px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface placeholder:text-on-surface-variant transition-colors focus:bg-surface-lowest focus-ring"
                style={{
                  minHeight: "40px",
                  maxHeight: "120px",
                  border: "1px solid color-mix(in srgb, var(--outline-variant) 20%, transparent)",
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="flex items-center justify-center size-10 rounded-xl bg-primary-gradient text-white disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
