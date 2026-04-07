"use client";

/**
 * ReportTab — 루나 · 자동 생성 리포트 탭
 * - 섹션 1: 자동 생성 리포트 (일간/주간/월간) — 루나 생성
 * - 섹션 2: 배달 플랫폼 정산 현황 (DeliverySettlementSection)
 * - 섹션 3: 리뷰 모니터링 (ReviewMonitoringSection)
 * - 300줄 초과 방지: 정산·리뷰 섹션은 ReportTabSections.tsx 분리
 */

import { Robot, CalendarBlank, Eye } from "@phosphor-icons/react";
import type { AutoReport } from "@/shared/types/insight";
import { mockAutoReports } from "@/entities/mock/insight-data";
import { DeliverySettlementSection, ReviewMonitoringSection } from "./ReportTabSections";

// ============================================================
// 리포트 타입별 배지 스타일 + 레이블
// ============================================================

const REPORT_TYPE_STYLE: Record<AutoReport["type"], string> = {
  daily:   "bg-[#f2f3f5] text-[#6b7280] border border-[#e8e8e8]",
  weekly:  "bg-[#eff6ff] text-[#2563eb] border border-[#2563eb]/20",
  monthly: "bg-[#f5f3ff] text-[#7c3aed] border border-[#7c3aed]/20",
};

const REPORT_TYPE_LABEL: Record<AutoReport["type"], string> = {
  daily:   "일간",
  weekly:  "주간",
  monthly: "월간",
};

// ============================================================
// 리포트 카드 — 개별 AutoReport 렌더
// ============================================================

function ReportCard({ report }: { report: AutoReport }) {
  return (
    <li className="bg-[#ffffff] border border-[#e8e8e8] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      {/* 카드 헤더 — 타입 배지 + 제목 */}
      <div className="flex items-start gap-3 px-4 py-3 border-b border-[#e8e8e8]">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {/* 리포트 타입 배지 */}
            <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${REPORT_TYPE_STYLE[report.type]}`}>
              {REPORT_TYPE_LABEL[report.type]}
            </span>
            <h3 className="text-sm font-bold text-[#0a0a0a] leading-snug">{report.title}</h3>
          </div>
          {/* 생성 시각 */}
          <div className="flex items-center gap-1 mt-1">
            <CalendarBlank size={11} className="text-[#9ca3af]" />
            <span className="text-[11px] text-[#9ca3af]">{report.generatedAt} 자동 생성</span>
          </div>
        </div>

        {/* 보기 버튼 — ghost 스타일, POC: 시각 전용 */}
        <button
          className="
            shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg
            text-xs font-semibold text-[#0a0a0a]
            border border-[#e8e8e8] bg-[#ffffff]
            hover:bg-[#f2f3f5] hover:border-[#0a0a0a]
            active:bg-[#e8e8e8]
            focus-visible:outline-2 focus-visible:outline-[#0a0a0a] focus-visible:outline-offset-1
            transition-colors
          "
          aria-label={`${report.title} 보기`}
        >
          <Eye size={12} weight="regular" />
          보기
        </button>
      </div>

      {/* 요약 텍스트 */}
      <div className="px-4 py-3 bg-[#fafafa]">
        <p className="text-xs text-[#6b7280] leading-relaxed">{report.summary}</p>
      </div>
    </li>
  );
}

// ============================================================
// 섹션 1: 자동 생성 리포트
// ============================================================

function AutoReportSection() {
  return (
    <section className="flex flex-col gap-3">
      {/* 섹션 헤더 */}
      <div className="flex items-center gap-2.5 px-4 py-3 bg-[#ffffff] border border-[#e8e8e8] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <Robot size={16} weight="fill" className="text-[#0a0a0a] shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-bold text-[#0a0a0a]">루나 · 자동 생성 리포트</span>
          <span className="ml-2 text-xs text-[#6b7280]">매출·인사이트 기반 자동 집계</span>
        </div>
        {/* Agent 배지 */}
        <span className="text-[10px] font-bold text-white bg-[#0a0a0a] px-2 py-0.5 rounded-full">
          Agent 루나
        </span>
      </div>

      {/* 리포트 카드 목록 */}
      <ul className="flex flex-col gap-3">
        {mockAutoReports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </ul>
    </section>
  );
}

// ============================================================
// ReportTab — 3개 섹션 조합
// ============================================================

export function ReportTab() {
  return (
    <div className="p-5 flex flex-col gap-4 max-w-5xl mx-auto w-full">
      {/* 섹션 1: 자동 생성 리포트 */}
      <AutoReportSection />

      {/* 섹션 2: 배달 플랫폼 정산 현황 */}
      <DeliverySettlementSection />

      {/* 섹션 3: 리뷰 모니터링 */}
      <ReviewMonitoringSection />
    </div>
  );
}
