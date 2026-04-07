"use client";

/**
 * ReportTabSections — 배달 정산 + 리뷰 모니터링 섹션
 * ReportTab.tsx에서 임포트하여 사용 (300줄 초과 방지 분리)
 */

import { Storefront, Star, ThumbsUp, ThumbsDown } from "@phosphor-icons/react";
import { mockDeliverySettlements, mockReviewSummary } from "@/entities/mock/insight-data";

/** 금액 포맷 — 원 단위, 천 단위 콤마 */
function formatKRW(amount: number): string {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

// ============================================================
// 배달 플랫폼 정산 섹션
// ============================================================

export function DeliverySettlementSection() {
  return (
    <section className="bg-[#ffffff] border border-[#e8e8e8] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      {/* 헤더 */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#e8e8e8] bg-[#fafafa]">
        <Storefront size={16} weight="duotone" className="text-[#0a0a0a] shrink-0" />
        <span className="text-sm font-bold text-[#0a0a0a]">배달 플랫폼 정산 현황</span>
        <span className="ml-auto text-xs text-[#9ca3af]">오늘 기준</span>
      </div>

      {/* 테이블 헤더 */}
      <div className="grid grid-cols-4 px-4 py-2 border-b border-[#e8e8e8] bg-[#f8faf9]">
        <span className="text-[10px] font-semibold text-[#9ca3af]">플랫폼</span>
        <span className="text-[10px] font-semibold text-[#9ca3af] text-right">매출</span>
        <span className="text-[10px] font-semibold text-[#9ca3af] text-right">수수료</span>
        <span className="text-[10px] font-semibold text-[#9ca3af] text-right">순수익</span>
      </div>

      {/* 정산 행 */}
      <ul className="divide-y divide-[#e8e8e8]">
        {mockDeliverySettlements.map((s) => {
          // 수수료율 14% 초과 시 오렌지 강조
          const isHighCommission = s.commissionRate > 14;
          return (
            <li key={s.platform} className="grid grid-cols-4 items-center px-4 py-3">
              <span className="text-sm font-semibold text-[#0a0a0a]">{s.platform}</span>
              <span className="text-sm text-[#0a0a0a] text-right">{formatKRW(s.revenue)}</span>
              {/* 수수료 — 14% 초과 시 오렌지 */}
              <span className={`text-sm text-right font-semibold ${isHighCommission ? "text-[#ff671f]" : "text-[#6b7280]"}`}>
                {formatKRW(s.commission)}
                <span className={`ml-1 text-[10px] px-1 py-0.5 rounded ${isHighCommission ? "bg-[#fff3eb]" : "bg-[#f2f3f5]"}`}>
                  {s.commissionRate}%
                </span>
              </span>
              <span className="text-sm font-bold text-[#16a34a] text-right">{formatKRW(s.netRevenue)}</span>
            </li>
          );
        })}
      </ul>

      {/* 합계 행 */}
      <div className="grid grid-cols-4 px-4 py-3 border-t border-[#e8e8e8] bg-[#f8faf9]">
        <span className="text-xs font-bold text-[#0a0a0a]">합계</span>
        <span className="text-xs font-bold text-[#0a0a0a] text-right">
          {formatKRW(mockDeliverySettlements.reduce((s, d) => s + d.revenue, 0))}
        </span>
        <span className="text-xs font-bold text-[#6b7280] text-right">
          {formatKRW(mockDeliverySettlements.reduce((s, d) => s + d.commission, 0))}
        </span>
        <span className="text-xs font-bold text-[#16a34a] text-right">
          {formatKRW(mockDeliverySettlements.reduce((s, d) => s + d.netRevenue, 0))}
        </span>
      </div>
    </section>
  );
}

// ============================================================
// 리뷰 모니터링 섹션
// ============================================================

/** 별점 렌더 — 정수 부분만 채워진 별, 소수점 시각화 생략 */
function StarRating({ rating }: { rating: number }) {
  const full  = Math.floor(rating);
  const empty = 5 - full;
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`별점 ${rating}`}>
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f-${i}`} size={12} weight="fill" className="text-[#fbbf24]" />
      ))}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e-${i}`} size={12} weight="regular" className="text-[#d1d5db]" />
      ))}
      <span className="ml-1 text-xs font-bold text-[#0a0a0a]">{rating.toFixed(1)}</span>
    </span>
  );
}

export function ReviewMonitoringSection() {
  return (
    <section className="bg-[#ffffff] border border-[#e8e8e8] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      {/* 헤더 */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#e8e8e8] bg-[#fafafa]">
        <Star size={16} weight="fill" className="text-[#fbbf24] shrink-0" />
        <span className="text-sm font-bold text-[#0a0a0a]">리뷰 모니터링</span>
        <span className="ml-auto text-xs text-[#9ca3af]">최근 7일</span>
      </div>

      {/* 플랫폼 카드 목록 */}
      <ul className="divide-y divide-[#e8e8e8]">
        {mockReviewSummary.map((r) => (
          <li key={r.platform} className="px-4 py-3 flex items-center gap-4">
            {/* 플랫폼명 + 별점 */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#0a0a0a]">{r.platform}</p>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={r.avgRating} />
                <span className="text-[10px] text-[#9ca3af]">총 {r.totalCount}개</span>
              </div>
            </div>

            {/* 최근 리뷰 긍정 / 부정 */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16a34a]">
                <ThumbsUp size={12} weight="fill" />
                {r.recentPositive}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#dc2626]">
                <ThumbsDown size={12} weight="fill" />
                {r.recentNegative}
              </span>
            </div>

            {/* 인기 키워드 배지 */}
            <span className="shrink-0 text-[10px] font-bold text-[#0a0a0a] bg-[#f2f3f5] border border-[#e8e8e8] px-2 py-0.5 rounded-full">
              #{r.topKeyword}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
