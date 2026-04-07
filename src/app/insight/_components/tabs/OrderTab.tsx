"use client";

/**
 * OrderTab — 로이 · 발주 관리 탭
 * - 상태 필터 (전체 / 검토 중 / 확정 / 발송 완료 / 대기)
 * - 발주 카드: 본사 지시 vs 로이 추천 비교 + 최종 확정 수량
 * - 로이 조정 발생 시 오렌지 하이라이트
 * - 합계 + 발주 확정 버튼 (POC: 시각 전용)
 */

import { useState } from "react";
import { Robot, Package, CheckCircle, Clock, PaperPlaneTilt, ArrowsClockwise } from "@phosphor-icons/react";
import type { OrderItem } from "@/shared/types/insight";
import { mockOrderItems } from "@/entities/mock/insight-data";

// ============================================================
// 상수 — 상태별 뱃지 스타일 및 레이블
// ============================================================

/** 발주 상태 필터 옵션 — null은 전체 */
type StatusFilter = OrderItem["status"] | "all";

const STATUS_LABEL: Record<OrderItem["status"], string> = {
  pending:   "대기",
  reviewing: "검토 중",
  confirmed: "확정",
  sent:      "발송",
};

const STATUS_BADGE_STYLE: Record<OrderItem["status"], string> = {
  pending:   "bg-[#f2f3f5] text-[#6b7280]",
  reviewing: "bg-[#fff3eb] text-[#ff671f] border border-[#ff671f]/20",
  confirmed: "bg-[#ecfdf5] text-[#16a34a] border border-[#16a34a]/20",
  sent:      "bg-[#eff6ff] text-[#2563eb] border border-[#2563eb]/20",
};

const STATUS_ICON: Record<OrderItem["status"], React.ReactNode> = {
  pending:   <Clock size={11} weight="bold" />,
  reviewing: <ArrowsClockwise size={11} weight="bold" />,
  confirmed: <CheckCircle size={11} weight="bold" />,
  sent:      <PaperPlaneTilt size={11} weight="bold" />,
};

/** 카테고리 배지 색상 */
const CATEGORY_BADGE: Record<string, string> = {
  "도넛":   "bg-[#fff3eb] text-[#ff671f]",
  "음료":   "bg-[#eff6ff] text-[#2563eb]",
  "베이글": "bg-[#f5f3ff] text-[#7c3aed]",
};

/** 금액 포맷 — 원 단위, 천 단위 콤마 */
function formatKRW(amount: number): string {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

// ============================================================
// 발주 카드 — 개별 OrderItem 렌더
// ============================================================

function OrderCard({ item }: { item: OrderItem }) {
  // 로이 조정 여부: 추천 수량 != 본사 지시 수량
  const isAdjusted = item.roiRecommendedQty !== item.hqQty;
  const lineTotal  = item.unitPrice * item.finalQty;

  const categoryStyle = CATEGORY_BADGE[item.category] ?? "bg-[#f2f3f5] text-[#6b7280]";

  return (
    <li className="bg-[#ffffff] border border-[#e8e8e8] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      {/* 카드 헤더 — 상품명 + 카테고리 + 상태 */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#e8e8e8]">
        <Package size={15} weight="duotone" className="text-[#6b7280] shrink-0" />
        <span className="text-sm font-bold text-[#0a0a0a] flex-1 min-w-0 truncate">{item.itemName}</span>
        {/* 카테고리 배지 */}
        <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${categoryStyle}`}>
          {item.category}
        </span>
        {/* 상태 배지 */}
        <span className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${STATUS_BADGE_STYLE[item.status]}`}>
          {STATUS_ICON[item.status]}
          {STATUS_LABEL[item.status]}
        </span>
      </div>

      {/* 수량 비교 — 본사 / 로이 추천 / 최종 확정 3열 */}
      <div className="grid grid-cols-3 divide-x divide-[#e8e8e8] px-0 py-0">
        {/* 본사 지시 */}
        <div className="flex flex-col items-center py-3 px-2 gap-0.5">
          <span className="text-[10px] text-[#6b7280]">본사 지시</span>
          <span className="text-lg font-bold text-[#0a0a0a]">{item.hqQty}</span>
          <span className="text-[10px] text-[#9ca3af]">박스</span>
        </div>

        {/* 로이 추천 — 조정 발생 시 오렌지 */}
        <div className={`flex flex-col items-center py-3 px-2 gap-0.5 ${isAdjusted ? "bg-[#fff8f4]" : ""}`}>
          <span className={`text-[10px] ${isAdjusted ? "text-[#ff671f] font-semibold" : "text-[#6b7280]"}`}>
            로이 추천
          </span>
          <span className={`text-lg font-bold ${isAdjusted ? "text-[#ff671f]" : "text-[#0a0a0a]"}`}>
            {item.roiRecommendedQty}
          </span>
          {/* 조정 여부 배지 */}
          {isAdjusted ? (
            <span className="text-[9px] font-bold text-[#ff671f] bg-[#ff671f]/10 px-1.5 py-0.5 rounded-full">
              로이 조정
            </span>
          ) : (
            <span className="text-[10px] text-[#9ca3af]">박스</span>
          )}
        </div>

        {/* 최종 확정 */}
        <div className="flex flex-col items-center py-3 px-2 gap-0.5 bg-[#f8faf9]">
          <span className="text-[10px] text-[#6b7280]">최종 확정</span>
          <span className="text-lg font-bold text-[#0a0a0a]">{item.finalQty}</span>
          <span className="text-[10px] text-[#16a34a] font-semibold">{formatKRW(lineTotal)}</span>
        </div>
      </div>

      {/* 로이 추천 근거 */}
      <div className="px-4 py-2.5 border-t border-[#e8e8e8] bg-[#fafafa]">
        <p className="text-[11px] text-[#6b7280] leading-relaxed">
          <span className="font-semibold text-[#0a0a0a]">로이 · </span>
          {item.roiReason}
        </p>
      </div>
    </li>
  );
}

