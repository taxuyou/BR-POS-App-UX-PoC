"use client";

/**
 * AnalyticsSections — Analytics 탭 4개 서브섹션
 * 카테고리 기여 / 수익성 분석 / 피크 타임 / 벤치마킹
 */

import { useState } from "react";
import {
  mockCategoryContribution,
  mockCategoryProfitability,
  mockHourlySales,
  mockBenchmarkData,
} from "@/entities/mock/insight-data";
import type {
  CategoryContribution,
  CategoryProfitability,
  HourlySalesPoint,
  BenchmarkData,
} from "@/shared/types/insight";

// ============================================================
// 카테고리 기여
// ============================================================

type ContributionMetric = "revenueShare" | "quantity" | "margin" | "deliveryShare" | "storeShare";
interface MetricConfig { key: ContributionMetric; label: string; unit: string; max: number; }

const CONTRIBUTION_METRICS: MetricConfig[] = [
  { key: "revenueShare",  label: "매출 기여",  unit: "%", max: 100 },
  { key: "quantity",      label: "수량",       unit: "개", max: 400 },
  { key: "margin",        label: "마진",       unit: "%", max: 100 },
  { key: "deliveryShare", label: "배달 비중",  unit: "%", max: 100 },
  { key: "storeShare",    label: "매장 비중",  unit: "%", max: 100 },
];

