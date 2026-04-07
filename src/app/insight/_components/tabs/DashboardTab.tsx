"use client";

/**
 * DashboardTab — Insight Console 대시보드 탭 (v2)
 *
 * 레이아웃: 2컬럼 그리드 (참고: Won-github/Imagerecallconfirmation)
 *   - 메인 컬럼: KPI 히어로 → 즉시 조치 → 이슈 → 생산 현황 → 카테고리 기여도 → 체크리스트
 *   - 우측 sticky 패널 (320px): AI 신뢰도 + 즉시 추천 액션
 *
 * UX 원칙:
 *   - 정보 우선순위: urgent → warning → info
 *   - Explainable AI: 판단 근거 항상 노출 (점주 신뢰도)
 *   - 원클릭 이동: 이슈/조치 카드 → 해당 탭 직접 이동
 */

import { useState } from "react";
import { Warning, ArrowRight, CheckSquare } from "@phosphor-icons/react";
import type { InsightTab, TodayChecklistItem, CategoryContribution } from "@/shared/types/insight";
import {
  mockUrgentActions,
  mockCurrentIssues,
  mockTodayChecklist,
  mockTrendingItems,
  mockCategoryContribution,
} from "@/entities/mock/insight-data";
import { KpiSection, ProductionSection } from "./DashboardSections";
import { AiTrustPanel } from "./DashboardRightPanel";

// ============================================================
// 카테고리 기여도 — 탭 내장 (대시보드 메인 컬럼용)
// ============================================================

type ContribMetric = "revenueShare" | "quantity" | "margin" | "deliveryShare" | "storeShare";

interface MetricTab {
  key: ContribMetric;
  label: string;
  unit: string;
  max: number;
}

const CONTRIB_TABS: MetricTab[] = [
  { key: "revenueShare",  label: "매출 기여", unit: "%",  max: 100 },
  { key: "quantity",      label: "판매 수량", unit: "개", max: 400 },
  { key: "margin",        label: "마진율",    unit: "%",  max: 100 },
  { key: "deliveryShare", label: "배달 비중", unit: "%",  max: 100 },
  { key: "storeShare",    label: "매장 비중", unit: "%",  max: 100 },
];

