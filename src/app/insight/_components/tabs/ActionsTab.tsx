"use client";

/**
 * ActionsTab — Insight Console 액션 탭
 * - 섹션 1: 트렌딩 감지 (인기상품 상승) — Agent 루나
 * - 섹션 2: 오늘의 핵심 액션 체크리스트
 * - 섹션 3: 프로모션 전략 추천 — Agent 루나
 */

import { TrendUp, CheckCircle, Tag } from "@phosphor-icons/react";
import {
  mockTrendingItems,
  mockTodayChecklist,
  mockPromotionStrategies,
} from "@/entities/mock/insight-data";
import type { TodayChecklistItem } from "@/shared/types/insight";

// ============================================================
// 카테고리 배지 스타일 맵 — production/order/sales/operation
// ============================================================

/** 카테고리별 배지 색상 — UT 신호등 체계 기반 */
const CATEGORY_BADGE: Record<TodayChecklistItem["category"], string> = {
  production: "bg-[#FFF0E8] text-[#FF671F] border border-[#FF671F]/20",
  order:      "bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/20",
  sales:      "bg-[#F0FDF4] text-[#16A34A] border border-[#16A34A]/20",
  operation:  "bg-[#F5F3FF] text-[#7C3AED] border border-[#7C3AED]/20",
};

const CATEGORY_LABEL: Record<TodayChecklistItem["category"], string> = {
  production: "생산",
  order:      "발주",
  sales:      "판매",
  operation:  "운영",
};

// ============================================================
// 섹션 1: 트렌딩 감지 — 인기상품 상승
// ============================================================

