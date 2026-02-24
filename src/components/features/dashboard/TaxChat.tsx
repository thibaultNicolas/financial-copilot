"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import type { UserProfile } from "@/types";
import type { Recommendation } from "@/types";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Props = {
  profile: Partial<UserProfile>;
  recommendations: Recommendation[];
};

const SUGGESTED_QUESTIONS = [
  "How much would I save if I maxed my RRSP?",
  "What is my marginal tax rate?",
  "Should I incorporate my freelance business?",
  "How does my rental income affect my taxes?",
];

export function TaxChat({ profile, recommendations }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi ${profile.firstName}! I can answer questions about your tax situation and recommendations. All my answers are based on your real calculated numbers — not estimates. What would you like to know?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          profile,
          recommendations,
          history: messages.slice(-6), // Last 6 messages for context
        }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply ?? "Sorry, something went wrong.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I could not connect. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div
        className="p-6 border-b border-gray-100"
        style={{ background: "var(--ws-gray-50)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "var(--ws-green)" }}
          >
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Ask your financial AI</h3>
            <p className="text-xs text-gray-500">
              Answers grounded in your real tax numbers
            </p>
          </div>
          <div
            className="ml-auto px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
              background: "var(--ws-green-light)",
              color: "var(--ws-green-dark)",
            }}
          >
            GPT-4o
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                background:
                  msg.role === "assistant" ? "var(--ws-green)" : "#F1F3F5",
              }}
            >
              {msg.role === "assistant" ? (
                <Bot className="w-3.5 h-3.5 text-white" />
              ) : (
                <User className="w-3.5 h-3.5 text-gray-500" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-xs px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "text-white rounded-tr-sm"
                  : "text-gray-700 border border-gray-100 rounded-tl-sm"
              }`}
              style={{
                background: msg.role === "user" ? "var(--ws-green)" : "white",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--ws-green)" }}
            >
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm border border-gray-100 bg-white">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      {messages.length === 1 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask about your taxes, accounts, or recommendations..."
            className="flex-1 text-sm px-4 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:border-gray-300 bg-gray-50"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: "var(--ws-green)" }}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