function CategoryContributionSection() {
  const [metric, setMetric] = useState<ContribMetric>("revenueShare");
  const cfg = CONTRIB_TABS.find((t) => t.key === metric)!;

  return (
    <section className="bg-white border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card-sm)]">
      {/* 헤더 + 탭 */}
      <div className="px-4 pt-3 pb-0 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#FF671F] text-white text-[10px] font-bold">
            루나
          </span>
          <span className="text-sm font-bold text-primary">카테고리 기여도</span>
        </div>
        {/* 탭 버튼 — 밑줄 스타일 */}
        <div className="flex overflow-x-auto scrollbar-hide -mb-px">
          {CONTRIB_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMetric(tab.key)}
              className={`
                px-3 py-2 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors shrink-0
                focus-visible:outline-none
                ${metric === tab.key
                  ? "border-[#FF671F] text-[#FF671F]"
                  : "border-transparent text-secondary hover:text-primary hover:border-border"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 수평 바 차트 */}
      <div className="px-4 py-4 flex flex-col gap-2.5">
        {(mockCategoryContribution as CategoryContribution[]).map((cat) => {
          const val = cat[metric];
          const pct = Math.round((Number(val) / cfg.max) * 100);
          return (
            <div key={cat.category} className="flex items-center gap-3">
              <span className="w-14 text-xs font-semibold text-primary shrink-0 text-right">
                {cat.category}
              </span>
              <div className="flex-1 h-5 bg-surface rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background: "linear-gradient(90deg, #FF671F, #E91E8C)",
                  }}
                />
              </div>
              <span className="w-14 text-right text-xs font-bold text-[#FF671F] tabular-nums shrink-0">
                {Number(val).toLocaleString()}{cfg.unit}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ============================================================
// 즉시 조치 필요 섹션
// ============================================================

function UrgentActionsSection({ onNavigate }: { onNavigate: (tab: InsightTab) => void }) {
  if (mockUrgentActions.length === 0) return null;

  return (
    <section className="bg-white border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card-sm)]">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border bg-[#fff8f5]">
        <Warning size={16} weight="fill" className="text-[#FF671F] shrink-0" />
        <span className="text-sm font-bold text-primary">즉시 조치 필요</span>
        <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#FF671F] text-white text-[10px] font-bold">
          {mockUrgentActions.length}
        </span>
      </div>

      <ul className="divide-y divide-border">
        {mockUrgentActions.map((action) => (
          <li key={action.id} className="flex items-start gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-primary leading-snug">{action.title}</p>
              <p className="text-xs text-secondary mt-0.5 leading-relaxed">{action.reason}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-[#0a0a0a] text-white text-[10px] font-bold">
                  {action.agentName}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-[#FFF0E8] text-[#FF671F] text-[10px] font-semibold border border-[#FF671F]/20">
                  {action.dueMinutes}분 내
                </span>
              </div>
            </div>
            <button
              onClick={() => onNavigate(action.tab)}
              className="
                shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg
                bg-primary text-white text-xs font-semibold
                hover:bg-[#1a1a1a] active:bg-[#2a2a2a]
                focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1
                transition-colors
              "
              aria-label={`${action.title} 탭으로 이동`}
            >
              조치
              <ArrowRight size={11} weight="bold" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ============================================================
// 지금 봐야 할 이슈 섹션
// ============================================================

const SEVERITY_STYLE = {
  urgent:  { dot: "bg-[#0a0a0a]", border: "border-l-[#0a0a0a]" },
  warning: { dot: "bg-[#FF671F]", border: "border-l-[#FF671F]" },
  info:    { dot: "bg-[#d1d1d1]", border: "border-l-[#e8e8e8]" },
} as const;

function CurrentIssuesSection() {
  return (
    <section className="bg-white border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card-sm)]">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border">
        <span className="text-sm font-bold text-primary">지금 봐야 할 이슈</span>
        <span className="text-xs text-tertiary ml-auto">{mockCurrentIssues.length}건</span>
      </div>
      <ul className="divide-y divide-border">
        {mockCurrentIssues.map((issue) => {
          const style = SEVERITY_STYLE[issue.severity];
          return (
            <li
              key={issue.id}
              className={`flex items-start gap-3 px-4 py-3 border-l-[3px] ${style.border}`}
            >
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-primary leading-snug">{issue.title}</p>
                <p className="text-xs text-secondary mt-0.5 leading-relaxed">{issue.detail}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-surface border border-border text-[10px] font-semibold text-secondary">
                    {issue.agentName}
                  </span>
                  <span className="text-[10px] text-tertiary">{issue.detectedAt} 감지</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ============================================================
// 오늘의 핵심 체크리스트
// ============================================================

const CATEGORY_COLOR: Record<TodayChecklistItem["category"], string> = {
  production: "bg-[#FF671F]/10 text-[#FF671F]",
  order:      "bg-blue-50 text-blue-600",
  sales:      "bg-green-50 text-green-600",
  operation:  "bg-purple-50 text-purple-600",
};

const CATEGORY_LABEL: Record<TodayChecklistItem["category"], string> = {
  production: "생산",
  order:      "발주",
  sales:      "매출",
  operation:  "운영",
};

function TodayChecklistSection() {
  const trendingNames = mockTrendingItems.map((t) => t.itemName).join(", ");

  return (
    <section className="bg-white border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card-sm)]">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border bg-[#f8faf9]">
        <CheckSquare size={16} weight="fill" className="text-[#16a34a] shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-bold text-primary">오늘의 핵심</span>
          <span className="ml-2 text-xs text-secondary">루나 · {trendingNames} 급등 감지 기반</span>
        </div>
        <span className="text-[10px] font-semibold text-secondary bg-surface border border-border px-2 py-0.5 rounded-full">
          {mockTodayChecklist.length}개
        </span>
      </div>
      <ul className="divide-y divide-border">
        {mockTodayChecklist.map((item) => (
          <li key={item.id} className="flex items-start gap-3 px-4 py-3">
            <div className="mt-0.5 w-4 h-4 rounded-full border-2 border-border shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-primary leading-snug">{item.task}</p>
              <p className="text-xs text-secondary mt-0.5">{item.reason}</p>
            </div>
            <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${CATEGORY_COLOR[item.category]}`}>
              {CATEGORY_LABEL[item.category]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ============================================================
// DashboardTab — 2컬럼 그리드 (메인 + 우측 sticky)
// ============================================================

interface DashboardTabProps {
  onNavigate: (tab: InsightTab) => void;
}

export function DashboardTab({ onNavigate }: DashboardTabProps) {
  return (
    <div className="p-4 w-full">
      <div
        className="grid gap-4 items-start"
        style={{ gridTemplateColumns: "minmax(0, 1fr) 300px" }}
      >
        {/* ── 메인 컬럼 ── */}
        <div className="flex flex-col gap-4">
          {/* ① KPI 히어로 */}
          <KpiSection />

          {/* ② 즉시 조치 필요 */}
          <UrgentActionsSection onNavigate={onNavigate} />

          {/* ③ 지금 봐야 할 이슈 */}
          <CurrentIssuesSection />

          {/* ④ 생산 현황 (Agent 제이) */}
          <ProductionSection />

          {/* ⑤ 카테고리 기여도 — 탭 포함 */}
          <CategoryContributionSection />

          {/* ⑥ 오늘의 핵심 체크리스트 */}
          <TodayChecklistSection />
        </div>

        {/* ── 우측 sticky 패널 ── */}
        <div className="sticky top-4">
          <AiTrustPanel onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}