function TrendingSection() {
  return (
    <section className="bg-white border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card-sm)]">
      {/* 헤더 — Agent 루나 */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#FF671F] text-white text-[10px] font-bold">
          루나
        </span>
        <span className="text-sm font-bold text-primary">트렌딩 감지</span>
        <span className="ml-auto text-xs text-tertiary">인기상품 상승</span>
      </div>

      {/* 트렌딩 품목 목록 */}
      <ul className="divide-y divide-border">
        {mockTrendingItems.map((item) => (
          <li key={item.itemName} className="px-4 py-3 flex items-start gap-3">
            {/* 트렌드 아이콘 */}
            <TrendUp
              size={16}
              weight="bold"
              className="text-[#FF671F] shrink-0 mt-0.5"
            />

            <div className="flex-1 min-w-0">
              {/* 품목명 + 판매 급등 배지 */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-primary">
                  {item.itemName}
                </span>
                {/* 판매 급등 배지 — 던킨 오렌지 */}
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-[#FFF0E8] text-[#FF671F] text-[10px] font-bold border border-[#FF671F]/20">
                  +{item.salesGrowth}% 판매 급등
                </span>
              </div>

              {/* 재고 소진 예정 정보 */}
              <p className="text-xs text-secondary mt-0.5">
                재고 {item.minutesUntilRunout}분 소진 예정
              </p>

              {/* 루나의 제안 */}
              <p className="text-xs text-tertiary mt-1">
                전면 배치 + 세트 구성 권장
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ============================================================
// 섹션 2: 오늘의 핵심 액션 체크리스트
// ============================================================

function ChecklistSection() {
  return (
    <section className="bg-white border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card-sm)]">
      {/* 헤더 */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border">
        <span className="text-sm font-bold text-primary">오늘의 핵심 액션</span>
        <span className="text-xs text-tertiary ml-auto">
          {mockTodayChecklist.length}건
        </span>
      </div>

      {/* 체크리스트 항목 */}
      <ul className="divide-y divide-border">
        {mockTodayChecklist.map((item) => (
          <li key={item.id} className="flex items-start gap-3 px-4 py-3">
            {/* 체크박스 원형 — POC: 시각적 표시만, 실제 상태 변경 없음 */}
            <button
              className="
                shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 border-border
                flex items-center justify-center
                hover:border-[#FF671F] active:scale-95
                focus-visible:outline-2 focus-visible:outline-[#FF671F] focus-visible:outline-offset-1
                transition-all
              "
              aria-label={`${item.task} 완료 표시`}
              type="button"
            >
              {item.done && (
                <CheckCircle size={14} weight="fill" className="text-[#FF671F]" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              {/* 태스크 제목 */}
              <p className="text-sm font-semibold text-primary leading-snug">
                {item.task}
              </p>
              {/* 이유 */}
              <p className="text-xs text-secondary mt-0.5 leading-relaxed">
                {item.reason}
              </p>
              {/* 카테고리 배지 */}
              <span
                className={`
                  mt-1.5 inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold
                  ${CATEGORY_BADGE[item.category]}
                `}
              >
                {CATEGORY_LABEL[item.category]}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* 전체 완료 버튼 — POC: disabled 스타일 */}
      <div className="px-4 py-3 border-t border-border">
        <button
          disabled
          className="
            w-full py-2.5 rounded-lg text-sm font-semibold
            bg-surface text-tertiary border border-border
            cursor-not-allowed
          "
          type="button"
        >
          전체 완료
        </button>
      </div>
    </section>
  );
}

// ============================================================
// 섹션 3: 프로모션 전략 추천
// ============================================================

function PromotionSection() {
  return (
    <section className="bg-white border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card-sm)]">
      {/* 헤더 — Agent 루나 */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#FF671F] text-white text-[10px] font-bold">
          루나
        </span>
        <span className="text-sm font-bold text-primary">프로모션 전략 추천</span>
      </div>

      {/* 전략 목록 */}
      <ul className="divide-y divide-border">
        {mockPromotionStrategies.map((strategy) => (
          <li key={strategy.id} className="px-4 py-3">
            {/* 전략 제목 + 대상 품목 */}
            <div className="flex items-start gap-2 flex-wrap">
              <Tag size={14} weight="fill" className="text-[#FF671F] shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-primary leading-snug">
                  {strategy.title}
                </p>
                <p className="text-xs text-secondary mt-0.5">
                  대상: {strategy.targetItem}
                </p>
              </div>
              {/* ROI 고효율 배지 — 300% 초과 시 표시 */}
              {strategy.roi > 300 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-[#F0FDF4] text-[#16A34A] text-[10px] font-bold border border-[#16A34A]/20">
                  고효율
                </span>
              )}
            </div>

            {/* 3-지표 행 — 예상 매출 / 비용 / ROI */}
            <div className="flex items-center gap-4 mt-2.5 px-0.5">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] text-tertiary">예상 매출 증가</span>
                <span className="text-sm font-bold text-[#FF671F] tabular-nums">
                  +{strategy.expectedRevenueLift}%
                </span>
              </div>
              {/* 구분선 */}
              <div className="w-px h-8 bg-border" />
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] text-tertiary">비용</span>
                <span className="text-sm font-bold text-primary tabular-nums">
                  ₩{strategy.cost.toLocaleString()}
                </span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] text-tertiary">ROI</span>
                <span className="text-sm font-bold text-primary tabular-nums">
                  {strategy.roi}%
                </span>
              </div>
            </div>

            {/* 추천 이유 */}
            <p className="text-xs text-secondary mt-2 leading-relaxed">
              {strategy.reason}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ============================================================
// ActionsTab — 3개 섹션 조합
// ============================================================

export function ActionsTab() {
  return (
    <div className="p-5 flex flex-col gap-4 max-w-5xl mx-auto w-full">
      {/* 섹션 1: 트렌딩 감지 */}
      <TrendingSection />

      {/* 섹션 2: 오늘의 핵심 액션 체크리스트 */}
      <ChecklistSection />

      {/* 섹션 3: 프로모션 전략 추천 */}
      <PromotionSection />
    </div>
  );
}
