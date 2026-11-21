import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bot,
  X,
  Send,
  Sparkles,
  ChevronDown,
  Gift,
  ArrowRight,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { api } from "../../lib/api";

interface Message {
  role: "assistant" | "user";
  content: string;
  time?: string;
}

const QUICK_PROMPTS = [
  "🐉 Which dragon should I get?",
  "⚡ Best fidget for ADHD desk focus?",
  "🚚 How does shipping work?",
  "🎟️ How do I win a free print?",
  "📐 Do you have brutalist phone stands?",
];

export function ToyzAIWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Yo! I'm **TOYZ-AI**, your official desk concierge. Looking for an articulated dragon, a brutalist pen dock, or want to know how to win a free drop in our monthly giveaway? Ask away!",
      time: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Don't show AI widget on admin portal
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      role: "user",
      content: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await api.sendAiChat(history, {
        currentPath: location.pathname,
      });

      const assistantMsg: Message = {
        role: "assistant",
        content: res.reply || "Looks like my microwave frequency dropped! What can I help you find?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Telemetry glitch! Check your internet or ask me again.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Floating Launcher Pill (Bottom-Left to perfectly complement WhatsApp on Bottom-Right) ── */}
      <div className="fixed bottom-6 left-6 z-40">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-2.5 bg-lime text-ink font-mono font-black text-xs uppercase tracking-wider border-2 border-ink shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer group"
            aria-label="Open TOYZ-AI Concierge"
          >
            <div className="w-5 h-5 bg-ink text-lime flex items-center justify-center border border-ink shadow-brutal-xs group-hover:rotate-12 transition-transform">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <span>ASK TOYZ-AI</span>
            <span className="w-2 h-2 rounded-full bg-coral animate-ping" />
          </button>
        )}
      </div>

      {/* ── Brutalist AI Chat Window ─────────────────────────────────── */}
      {isOpen && (
        <div className="fixed bottom-4 left-4 sm:left-6 z-50 w-[calc(100vw-32px)] sm:w-[380px] h-[520px] max-h-[85vh] card-brutal bg-cream border-3 border-ink shadow-brutal-xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-ink text-cream p-3.5 border-b-2 border-ink flex items-center justify-between select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-lime text-ink flex items-center justify-center border border-cream shadow-brutal-xs font-black">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-sm uppercase tracking-wider text-cream">
                    TOYZ-AI
                  </span>
                  <span className="badge-lime text-[9px] py-0 px-1 font-mono font-bold">
                    GPT-4O-MINI
                  </span>
                </div>
                <p className="font-mono text-[9px] text-cream/60 uppercase">
                  Tactile Desk Concierge // Online
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-cream/20 text-cream border border-cream/30 transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Context Bar */}
          <div className="bg-lime/20 border-b border-ink/20 px-3 py-1.5 flex items-center justify-between font-mono text-[10px]">
            <span className="text-ink font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-coral" />
              <span>Ask about drops, joints, or materials</span>
            </span>
            <Link
              to="/survey"
              onClick={() => setIsOpen(false)}
              className="text-coral underline font-black hover:text-ink"
            >
              Win Free Drop 🎁
            </Link>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 font-mono text-xs bg-cream-light">
            {messages.map((m, idx) => {
              const isBot = m.role === "assistant";
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isBot ? "items-start" : "items-end"} space-y-1`}
                >
                  <div
                    className={`p-3 max-w-[85%] border-2 border-ink ${
                      isBot
                        ? "bg-cream text-ink shadow-brutal-xs"
                        : "bg-ink text-cream font-bold"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {m.content}
                    </p>
                  </div>
                  {m.time && (
                    <span className="text-[9px] text-ink-muted uppercase px-1">
                      {m.time}
                    </span>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 p-3 bg-cream border-2 border-ink max-w-[70%] shadow-brutal-xs">
                <RefreshCw className="w-3.5 h-3.5 text-lime-dark animate-spin" />
                <span className="font-mono text-xs text-ink-muted uppercase font-bold">
                  Compiling thought...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Prompt Chips */}
          <div className="p-2 border-t border-ink/15 bg-cream overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
            {QUICK_PROMPTS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(p)}
                className="px-2 py-1 bg-cream-light border border-ink/40 hover:border-ink hover:bg-lime text-[10px] font-mono font-bold text-ink transition-colors flex-shrink-0 cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-cream border-t-2 border-ink flex gap-1.5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about dragons, prints, free gifts..."
              className="flex-1 bg-cream-light border-2 border-ink px-3 py-2 text-xs font-mono text-ink focus:outline-none focus:ring-1 focus:ring-lime"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary px-3 py-2 text-xs font-mono font-black uppercase flex items-center justify-center disabled:opacity-40 cursor-pointer shadow-brutal-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
