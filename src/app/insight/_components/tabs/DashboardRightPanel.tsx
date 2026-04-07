"use client";

/**
 * DashboardRightPanel — 대시보드 우측 sticky 패널
 * - AI 신뢰도 패널: 점주 신뢰도 향상을 위한 Explainable AI
 *   - Agent별 확신도 게이지
 *   - 판단 근거 공개 (데이터/패턴/외부 요인)
 *   - 학습 기반 정보 (몇 일치 데이터, 정확도)
 * - 즉시 추천 액션 (루나·제이·로이 합작)
 */

import { ArrowRight, Database, ChartLine, Cloud } from "@phosphor-icons/react";
import type { InsightTab } from "@/shared/types/insight";
import { mockAgentTrustData, mockRecommendedActions } from "@/entities/mock/insight-data";

// ============================================================
// Agent 배지 컬러 매핑
// ============================================================

const AGENT_BADGE: Record<"제이" | "로이" | "루나", string> = {
  제이: "bg-[#0a0a0a] text-white",
  로이: "bg-blue-600 text-white",
  루나: "bg-[#FF671F] text-white",
};

// 판단 근거 아이콘
const EVIDENCE_ICON = {
  data:     Database,
  pattern:  ChartLine,
  external: Cloud,
} as const;

const EVIDENCE_LABEL_COLOR: Record<string, string> = {
  data:     "text-blue-600 bg-blue-50",
  pattern:  "text-[#FF671F] bg-[#FFF0E8]",
  external: "text-green-600 bg-green-50",
};

// ============================================================
// AI 신뢰도 + 추천 액션 통합 패널
// ============================================================

export function AiTrustPanel({ onNavigate }: { onNavigate: (tab: InsightTab) => void }) {
  // 대표 에이전트 = 루나 (매출·인사이트 담당, 대시보드 주 분석)
  const lunaData = mockAgentTrustData.find((d) => d.agentName === "루나")!;

  return (
    <div className="flex flex-col gap-3">
      {/* ── AI 신뢰도 헤더 카드 ── */}
      <section
        className="rounded-xl overflow-hidden"
        style={{ background: "linear-gradient(160deg, #111827 0%, #1f2937 100%)" }}
      >
        {/* 헤더 */}
        <div className="px-4 pt-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 mb-0.5">
            {/* 루나 배지 */}
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#FF671F] text-white text-[10px] font-bold">
              루나
            </span>
            <span className="text-sm font-bold text-white">AI 판단 신뢰도</span>
            {/* 실시간 펄스 */}
            <span className="ml-auto flex items-center gap-1 text-[10px] text-green-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              실시간
            </span>
          </div>
          <p className="text-[11px] text-white/50 leading-relaxed">
            왜 이렇게 판단했는지 근거를 공개합니다
          </p>
        </div>

        {/* Agent 3종 확신도 게이지 */}
        <div className="px-4 pt-3 pb-4 flex flex-col gap-3">
          {mockAgentTrustData.map((agent) => (
            <div key={agent.agentName}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${AGENT_BADGE[agent.agentName]}`}
                  >
                    {agent.agentName}
                  </span>
                  <span className="text-[11px] text-white/50">{agent.role}</span>
                </div>
                <span className="text-xs font-bold text-white tabular-nums">
                  {agent.confidence}%
                </span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${agent.confidence}%`,
                    background: "linear-gradient(90deg, #FF671F, #E91E8C)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 판단 근거 공개 (루나 기준) ── */}
      <section className="bg-white border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card-sm)]">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-xs font-bold text-primary">루나의 판단 근거</p>
          <p className="text-[11px] text-tertiary mt-0.5">
            {lunaData.trainedDays}일치 데이터 기반 · 유사 상황 정확도{" "}
            <span className="font-bold text-[#FF671F]">{lunaData.accuracy}%</span>
          </p>
        </div>

        <ul className="divide-y divide-border">
          {lunaData.evidences.map((ev) => {
            const Icon = EVIDENCE_ICON[ev.type];
            const colorCls = EVIDENCE_LABEL_COLOR[ev.type];
            return (
              <li key={ev.label} className="px-4 py-3 flex items-start gap-2.5">
                {/* 아이콘 배지 */}
                <div
                  className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${colorCls}`}
                >
                  <Icon size={12} weight="bold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-primary">{ev.label}</p>
                  <p className="text-[11px] text-secondary leading-relaxed mt-0.5">
                    {ev.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        {/* 학습 기반 배지 */}
        <div className="px-4 py-2.5 bg-[#f8faf9] border-t border-border flex flex-wrap gap-1.5">
          <span className="inline-flex items-center text-[10px] font-semibold text-secondary bg-white border border-border px-2 py-0.5 rounded-full">
            강남역점 37일치 학습
          </span>
          <span className="inline-flex items-center text-[10px] font-semibold text-[#FF671F] bg-[#FFF0E8] border border-[#FF671F]/20 px-2 py-0.5 rounded-full">
            정확도 84%
          </span>
          <span className="inline-flex items-center text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
            날씨·유동인구 연동
          </span>
        </div>
      </section>

      {/* ── 즉시 추천 액션 ── */}
      <section className="bg-white border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card-sm)]">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-xs font-bold text-primary">즉시 추천 액션</p>
          <p className="text-[11px] text-tertiary mt-0.5">지금 바로 실행하면 효과가 가장 큽니다</p>
        </div>

        <ul className="divide-y divide-border">
          {mockRecommendedActions.map((action) => (
            <li key={action.id} className="px-4 py-3">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${AGENT_BADGE[action.agentName]}`}
                  >
                    {action.agentName}
                  </span>
                  <span className="text-xs font-semibold text-primary leading-snug">
                    {action.title}
                  </span>
                </div>
                {/* 예상 효과 */}
                <span className="shrink-0 text-[10px] font-bold text-green-600 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded-md">
                  +{action.expectedLift}%
                </span>
              </div>
              <p className="text-[11px] text-secondary leading-relaxed mb-2">
                {action.description}
              </p>
              <button
                onClick={() => onNavigate(action.tab)}
                className="
                  flex items-center gap-1 text-[11px] font-semibold text-primary
                  hover:text-[#FF671F] transition-colors
                  focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#FF671F]
                "
              >
                실행안 보기
                <ArrowRight size={10} weight="bold" />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
