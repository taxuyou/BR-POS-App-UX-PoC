"use client";

/**
 * DashboardSections — DashboardTab 보조 섹션 컴포넌트 모음
 * - KPI 카드 / 생산 현황 / AI 브리핑 섹션 포함
 * - DashboardTab.tsx 분리 (파일 300줄 제한 준수)
 */

import { TrendUp, TrendDown } from "@phosphor-icons/react";
import {
  mockProductionSummary,
  mockTodaySales,
  mockAiNetSales,
  mockOpportunityLoss,
  mockUrgentActions,
  mockCurrentIssues,
} from "@/entities/mock/insight-data";

// ============================================================
// KPI 카드 컴포넌트
// ============================================================

interface KpiCardProps {
  label: string;
  value: string;
  subLabel: string;
  trend?: "up" | "down" | "neutral";
  highlight?: boolean;
}

function KpiCard({ label, value, subLabel, trend, highlight = false }: KpiCardProps) {
  return (
    <div
      className={`
        bg-white border rounded-xl px-4 py-4
        shadow-[var(--shadow-card-sm)]
        ${highlight ? "border-[#FF671F]/30 bg-[#fff8f5]" : "border-border"}
      `}
    >
      <p className="text-xs text-secondary mb-1">{label}</p>
      <p className={`text-2xl font-bold tabular-nums ${highlight ? "text-[#FF671F]" : "text-primary"}`}>
        {value}
      </p>
      <div className="flex items-center gap-1 mt-1.5">
        {trend === "up" && <TrendUp size={12} className="text-success shrink-0" weight="bold" />}
        {trend === "down" && <TrendDown size={12} className="text-success shrink-0" weight="bold" />}
        <span className={`text-xs ${highlight ? "text-[#FF671F] font-semibold" : "text-tertiary"}`}>
          {subLabel}
        </span>
      </div>
    </div>
  );
}

// ============================================================
// 섹션 3: KPI 4개 그리드
// ============================================================

export function KpiSection() {
  /* 단위 변환 */
  const salesMan    = Math.round(mockTodaySales / 10000);
  const netSalesMan = Math.round(mockAiNetSales / 10000);
  const lossMan     = Math.round(mockOpportunityLoss / 10000);
  /* 위험 알림: 긴급 조치 + 현재 이슈 urgent 합산 */
  const alertCount  = mockUrgentActions.length + mockCurrentIssues.filter((i) => i.severity === "urgent").length;

  return (
    <section className="grid grid-cols-4 gap-3">
      <KpiCard
        label="오늘 매출"
        value={`₩${salesMan}만`}
        subLabel="+12.2% vs 전일"
        trend="up"
      />
      <KpiCard
        label="AI 실매출"
        value={`₩${netSalesMan}만`}
        subLabel="인건비·재료비·수수료 제외"
        trend="up"
      />
      <KpiCard
        label="기회손실 추정"
        value={`₩${lossMan}만`}
        subLabel="즉시 개선 필요"
        highlight
      />
      <KpiCard
        label="위험 알림"
        value={`${alertCount}건`}
        subLabel="즉각 대응 필요"
        highlight
      />
    </section>
  );
}

// ============================================================
// 섹션 4: 생산 현황 (Agent 제이)
// ============================================================

/** 소진까지 남은 시간을 프로그레스바 너비(%)로 변환 — 최대 4시간 기준 */
function minutesToBarPct(minutes: number): number {
  const MAX_MINUTES = 240; // 4시간
  return Math.min(100, Math.round((minutes / MAX_MINUTES) * 100));
}

/** status별 프로그레스바 색상 */
const STATUS_BAR_COLOR = {
  urgent:  "bg-[#0a0a0a]",
  warning: "bg-[#FF671F]",
  normal:  "bg-success",
} as const;

/** status별 배지 스타일 */
const STATUS_BADGE = {
  urgent:  "bg-[#0a0a0a] text-white",
  warning: "bg-[#FFF0E8] text-[#FF671F] border border-[#FF671F]/20",
  normal:  "bg-[#f0fdf4] text-success border border-success/20",
} as const;

const STATUS_LABEL = {
  urgent:  "즉시 생산",
  warning: "생산 권장",
  normal:  "정상",
} as const;

export function ProductionSection() {
  return (
    <section className="bg-white border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card-sm)]">
      {/* 헤더 — Agent 제이 */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#0a0a0a] text-white text-[10px] font-bold">
          제이
        </span>
        <span className="text-sm font-bold text-primary">생산 현황</span>
        {/* Agent 활성 배지 */}
        <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f0fdf4] text-success text-[10px] font-semibold border border-success/20">
          <span className="w-1 h-1 rounded-full bg-success animate-pulse" />
          활성
        </span>
      </div>

      {/* 품목 목록 */}
      <ul className="divide-y divide-border">
        {mockProductionSummary.map((item) => {
          const barPct = minutesToBarPct(item.minutesUntilRunout);
          const barColor = STATUS_BAR_COLOR[item.status];
          const badgeStyle = STATUS_BADGE[item.status];
          const badgeLabel = STATUS_LABEL[item.status];
          const h = Math.floor(item.minutesUntilRunout / 60);
          const m = item.minutesUntilRunout % 60;
          const timeLabel = h > 0 ? `${h}시간 ${m}분` : `${m}분`;

          return (
            <li key={item.itemName} className="px-4 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-primary">{item.itemName}</span>
                <div className="flex items-center gap-2">
                  {/* 기회손실 금액 — 0원이면 미표시 */}
                  {item.chanceLoss > 0 && (
                    <span className="text-xs text-[#FF671F] font-semibold">
                      손실 ₩{(item.chanceLoss / 1000).toFixed(0)}K
                    </span>
                  )}
                  {/* 상태 배지 */}
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold ${badgeStyle}`}>
                    {badgeLabel}
                  </span>
                </div>
              </div>

              {/* 소진까지 프로그레스바 */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${barPct}%` }}
                    role="progressbar"
                    aria-valuenow={barPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${item.itemName} 소진까지 ${timeLabel}`}
                  />
                </div>
                <span className="text-[10px] text-tertiary tabular-nums shrink-0 w-16 text-right">
                  {timeLabel} 후 소진
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

