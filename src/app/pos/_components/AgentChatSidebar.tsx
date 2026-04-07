"use client";

import { useState, useRef, useEffect } from "react";
import { PaperPlaneTilt, X, Robot, User, Sparkle } from "@phosphor-icons/react";
import { mockChatMessages } from "@/entities/mock/data";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export function AgentChatSidebar({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>(
    mockChatMessages.map(m => ({
      id: m.id,
      role: m.role as "user" | "assistant",
      content: m.content,
      timestamp: m.timestamp
    }))
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Mock AI response
    setTimeout(() => {
      setIsLoading(false);
      const aiMsg: Message = {
        id: Math.random().toString(36).substr(2, 9),
        role: "assistant",
        content: `요청하신 내용을 확인했습니다. 모든 에이전트(생산, 발주, 매출)의 데이터를 통합하여 분석 중입니다.`,
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <div className="w-[380px] bg-white flex flex-col h-full">
      {/* Header */}
      <div className="h-13 px-4 flex items-center justify-between border-b border-border bg-surface">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkle size={18} weight="fill" className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-primary leading-none">통합 AI 에이전트</h2>
            <p className="text-[10px] text-secondary mt-1">생산 · 발주 · 매출 통합형</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-border transition-colors text-secondary"
        >
          <X size={18} weight="bold" />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fa]"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] ${msg.role === "user" ? "flex flex-col items-end" : "flex gap-2"}`}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-white border border-border flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Robot size={14} weight="bold" className="text-primary" />
                </div>
              )}
              <div>
                <div className={`
                  px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
                  ${msg.role === "user" 
                    ? "bg-primary text-white rounded-tr-sm shadow-md" 
                    : "bg-white text-primary border border-border rounded-tl-sm shadow-sm"
                  }
                `}>
                  {msg.content}
                </div>
                <span className="text-[10px] text-tertiary mt-1 block">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start gap-2">
            <div className="w-7 h-7 rounded-full bg-white border border-border flex items-center justify-center shrink-0 mt-1 shadow-sm animate-pulse">
              <Robot size={14} weight="bold" className="text-primary" />
            </div>
            <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
              <span className="w-1 h-1 bg-secondary rounded-full animate-bounce" />
              <span className="w-1 h-1 bg-secondary rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1 h-1 bg-secondary rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-white">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="에이전트에게 질문하세요..."
            className="w-full bg-surface border border-border rounded-xl pl-4 pr-12 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none min-h-[80px]"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 bottom-3 w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white hover:bg-black active:scale-95 disabled:bg-border disabled:text-tertiary transition-all"
          >
            <PaperPlaneTilt size={16} weight="bold" />
          </button>
        </div>
        <p className="text-[10px] text-tertiary mt-2 text-center">
          모든 상담 내역은 보안 처리되어 보호받습니다.
        </p>
      </div>
    </div>
  );
}
