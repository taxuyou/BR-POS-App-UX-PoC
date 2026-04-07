"use client";

/**
 * AnalyticsTab — 분석 탭 (서브탭 컨테이너)
 * - 서브탭 4종: 카테고리 기여 / 수익성 분석 / 피크 타임 / 벤치마킹
 * - 각 섹션 컴포넌트는 AnalyticsSections.tsx에서 관리
 */

import { useState } from "react";
import { TrendUp, ChartBar, Clock, Buildings } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import {
  CategoryContributionSection,
  ProfitabilitySection,
  PeakTimeSection,
  BenchmarkSection,
} from "./AnalyticsSections";

// ============================================================
// 서브탭 설정
// ============================================================

type AnalyticsSubTab = "contribution" | "profitability" | "peaktime" | "benchmark";

interface SubTabConfig {
  id: AnalyticsSubTab;
  label: string;
  icon: Icon;
}

const SUB_TABS: SubTabConfig[] = [
  { id: "contribution",  label: "카테고리 기여", icon: TrendUp   },
  { id: "profitability", label: "수익성 분석",   icon: ChartBar  },
  { id: "peaktime",      label: "피크 타임",     icon: Clock     },
  { id: "benchmark",     label: "벤치마킹",      icon: Buildings },
];

// ============================================================
// AnalyticsTab
// ============================================================

export function AnalyticsTab() {
  const [activeTab, setActiveTab] = useState<AnalyticsSubTab>("contribution");

  return (
    <div className="p-5 flex flex-col gap-4 max-w-5xl mx-auto w-full">
      {/* 서브탭 필 버튼 — 수평 스크롤 지원 (모바일 대응) */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
        {SUB_TABS.map(({ id, label, icon: TabIcon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`
              flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap
              transition-colors shrink-0
              focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#FF671F]
              ${activeTab === id
                ? "bg-primary text-white"
                : "bg-card border border-border text-secondary hover:bg-surface hover:text-primary active:bg-[#e8e8e8]"
              }
            `}
          >
            <TabIcon size={13} className={activeTab === id ? "text-white" : "text-tertiary"} />
            {label}
          </button>
        ))}
      </div>

      {/* 서브탭 콘텐츠 — 조건부 렌더 */}
      {activeTab === "contribution"  && <CategoryContributionSection />}
      {activeTab === "profitability" && <ProfitabilitySection />}
      {activeTab === "peaktime"      && <PeakTimeSection />}
      {activeTab === "benchmark"     && <BenchmarkSection />}
    </div>
  );
}
