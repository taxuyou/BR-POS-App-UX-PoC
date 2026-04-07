"use client";

/**
 * AiBriefingModal — 오늘의 AI 브리핑 팝업
 * - 사이드바 하단 브리핑 버튼 클릭 시 열림
 * - AI 종합 요약 + 이슈 3건 상세 + 처리 체크 기능
 * - 참고: Won-github/Imagerecallconfirmation AiBriefingModal.tsx
 */

import { useState } from "react";
import { X, Sparkle, CaretDown } from "@phosphor-icons/react";
import { mockCurrentIssues, mockBriefingText } from "@/entities/mock/insight-data";

// ============================================================
// 브리핑 모달 내 이슈 아이템 타입
// ============================================================

const SEVERITY_CONFIG = {
  urgent:  { label: "긴급", color: "#dc2626", bg: "#feecec" },
  warning: { label: "주의", color: "#d97706", bg: "#fff7ed" },
  info:    { label: "확인", color: "#6b7280", bg: "#f3f4f6" },
} as const;

// AI 종합 요약 라인 (루나 분석)
const AI_SUMMARY_LINES = [
  `오늘 즉시 대응이 필요한 이슈는 총 ${mockCurrentIssues.length}건입니다.`,
  "글레이즈드 재고 품절이 가장 큰 매출 손실(₩42,000+) 위험을 가지고 있습니다.",
  "생산 즉시 시작 + 발주서 확정을 가장 먼저 실행할 것을 권장합니다.",
];

// ============================================================
// AiBriefingModal
// ============================================================

interface AiBriefingModalProps {
  onClose: () => void;
}

export function AiBriefingModal({ onClose }: AiBriefingModalProps) {
  const [expandedId, setExpandedId] = useState<string | null>(mockCurrentIssues[0]?.id ?? null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric", weekday: "short",
  });

  return (
    /* 딤드 오버레이 — 클릭 시 닫힘 */
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full flex flex-col overflow-hidden"
        style={{
          maxWidth: 560,
          maxHeight: "90vh",
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 32px 80px rgba(15,23,42,0.22)",
        }}
      >
        {/* ── 헤더 (다크) ── */}
        <div
          className="shrink-0 px-6 pt-6 pb-5"
          style={{ background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)" }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* 아이콘 */}
              <div
                className="w-[42px] h-[42px] rounded-[14px] flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, #FF671F, #E91E8C)",
                  boxShadow: "0 8px 20px rgba(233,30,140,0.35)",
                }}
              >
                <Sparkle size={20} weight="fill" className="text-white" />
              </div>
              <div>
                <p className="text-lg font-extrabold text-white leading-tight">오늘의 AI 브리핑</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,.55)" }}>
                  {today} · 강남역점
                </p>
              </div>
            </div>
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{
                border: "1px solid rgba(255,255,255,.2)",
                background: "rgba(255,255,255,.08)",
                color: "rgba(255,255,255,.8)",
              }}
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          {/* AI 종합 요약 블록 */}
          <div
            className="rounded-[14px] px-4 py-3.5"
            style={{
              background: "rgba(255,255,255,.07)",
              border: "1px solid rgba(255,255,255,.12)",
            }}
          >
            <p
              className="text-[11px] font-extrabold mb-2.5 uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,.45)" }}
            >
              루나 · AI 종합 요약
            </p>
            <div className="flex flex-col gap-2">
              {AI_SUMMARY_LINES.map((line, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span
                    className="w-[18px] h-[18px] rounded-md flex items-center justify-center text-[10px] font-extrabold text-white shrink-0 mt-0.5"
                    style={{ background: "linear-gradient(135deg, #FF671F, #E91E8C)" }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,.82)" }}>
                    {line}
                  </span>
                </div>
              ))}
            </div>

            {/* 루나 브리핑 텍스트 */}
            <p
              className="text-xs leading-relaxed mt-3 pt-3"
              style={{
                color: "rgba(255,255,255,.6)",
                borderTop: "1px solid rgba(255,255,255,.1)",
              }}
            >
              {mockBriefingText}
            </p>
          </div>
        </div>

        {/* ── 이슈 목록 ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3">
          <p
            className="text-[11px] font-extrabold uppercase tracking-widest mb-1"
            style={{ color: "#9ca3af" }}
          >
            이슈 상세 ({mockCurrentIssues.length}건)
          </p>

          {mockCurrentIssues.map((issue) => {
            const isExpanded = expandedId === issue.id;
            const isDone = checkedIds.has(issue.id);
            const cfg = SEVERITY_CONFIG[issue.severity];

            return (
              <div
                key={issue.id}
                className="overflow-hidden transition-all duration-200"
                style={{
                  border: `1.5px solid ${isExpanded ? "#FF671F" : "#e7ebf3"}`,
                  borderRadius: 18,
                  opacity: isDone ? 0.5 : 1,
                  background: isDone ? "#f8fafc" : "#fff",
                }}
              >
                {/* 이슈 헤더 행 */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : issue.id)}
                  className="flex items-center gap-3 px-4 py-3.5 cursor-pointer select-none"
                >
                  {/* 체크 버튼 */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleCheck(issue.id); }}
                    className="w-[22px] h-[22px] rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-extrabold transition-all"
                    style={{
                      border: isDone ? "none" : "2px solid #d1d5db",
                      background: isDone ? "linear-gradient(135deg, #FF671F, #E91E8C)" : "transparent",
                      color: isDone ? "#fff" : "transparent",
                    }}
                  >
                    ✓
                  </button>

                  {/* 심각도 배지 */}
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shrink-0"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    {cfg.label}
                  </span>

                  <span
                    className="flex-1 text-sm font-bold"
                    style={{
                      color: isDone ? "#9ca3af" : "#111827",
                      textDecoration: isDone ? "line-through" : "none",
                    }}
                  >
                    {issue.title}
                  </span>

                  <CaretDown
                    size={14}
                    weight="bold"
                    className="text-tertiary shrink-0 transition-transform duration-200"
                    style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </div>

                {/* 펼침 상세 */}
                {isExpanded && (
                  <div
                    className="px-4 pb-4 pt-3"
                    style={{ borderTop: "1px solid #f3f4f6" }}
                  >
                    <p className="text-xs text-secondary leading-relaxed mb-3">{issue.detail}</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-tertiary">{issue.detectedAt} 감지 · {issue.agentName}</span>
                      <button
                        onClick={() => toggleCheck(issue.id)}
                        className="h-8 px-4 rounded-full text-white text-xs font-extrabold transition-opacity hover:opacity-90"
                        style={{ background: isDone ? "#6b7280" : "linear-gradient(135deg, #FF671F, #E91E8C)", border: 0 }}
                      >
                        {isDone ? "✓ 처리 완료" : "조치 확인 →"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── 푸터 ── */}
        <div
          className="shrink-0 px-6 py-4 flex items-center justify-between gap-3"
          style={{ borderTop: "1px solid #e7ebf3" }}
        >
          <span className="text-xs text-tertiary">
            처리 완료: {checkedIds.size} / {mockCurrentIssues.length}건
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="h-9 px-4 rounded-xl text-sm font-bold text-primary bg-surface border border-border hover:bg-[#eee] transition-colors"
            >
              닫기
            </button>
            <button
              className="h-9 px-4 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #111827, #374151)", border: 0 }}
            >
              리포트로 내보내기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
