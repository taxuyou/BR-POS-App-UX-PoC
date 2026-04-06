"use client";

import { useState, useEffect } from "react";
import {
  Home, Package, Shield, BarChart2, Bell,
  RefreshCw, X, ChevronRight,
} from "lucide-react";
import type { PosTab } from "@/shared/types/pos";

// ============================================================
// 사이드바 탭 정의
// ============================================================

const TABS: {
  id: PosTab;
  label: string;
  Icon: React.FC<{ size?: number; strokeWidth?: number; className?: string }>;
}[] = [
  { id: "home",      label: "홈",   Icon: Home     },
  { id: "inventory", label: "생산", Icon: Package  },
  { id: "order",     label: "발주", Icon: Shield   },
  { id: "sales",     label: "매출", Icon: BarChart2 },
  { id: "notice",    label: "공지", Icon: Bell     },
];

// ============================================================
// BR 로고 SVG
// ============================================================

function BRLogo() {
  return (
    <svg width="36" height="28" viewBox="0 0 36 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 왼쪽 파란 세로 바 */}
      <rect x="0" y="0" width="5" height="28" rx="2" fill="#1E5FA8" />
      {/* B — 핑크 */}
      <path d="M7 2h7.5c3.5 0 5.5 1.8 5.5 4.5 0 1.5-.7 2.7-1.8 3.4 1.6.7 2.6 2.1 2.6 3.9 0 3-2.2 4.8-5.8 4.8H7V2zm3 5.5h4c1.3 0 2-.6 2-1.8s-.7-1.7-2-1.7H10V7.5zm0 7.5h4.5c1.4 0 2.2-.7 2.2-2s-.8-2-2.2-2H10V15z" fill="#E91E8C" />
      {/* R — 파란 */}
      <path d="M22 2h7c3.8 0 6 1.9 6 5.2 0 2.3-1.2 4-3.2 4.8l3.5 6.6h-3.4l-3.1-6H25.2V18.6H22V2zm3.2 7.8h3.5c1.8 0 2.8-.9 2.8-2.4s-1-2.4-2.8-2.4h-3.5v4.8z" fill="#1E5FA8" />
    </svg>
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
      {/* 브랜드 로고 */}
      <div className="flex items-center justify-center pt-4 pb-3.5 border-b border-white/8">
        <BRLogo />
      </div>

      {/* 탭 목록 */}
      <nav className="flex-1 flex flex-col items-center pt-2 pb-2 gap-0.5">
        {TABS.map(({ id, label, Icon }) => {
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
              <Icon
                size={17}
                strokeWidth={isActive ? 2.2 : 1.6}
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

function PosHeader({ onReturn }: { onReturn: () => void }) {
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
        <ChevronRight size={13} className="text-border shrink-0" />
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
          <RefreshCw size={11} />
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
        <X size={11} />
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
  const handleReturn = () => {
    window.alert("기존 POS 화면으로 복귀합니다.\n(POC 데모: 실제 비알코리아 POS URL로 리다이렉트)");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f1f3]">
      <PosSidebar activeTab={activeTab} onTabChange={onTabChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PosHeader onReturn={handleReturn} />
        <PosInfoBanner />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