export function CategoryContributionSection() {
  const [metric, setMetric] = useState<ContributionMetric>("revenueShare");
  const config = CONTRIBUTION_METRICS.find((m) => m.key === metric)!;
  const toWidth = (val: number) => `${Math.round((val / config.max) * 100)}%`;

  return (
    <div className="flex flex-col gap-4">
      {/* 지표 선택 내부 탭 */}
      <div className="flex gap-1 flex-wrap">
        {CONTRIBUTION_METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => setMetric(m.key)}
            className={`
              px-3 py-1 rounded-full text-xs font-medium transition-colors
              focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#FF671F]
              ${metric === m.key
                ? "bg-[#FF671F] text-white"
                : "bg-surface text-secondary hover:bg-[#ffe6d8] hover:text-[#FF671F] active:bg-[#ffd4b8]"
              }
            `}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* 수평 바 목록 */}
      <div className="flex flex-col gap-2">
        {(mockCategoryContribution as CategoryContribution[]).map((cat) => {
          const val = cat[metric];
          return (
            <div key={cat.category} className="flex items-center gap-3">
              <span className="w-14 text-xs font-semibold text-primary shrink-0">{cat.category}</span>
              <div className="flex-1 h-6 bg-surface rounded-md overflow-hidden">
                <div
                  className="h-full bg-[#FF671F] rounded-md transition-all duration-500"
                  style={{ width: toWidth(val) }}
                />
              </div>
              <span className="w-16 text-right text-xs font-bold text-[#FF671F] shrink-0">
                {val.toLocaleString()}{config.unit}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// 수익성 분석
// ============================================================

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-tertiary">{label}</span>
      <span className="text-xs font-semibold text-primary">{value}</span>
    </div>
  );
}

export function ProfitabilitySection() {
  const sorted = [...(mockCategoryProfitability as CategoryProfitability[])].sort(
    (a, b) => b.margin - a.margin
  );
  const maxMargin = sorted[0]?.margin ?? 0;
  const minMargin = sorted[sorted.length - 1]?.margin ?? 0;

  return (
    <div className="flex flex-col gap-2">
      {/* 범례 */}
      <div className="flex gap-3 mb-1">
        <span className="flex items-center gap-1.5 text-xs text-secondary">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />최고 마진
        </span>
        <span className="flex items-center gap-1.5 text-xs text-secondary">
          <span className="w-2 h-2 rounded-full bg-[#FF671F] inline-block" />최저 마진
        </span>
      </div>

      {sorted.map((cat) => {
        const isHighest = cat.margin === maxMargin;
        const isLowest  = cat.margin === minMargin;
        const marginColor = isHighest
          ? "text-emerald-600 bg-emerald-50 border-emerald-200"
          : isLowest
            ? "text-[#FF671F] bg-[#FFF0E8] border-[#FF671F]/20"
            : "text-secondary bg-surface border-border";

        return (
          <div key={cat.category} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-primary">{cat.category}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${marginColor}`}>
                마진 {cat.margin}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <MetricRow label="매출액"   value={`₩${cat.revenue.toLocaleString()}`} />
              <MetricRow label="원가"     value={`₩${cat.cost.toLocaleString()}`} />
              <MetricRow label="개당 마진" value={`₩${cat.unitMargin.toLocaleString()}`} />
              <MetricRow label="대표 품목" value={cat.topItem} />
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-tertiary mb-1">
                <span>{cat.topItem} 마진</span>
                <span>{cat.topItemMargin}%</span>
              </div>
              <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${cat.topItemMargin}%` }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// 피크 타임
// ============================================================
export function PeakTimeSection() {
  const data = mockHourlySales as HourlySalesPoint[];
  const maxSales  = Math.max(...data.map((d) => d.sales));
  const peakHours = data.filter((d) => d.isPeak).map((d) => d.hour);

  return (
    <div className="flex flex-col gap-4">
      {/* 바 차트 카드 */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-xs font-semibold text-secondary mb-3">시간대별 매출 (원)</p>
        <div className="flex items-end gap-1 h-36">
          {data.map((point) => {
            const heightPct = Math.round((point.sales / maxSales) * 100);
            return (
              <div
                key={point.hour}
                className="flex-1 flex flex-col items-center gap-1"
                title={`${point.hour}시: ₩${point.sales.toLocaleString()}`}
              >
                <div className="w-full flex items-end" style={{ height: "120px" }}>
                  <div
                    className={`w-full rounded-t transition-all duration-500 ${
                      point.isPeak ? "bg-[#FF671F]" : "bg-[#e8e8e8]"
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className={`text-[9px] font-medium ${point.isPeak ? "text-[#FF671F]" : "text-tertiary"}`}>
                  {point.hour}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 유동 인구 변화 뱃지 */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-xs font-semibold text-secondary mb-3">시간대별 유동 인구 변화율</p>
        <div className="flex flex-wrap gap-1.5">
          {data.map((point) => {
            const positive = point.footfallChange >= 0;
            return (
              <span
                key={point.hour}
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold ${
                  positive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}
              >
                {point.hour}시 {positive ? "+" : ""}{point.footfallChange}%
              </span>
            );
          })}
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="bg-[#FFF8F5] border border-[#FF671F]/20 rounded-xl p-4 flex flex-col gap-2">
        <p className="text-xs font-bold text-[#FF671F]">피크 시간: {peakHours.join(", ")}시</p>
        <p className="text-xs text-secondary leading-relaxed">
          비피크 시간대({data.filter((d) => !d.isPeak).map((d) => `${d.hour}시`).join(" · ")})에
          집중 프로모션으로 매출 평탄화 전략을 권장합니다.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// 벤치마킹
// ============================================================
function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-secondary">
      <span className={`w-2 h-2 rounded-full inline-block ${color}`} />
      {label}
    </span>
  );
}

function BenchmarkBar({
  label, value, unit, widthPct, color,
}: {
  label: string; value: number; unit: string; widthPct: number; color: string;
}) {
  const display = unit === "원" ? `₩${value.toLocaleString()}` : `${value}${unit}`;
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 text-[10px] text-tertiary shrink-0">{label}</span>
      <div className="flex-1 h-4 bg-surface rounded overflow-hidden">
        <div className={`h-full rounded transition-all duration-500 ${color}`} style={{ width: `${widthPct}%` }} />
      </div>
      <span className="w-20 text-right text-[10px] font-semibold text-primary shrink-0">{display}</span>
    </div>
  );
}

export function BenchmarkSection() {
  const data = mockBenchmarkData as BenchmarkData[];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3 flex-wrap">
        <LegendDot color="bg-[#0a0a0a]" label="내 매장" />
        <LegendDot color="bg-[#FF671F]" label="상위 10% 평균" />
        <LegendDot color="bg-[#d1d1d1]" label="상권 평균" />
      </div>

      {data.map((item) => {
        const maxVal    = Math.max(item.myValue, item.topTenAvg, item.regionAvg);
        const myPct     = Math.round((item.myValue   / maxVal) * 100);
        const topPct    = Math.round((item.topTenAvg / maxVal) * 100);
        const regionPct = Math.round((item.regionAvg / maxVal) * 100);
        const gap       = item.topTenAvg - item.myValue;
        const gapLabel  = gap > 0
          ? `상위 10% 대비 -${((gap / item.topTenAvg) * 100).toFixed(1)}%`
          : "상위 10% 초과 달성";
        const gapColor  = gap > 0 ? "text-[#FF671F]" : "text-emerald-600";

        return (
          <div key={item.metric} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-primary">{item.metric}</span>
              <span className={`text-[10px] font-semibold ${gapColor}`}>{gapLabel}</span>
            </div>
            <div className="flex flex-col gap-2">
              <BenchmarkBar label="내 매장"  value={item.myValue}   unit={item.unit} widthPct={myPct}     color="bg-[#0a0a0a]" />
              <BenchmarkBar label="상위 10%" value={item.topTenAvg} unit={item.unit} widthPct={topPct}    color="bg-[#FF671F]" />
              <BenchmarkBar label="상권 평균" value={item.regionAvg} unit={item.unit} widthPct={regionPct} color="bg-[#d1d1d1]" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
