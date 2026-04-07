"use client";

/**
 * InsightLayout — Insight Console 데스크탑 전용 레이아웃
 * - 좌측 68px 다크 사이드바 + 상단 헤더 + 메인 콘텐츠 구조
 * - PosLayout과 동일한 다크 사이드바 패턴 재사용
 */

import { useState, useEffect } from "react";
import {
  SquaresFour,
  Pulse,
  ChartBar,
  Lightning,
  FileText,
  Package,
  MagnifyingGlass,
  Bell,
  CaretRight,
  ArrowSquareOut,
  Sparkle,
} from "@phosphor-icons/react";

import type { Icon } from "@phosphor-icons/react";
import type { InsightTab } from "@/shared/types/insight";
import { AiBriefingModal } from "./AiBriefingModal";

// ============================================================
// 사이드바 탭 정의
// ============================================================

const TABS: {
  id: InsightTab;
  label: string;
  Icon: Icon;
}[] = [
  { id: "dashboard",  label: "대시보드", Icon: SquaresFour     },
  { id: "monitoring", label: "모니터링", Icon: Pulse           },
  { id: "analytics",  label: "분석",     Icon: ChartBar        },
  { id: "actions",    label: "액션",     Icon: Lightning       },
  { id: "report",     label: "리포트",   Icon: FileText        },
  { id: "order",      label: "발주",     Icon: Package         },
  { id: "issues",     label: "이슈",     Icon: MagnifyingGlass },
  { id: "alerts",     label: "알림",     Icon: Bell            },
];

// ============================================================
// 던킨 로고 SVG (간략형)
// ============================================================

/** 배스킨라빈스 공식 로고 PNG */
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

function InsightSidebar({
  activeTab,
  onTabChange,
}: {
  activeTab: InsightTab;
  onTabChange: (tab: InsightTab) => void;
}) {
  const [briefingOpen, setBriefingOpen] = useState(false);

  return (
    <>
      <aside className="w-[68px] flex flex-col bg-[#0d0d0d] shrink-0 h-full">
        {/* 로고 영역 */}
        <div className="flex items-center justify-center pt-3 pb-3 border-b border-white/8">
          <BRLogo />
        </div>

        {/* 탭 네비게이션 */}
        <nav className="flex-1 flex flex-col items-center pt-2 pb-2 gap-0.5 overflow-y-auto">
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
                <TabIcon size={18} weight={isActive ? "bold" : "regular"} />
                <span
                  className={`
                    text-[9px] font-bold leading-none tracking-wide
                    ${isActive ? "text-[#0d0d0d]" : "text-white/35"}
                  `}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* ── 하단: 오늘의 AI 브리핑 버튼 (행동 심리학 불빛) ── */}
        <div className="px-2.5 pb-3 pt-2 border-t border-white/8 flex flex-col items-center">
          <button
            onClick={() => setBriefingOpen(true)}
            aria-label="오늘의 AI 브리핑 열기"
            className="
              relative w-11 h-11 rounded-xl
              flex flex-col items-center justify-center gap-1
              transition-all duration-150
              focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#E91E8C]
              active:scale-95
            "
            style={{
              background: "linear-gradient(135deg, #FF671F, #E91E8C)",
              boxShadow: "0 0 12px rgba(233,30,140,0.5)",
            }}
          >
            {/* 뱃지 닷 — 새 브리핑 알림 */}
            <span
              className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
              style={{ background: "#fff", border: "1.5px solid #E91E8C" }}
            />
            <Sparkle size={16} weight="fill" className="text-white" />
            <span className="text-[8px] font-extrabold text-white leading-none">브리핑</span>
          </button>
        </div>
      </aside>

      {/* 브리핑 모달 */}
      {briefingOpen && <AiBriefingModal onClose={() => setBriefingOpen(false)} />}
    </>
  );
}

// ============================================================
// 상단 헤더
// ============================================================

function InsightHeader() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    /* 1분마다 시계 갱신 */
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const day = weekdays[now.getDay()];
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");

  const handleGoToPos = () => {
    /* POC 데모: 실제 배포 시 /pos 경로로 라우팅 */
    window.location.href = "/pos";
  };

  return (
    <header className="h-13 bg-white border-b border-border flex items-center px-5 gap-4 shrink-0">
      {/* 브레드크럼 */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-sm text-tertiary">점주 관리</span>
        <CaretRight size={13} className="text-border shrink-0" weight="regular" />
        <span className="text-sm font-bold text-primary">Insight Console</span>
        <span className="ml-1.5 text-xs font-semibold text-secondary bg-surface border border-border px-2 py-0.5 rounded-md">
          강남역점
        </span>
      </div>

      {/* 우측 컨트롤 */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* 실시간 시계 */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shrink-0" />
          <span className="text-xs text-secondary tabular-nums">
            {day} <span className="font-semibold text-primary">{hh}:{mm}</span>
          </span>
        </div>

        {/* AI 리포트 생성 버튼 — 은은한 glow */}
        <button
          className="
            h-8 px-3.5 flex items-center gap-1.5 rounded-lg
            text-white text-xs font-semibold
            focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#E91E8C]
            transition-opacity hover:opacity-90 active:opacity-75
          "
          style={{
            background: "linear-gradient(135deg, #FF671F, #E91E8C)",
            boxShadow: "0 0 14px rgba(233,30,140,0.55), 0 0 4px rgba(255,103,31,0.4)",
          }}
        >
          <Sparkle size={12} weight="fill" />
          AI 리포트 생성
        </button>

        {/* 기존 POS 이동 버튼 */}
        <button
          onClick={handleGoToPos}
          className="
            h-8 px-3.5 flex items-center gap-1.5 rounded-lg
            bg-primary text-white text-xs font-semibold
            hover:bg-[#1a1a1a] active:bg-[#2a2a2a]
            focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1
            transition-colors
          "
        >
          <ArrowSquareOut size={12} weight="bold" />
          기존 POS
        </button>
      </div>
    </header>
  );
}

// ============================================================
// InsightLayout
// ============================================================

interface InsightLayoutProps {
  activeTab: InsightTab;
  onTabChange: (tab: InsightTab) => void;
  children: React.ReactNode;
}

export function InsightLayout({ activeTab, onTabChange, children }: InsightLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f1f3]">
      <InsightSidebar activeTab={activeTab} onTabChange={onTabChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <InsightHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
