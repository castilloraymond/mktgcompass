"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, Send, X, ChevronRight, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";

const STARTER_PROMPTS = [
  "Which channel gives me the best bang for my buck?",
  "Why is Meta showing diminishing returns?",
  "What happens if I cut YouTube by 20%?",
  "Explain the confidence intervals in plain English",
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 animate-fade-up">
      <div className="flex items-center justify-center size-7 rounded-full bg-surface-container shrink-0">
        <Bot size={14} className="text-primary" />
      </div>
      <div className="flex items-center gap-1 bg-surface-lowest rounded-[12px] rounded-bl-[4px] px-4 py-3 shadow-float">
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
        {isUser ? <User size={14} /> : <Bot size={14} className="text-primary" />}
      </div>
      <div
        className={cn(
          "max-w-[85%] px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-on-primary rounded-[12px] rounded-br-[4px]"
            : "bg-surface-lowest text-on-surface rounded-[12px] rounded-bl-[4px] shadow-float"
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
        "Hi! I'm your MktgCompass AI Strategist 👋 I've analyzed your MMM results and I'm ready to help you understand what's driving your revenue — and where to invest next. What would you like to know?",
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
        "which channel": "Based on your MMM results, Email is your highest-ROAS channel at 7.3x — meaning every $1 you spend generates $7.30 in revenue. It's also the least saturated at 32%, so there's significant room to scale. I'd recommend doubling your email budget before adding spend anywhere else.",
        "meta": "Meta Ads is running at 85% saturation, which means you're getting much less return on each additional dollar than you were 6 months ago. The model estimates you could reallocate $7-10K from Meta to Google Search and increase total revenue by about $12K.",
        "youtube": "Cutting YouTube by 20% (about $3,640) would reduce revenue by approximately $5,200. That's a 1.43x return on that spend, which is below your portfolio average of 3.85x. However, YouTube has strong brand equity effects that take longer to show up — I'd trim it only if you're cash-constrained.",
        "confidence": "Think of confidence intervals like a weather forecast — the model isn't saying 'exactly $1.42M in revenue', it's saying 'we're 95% confident revenue landed between $1.31M and $1.54M.' The tighter the interval, the more data you have and the more the model trusts itself. Your high-confidence channels (Meta, Search) have very narrow intervals, which means the ROI estimates are reliable.",
      };
      const key = Object.keys(responses).find((k) => text.toLowerCase().includes(k));
      const reply =
        key
          ? responses[key]
          : "That's a great question! Based on your MMM results, I can see some interesting patterns in your data. Could you be more specific about which channel or metric you're curious about? I can walk you through the numbers in plain English.";

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
          className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-[14px] bg-primary-gradient text-white text-sm font-semibold shadow-overlay hover:opacity-90 active:scale-95 transition-all z-40"
        >
          <Sparkles size={16} />
          Ask AI Strategist
          <ChevronRight size={14} />
        </button>
      )}

      {/* Drawer */}
      {open && (
        <aside
          className="flex flex-col bg-surface-lowest border-l border-l-surface-container shrink-0 animate-fade-up"
          style={{ width: "360px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-b-surface-container">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-8 rounded-[10px] bg-primary/10">
                <Sparkles size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">AI Strategist</p>
                <p className="text-xs text-on-surface-variant">Powered by Claude</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="size-8 flex items-center justify-center rounded-[8px] text-on-surface-variant hover:bg-surface-low transition-colors"
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
                  className="w-full text-left text-xs px-3 py-2 rounded-[8px] bg-surface-low hover:bg-surface-container text-on-surface-variant transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-4 border-t border-t-surface-container">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your results…"
                rows={1}
                className="flex-1 resize-none text-sm px-4 py-2.5 rounded-[12px] bg-surface-low border-ghost outline-none focus:border-primary focus:border-2 text-on-surface placeholder:text-on-surface-variant transition-colors"
                style={{ minHeight: "40px", maxHeight: "120px" }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="flex items-center justify-center size-10 rounded-[12px] bg-primary-gradient text-white disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all"
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
