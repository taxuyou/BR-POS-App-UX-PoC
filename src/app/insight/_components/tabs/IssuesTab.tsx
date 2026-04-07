"use client";

/**
 * IssuesTab — Insight Console 이슈 탭
 * - 검색 + 필터 바: 자연어 검색 / severity / agent 필터
 * - 이슈 목록: severity별 좌측 보더 + 에이전트 배지 + 시간
 * - 클라이언트 사이드 필터링 (query / severity / agent 3중 교차 필터)
 */

import { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { mockCurrentIssues } from "@/entities/mock/insight-data";
import type { CurrentIssue } from "@/shared/types/insight";

// ============================================================
// severity별 좌측 보더 색상 — UT 기반 신호등 체계
// ============================================================

/** severity에 따른 좌측 보더 + 배지 스타일 */
const SEVERITY_STYLE: Record<
  CurrentIssue["severity"],
  { border: string; badge: string; label: string }
> = {
  urgent:  { border: "border-l-[#0a0a0a]", badge: "bg-[#0a0a0a] text-white",                                       label: "긴급" },
  warning: { border: "border-l-[#FF671F]",  badge: "bg-[#FFF0E8] text-[#FF671F] border border-[#FF671F]/20",        label: "주의" },
  info:    { border: "border-l-[#d1d1d1]",  badge: "bg-surface text-secondary border border-border",                label: "정보" },
};

// ============================================================
// Agent 필터 옵션 — 전체 + Agent 3종
// ============================================================

const AGENT_FILTER_OPTIONS = ["전체", "제이", "로이", "루나"] as const;

// ============================================================
// severity 필터 옵션
// ============================================================

type SeverityFilter = "all" | CurrentIssue["severity"];

const SEVERITY_FILTER_OPTIONS: Array<{ value: SeverityFilter; label: string }> = [
  { value: "all",     label: "전체" },
  { value: "urgent",  label: "긴급" },
  { value: "warning", label: "주의" },
  { value: "info",    label: "정보" },
];

// ============================================================
// IssuesTab 컴포넌트
// ============================================================

export function IssuesTab() {
  /** 자연어 검색 쿼리 */
  const [query, setQuery] = useState("");
  /** severity 필터 — "all" | "urgent" | "warning" | "info" */
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  /** Agent 이름 필터 */
  const [agentFilter, setAgentFilter] = useState("전체");

  // 클라이언트 사이드 3중 교차 필터
  const filtered = mockCurrentIssues.filter((issue) => {
    const matchQuery =
      query === "" ||
      issue.title.includes(query) ||
      issue.detail.includes(query);
    const matchSeverity =
      severityFilter === "all" || issue.severity === severityFilter;
    const matchAgent =
      agentFilter === "전체" || issue.agentName === agentFilter;
    return matchQuery && matchSeverity && matchAgent;
  });

  return (
    <div className="p-5 flex flex-col gap-4 max-w-5xl mx-auto w-full">
      {/* ── 검색 + 필터 바 ── */}
      <div className="bg-white border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card-sm)]">
        {/* 검색 입력창 */}
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border">
          <MagnifyingGlass size={16} className="text-tertiary shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이슈 검색... 예) 글레이즈드 재고 문제"
            className="
              flex-1 text-sm text-primary placeholder:text-tertiary
              bg-transparent outline-none
              focus-visible:outline-none
            "
            aria-label="이슈 검색"
          />
          {/* 검색어 초기화 버튼 */}
          {query !== "" && (
            <button
              onClick={() => setQuery("")}
              className="
                text-tertiary hover:text-secondary active:text-primary
                transition-colors text-xs
                focus-visible:outline-2 focus-visible:outline-[#FF671F] focus-visible:outline-offset-1 rounded
              "
              type="button"
              aria-label="검색어 초기화"
            >
              초기화
            </button>
          )}
        </div>

        {/* 필터 필 — severity */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border overflow-x-auto">
          <span className="text-[10px] text-tertiary shrink-0 font-semibold">상태</span>
          <div className="flex items-center gap-1.5">
            {SEVERITY_FILTER_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setSeverityFilter(value)}
                type="button"
                className={`
                  px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                  transition-all
                  focus-visible:outline-2 focus-visible:outline-[#FF671F] focus-visible:outline-offset-1
                  ${
                    severityFilter === value
                      ? "bg-primary text-white"
                      : "bg-surface text-secondary border border-border hover:border-primary/40 active:bg-[#e8e8e8]"
                  }
                `}
                aria-pressed={severityFilter === value}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 필터 필 — Agent */}
        <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto">
          <span className="text-[10px] text-tertiary shrink-0 font-semibold">에이전트</span>
          <div className="flex items-center gap-1.5">
            {AGENT_FILTER_OPTIONS.map((name) => (
              <button
                key={name}
                onClick={() => setAgentFilter(name)}
                type="button"
                className={`
                  px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                  transition-all
                  focus-visible:outline-2 focus-visible:outline-[#FF671F] focus-visible:outline-offset-1
                  ${
                    agentFilter === name
                      ? "bg-[#FF671F] text-white"
                      : "bg-surface text-secondary border border-border hover:border-[#FF671F]/40 active:bg-[#e8e8e8]"
                  }
                `}
                aria-pressed={agentFilter === name}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 이슈 목록 ── */}
      <section className="bg-white border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card-sm)]">
        {/* 섹션 헤더 — 필터 결과 건수 표시 */}
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border">
          <span className="text-sm font-bold text-primary">이슈 목록</span>
          <span className="text-xs text-tertiary ml-auto">
            {filtered.length}건
          </span>
        </div>

        {/* 빈 상태 */}
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-sm text-tertiary">
            검색 결과가 없습니다
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((issue) => {
              const style = SEVERITY_STYLE[issue.severity];
              return (
                <li
                  key={issue.id}
                  className={`flex items-start gap-3 px-4 py-3 border-l-[3px] ${style.border}`}
                >
                  <div className="flex-1 min-w-0">
                    {/* 제목 */}
                    <p className="text-sm font-semibold text-primary leading-snug">
                      {issue.title}
                    </p>
                    {/* 상세 내용 */}
                    <p className="text-xs text-secondary mt-0.5 leading-relaxed">
                      {issue.detail}
                    </p>
                    {/* 메타 정보 — 에이전트 배지 + 감지 시각 */}
                    <div className="flex items-center gap-2 mt-1.5">
                      {/* severity 배지 */}
                      <span
                        className={`
                          inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold
                          ${style.badge}
                        `}
                      >
                        {style.label}
                      </span>
                      {/* Agent 이름 배지 */}
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-surface border border-border text-[10px] font-semibold text-secondary">
                        {issue.agentName}
                      </span>
                      <span className="text-[10px] text-tertiary">
                        {issue.detectedAt} 감지
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
