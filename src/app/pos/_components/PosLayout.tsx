"use client";

import { useState, useEffect } from "react";
import {
  House, Package, Shield, ChartBar, Bell,
  ArrowClockwise, X, CaretRight, Sparkle, ChatCircleDots
} from "@phosphor-icons/react";
import { AgentChatSidebar } from "./AgentChatSidebar";
import type { Icon } from "@phosphor-icons/react";
import type { PosTab } from "@/shared/types/pos";

// ============================================================
// 사이드바 탭 정의
// ============================================================

const TABS: {
  id: PosTab;
  label: string;
  Icon: Icon;
}[] = [
  { id: "home",      label: "홈",   Icon: House    },
  { id: "inventory", label: "생산", Icon: Package  },
  { id: "order",     label: "발주", Icon: Shield   },
  { id: "sales",     label: "매출", Icon: ChartBar },
  { id: "notice",    label: "공지", Icon: Bell     },
];

// ============================================================
// BR 로고 SVG
// ============================================================

/** 배스킨라빈스 공식 로고 — 핑크 외곽 링 + 흰 내부 + BR 컬러 */
function BRLogo() {
  return (
    <img
      src="/br-logo.png"
      alt="Baskin Robbins"
      width={40}
      height={40}
      style={{ objectFit: "contain" }}
    />
  );
}

// ============================================================
// 사이드바
// ============================================================

function PosSidebar({
  activeTab,
  onTabChange,
}: {
  activeTab: PosTab;
  onTabChange: (tab: PosTab) => void;
}) {
  return (
    <aside className="w-[68px] flex flex-col bg-[#0d0d0d] shrink-0 h-full">
      {/* 흰 배경 위에 로고 — 다크 사이드바에서 선명하게 */}
      {/* 다크 사이드바 위 원형 로고 — 흰 배경 불필요 (원 자체가 흰 배경 포함) */}
      <div className="flex items-center justify-center pt-3 pb-3 border-b border-white/8">
        <BRLogo />
      </div>

      <nav className="flex-1 flex flex-col items-center pt-2 pb-2 gap-0.5">
        {TABS.map(({ id, label, Icon: TabIcon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`
                w-13 py-2.5 flex flex-col items-center gap-1.5 rounded-xl
                transition-all duration-150
                focus-visible:outline-2 focus-visible:outline-white/40 focus-visible:outline-offset-1
                ${isActive
                  ? "bg-white text-[#0d0d0d]"
                  : "text-white/35 hover:text-white/65 hover:bg-white/8 active:bg-white/12"
                }
              `}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              <TabIcon
                size={18}
                weight={isActive ? "bold" : "regular"}
              />
              <span className={`text-[9px] font-bold leading-none tracking-wide ${isActive ? "text-[#0d0d0d]" : "text-white/35"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

// ============================================================
// 상단 헤더
// ============================================================

function PosHeader({ 
  onReturn, 
  onToggleChat,
  isChatOpen
}: { 
  onReturn: () => void; 
  onToggleChat: () => void;
  isChatOpen: boolean;
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const day = weekdays[now.getDay()];
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");

  return (
    <header className="h-13 bg-white border-b border-border flex items-center px-5 gap-4 shrink-0">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-sm text-tertiary">기존 웹 POS</span>
        <CaretRight size={13} className="text-border shrink-0" weight="regular" />
        <span className="text-sm font-bold text-primary">점주 관리</span>
        <span className="ml-1.5 text-xs font-semibold text-secondary bg-surface border border-border px-2 py-0.5 rounded-md">
          강남역점
        </span>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shrink-0" />
          <span className="text-xs text-secondary tabular-nums">
            {day} <span className="font-semibold text-primary">{hh}:{mm}</span>
          </span>
        </div>

        <button className="
          h-8 px-3 flex items-center gap-1.5 rounded-lg
          bg-surface border border-border text-xs text-secondary
          hover:bg-[#E8E8E8] active:bg-[#DEDEDE]
          focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1
          transition-colors
        ">
          <ArrowClockwise size={12} weight="regular" />
          새로고침
        </button>

        <button
          onClick={onReturn}
          className="
            h-8 px-3.5 flex items-center gap-1.5 rounded-lg
            bg-primary text-white text-xs font-semibold
            hover:bg-[#1a1a1a] active:bg-[#2a2a2a]
            focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1
            transition-colors
          "
        >
          ← 기존 POS
        </button>

        <div className="w-px h-4 bg-border mx-1" />

        <button
          onClick={onToggleChat}
          className={`
            h-8 px-3 flex items-center gap-1.5 rounded-lg border transition-all
            ${isChatOpen 
              ? "bg-primary text-white border-primary shadow-sm" 
              : "bg-white text-secondary border-border hover:bg-surface active:bg-border"
            }
            text-xs font-bold
          `}
        >
          <ChatCircleDots size={14} weight={isChatOpen ? "fill" : "bold"} />
          AI 챗봇
        </button>
      </div>
    </header>
  );
}

// ============================================================
// 안내 배너
// ============================================================

const BANNER_KEY = "pos-info-banner-dismissed";

function PosInfoBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!localStorage.getItem(BANNER_KEY)) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(BANNER_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="bg-[#f8f8f8] border-b border-border text-secondary px-5 py-2 flex items-center gap-3 shrink-0">
      <p className="flex-1 text-xs text-secondary leading-snug">
        점주 전용 관리 화면입니다. <span className="font-semibold text-primary">생산·발주·매출</span> 관리에 집중합니다.
      </p>
      <button
        onClick={dismiss}
        className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full hover:bg-border transition-colors"
        aria-label="닫기"
      >
        <X size={12} weight="regular" />
      </button>
    </div>
  );
}

// ============================================================
// PosLayout
// ============================================================

interface PosLayoutProps {
  activeTab: PosTab;
  onTabChange: (tab: PosTab) => void;
  children: React.ReactNode;
}

export function PosLayout({ activeTab, onTabChange, children }: PosLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleReturn = () => {
    window.alert("기존 POS 화면으로 복귀합니다.\n(POC 데모: 실제 비알코리아 POS URL로 리다이렉트)");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f1f3] select-none">
      {/* 1366x768 타겟팅 최상위 컨테이너 — 중앙 정렬 (선택 사항) */}
      <div className="flex w-full h-full mx-auto max-w-[1920px]">
        {/* 사이드바 */}
        <PosSidebar activeTab={activeTab} onTabChange={onTabChange} />
        
        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <PosHeader 
            onReturn={handleReturn} 
            onToggleChat={() => setIsChatOpen(!isChatOpen)}
            isChatOpen={isChatOpen}
          />
          <PosInfoBanner />
          <main className="flex-1 overflow-y-auto bg-[#f0f1f3]">
            <div className="w-full max-w-[1366px] mx-auto min-h-full">
              {children}
            </div>
          </main>
        </div>

        {/* AI 에이전트 챗봇 사이드바 — 블록 영역으로 구성 */}
        {isChatOpen && (
          <aside className="shrink-0 border-l border-border bg-white overflow-hidden flex flex-col h-full shadow-sm">
            <AgentChatSidebar onClose={() => setIsChatOpen(false)} />
          </aside>
        )}
      </div>
    </div>
  );
}