// ============================================================
// OrderTab — 메인 컴포넌트
// ============================================================

export function OrderTab() {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");

  /** 필터 적용 — "all"이면 전체 반환 */
  const filteredItems = activeFilter === "all"
    ? mockOrderItems
    : mockOrderItems.filter((item) => item.status === activeFilter);

  /** 최종 확정 기준 발주 합계 */
  const totalAmount = filteredItems.reduce(
    (sum, item) => sum + item.unitPrice * item.finalQty,
    0
  );

  /** 전체 발주 합계 (필터 관계없이) */
  const grandTotal = mockOrderItems.reduce(
    (sum, item) => sum + item.unitPrice * item.finalQty,
    0
  );

  const filters: { value: StatusFilter; label: string }[] = [
    { value: "all",       label: "전체" },
    { value: "reviewing", label: "검토 중" },
    { value: "confirmed", label: "확정" },
    { value: "sent",      label: "발송 완료" },
    { value: "pending",   label: "대기" },
  ];

  return (
    <div className="p-5 flex flex-col gap-4 max-w-5xl mx-auto w-full">

      {/* ── 섹션 1: 헤더 + 상태 필터 ── */}
      <section className="bg-[#ffffff] border border-[#e8e8e8] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        {/* 헤더 */}
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#e8e8e8] bg-[#fafafa]">
          <Robot size={16} weight="fill" className="text-[#0a0a0a] shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-sm font-bold text-[#0a0a0a]">로이 · 발주 관리</span>
            <span className="ml-2 text-xs text-[#6b7280]">AI 발주 검토 기반 최적화</span>
          </div>
          {/* Agent 배지 */}
          <span className="text-[10px] font-bold text-white bg-[#0a0a0a] px-2 py-0.5 rounded-full">
            Agent 로이
          </span>
        </div>

        {/* 총 발주 금액 */}
        <div className="px-4 py-3 border-b border-[#e8e8e8]">
          <p className="text-xs text-[#6b7280]">전체 발주 합계</p>
          <p className="text-xl font-bold text-[#0a0a0a] mt-0.5">{formatKRW(grandTotal)}</p>
        </div>

        {/* 상태 필터 pills */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto">
          {filters.map((f) => {
            const isActive = activeFilter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`
                  shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors
                  focus-visible:outline-2 focus-visible:outline-[#0a0a0a] focus-visible:outline-offset-1
                  ${isActive
                    ? "bg-[#0a0a0a] text-white border-[#0a0a0a]"
                    : "bg-[#ffffff] text-[#6b7280] border-[#e8e8e8] hover:border-[#0a0a0a] hover:text-[#0a0a0a] active:bg-[#f2f3f5]"
                  }
                `}
              >
                {f.label}
                {/* 해당 상태 개수 표시 */}
                <span className={`ml-1 ${isActive ? "text-white/70" : "text-[#9ca3af]"}`}>
                  {f.value === "all"
                    ? mockOrderItems.length
                    : mockOrderItems.filter((i) => i.status === f.value).length}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 섹션 2: 발주 카드 목록 ── */}
      <ul className="flex flex-col gap-3">
        {filteredItems.length === 0 ? (
          <li className="text-center py-10 text-sm text-[#9ca3af] bg-[#ffffff] border border-[#e8e8e8] rounded-xl">
            해당 상태의 발주 항목이 없습니다.
          </li>
        ) : (
          filteredItems.map((item) => <OrderCard key={item.id} item={item} />)
        )}
      </ul>

      {/* ── 섹션 3: 발주 합계 + 승인 버튼 ── */}
      <section className="bg-[#ffffff] border border-[#e8e8e8] rounded-xl px-4 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#6b7280]">
              {filteredItems.length}개 항목 선택됨
            </p>
            <p className="text-lg font-bold text-[#0a0a0a] mt-0.5">
              {formatKRW(totalAmount)}
            </p>
          </div>
          {/* 발주 확정 버튼 — POC: 시각 전용 */}
          <button
            className="
              flex items-center gap-2 px-5 py-2.5 rounded-xl
              bg-[#ff671f] text-white text-sm font-bold
              hover:bg-[#e5581a] active:bg-[#cc4e17]
              focus-visible:outline-2 focus-visible:outline-[#ff671f] focus-visible:outline-offset-1
              transition-colors shadow-[0_2px_8px_rgba(255,103,31,0.30)]
            "
            aria-label="발주 확정"
          >
            <PaperPlaneTilt size={15} weight="bold" />
            발주 확정
          </button>
        </div>
      </section>
    </div>
  );
}
