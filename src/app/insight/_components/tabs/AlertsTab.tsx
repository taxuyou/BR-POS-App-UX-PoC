"use client";

/**
 * AlertsTab — Insight Console 알림 설정 탭
 * - 4개 카테고리(생산/발주/매출/시스템)별 알림 규칙 목록 표시
 * - POC: 토글·임계치 시각적 표현만. 실제 상태 변경 없음
 * - 각 규칙에 임계치 뱃지(선택적) + 토글 스위치 UI 표시
 */

import { Bell, Factory, Package, ChartLineUp, Desktop } from "@phosphor-icons/react";
import type { AlertRule } from "@/shared/types/insight";
import { mockAlertRules } from "@/entities/mock/insight-data";

// ============================================================
// 카테고리 메타데이터 — 아이콘·레이블·액센트 색상
// ============================================================

/** 카테고리별 표시 정보 */
const CATEGORY_META: Record<
  AlertRule["category"],
  { label: string; accent: string; bg: string; icon: React.ReactNode }
> = {
  production: {
    label: "생산 알림",
    accent: "text-[#ff671f]",
    bg: "bg-[#fff5f0]",
    icon: <Factory size={15} weight="fill" className="text-[#ff671f]" />,
  },
  order: {
    label: "발주 알림",
    accent: "text-blue-600",
    bg: "bg-blue-50",
    icon: <Package size={15} weight="fill" className="text-blue-600" />,
  },
  sales: {
    label: "매출 알림",
    accent: "text-green-600",
    bg: "bg-green-50",
    icon: <ChartLineUp size={15} weight="fill" className="text-green-600" />,
  },
  system: {
    label: "시스템 알림",
    accent: "text-[#6b7280]",
    bg: "bg-[#f3f4f6]",
    icon: <Desktop size={15} weight="fill" className="text-[#6b7280]" />,
  },
};

/** 카테고리 순서 — 중요도 내림차순 */
const CATEGORY_ORDER: AlertRule["category"][] = ["production", "order", "sales", "system"];

// ============================================================
// 토글 스위치 — CSS 전용, POC라 시각적 표현만
// ============================================================

interface ToggleSwitchProps {
  enabled: boolean;
}

function ToggleSwitch({ enabled }: ToggleSwitchProps) {
  return (
    <div
      role="switch"
      aria-checked={enabled}
      aria-label={enabled ? "알림 켜짐" : "알림 꺼짐"}
      className={`
        w-9 h-5 rounded-full flex items-center px-0.5 transition-colors shrink-0 cursor-pointer
        ${enabled ? "bg-[#0a0a0a]" : "bg-[#e8e8e8]"}
        focus-visible:outline-2 focus-visible:outline-[#0a0a0a] focus-visible:outline-offset-1
      `}
      tabIndex={0}
    >
      <div
        className={`
          w-4 h-4 rounded-full bg-white shadow-sm transition-transform
          ${enabled ? "translate-x-4" : "translate-x-0"}
        `}
      />
    </div>
  );
}

// ============================================================
// 임계치 뱃지 — "60분" 형태, POC라 편집 불가
// ============================================================

interface ThresholdBadgeProps {
  threshold: number;
  unit: string;
}

function ThresholdBadge({ threshold, unit }: ThresholdBadgeProps) {
  return (
    <span className="
      inline-flex items-center px-2 py-0.5 rounded-full
      bg-surface border border-border
      text-[11px] font-semibold text-secondary
      shrink-0
    ">
      {threshold}{unit}
    </span>
  );
}

// ============================================================
// 알림 규칙 단일 행
// ============================================================

interface AlertRuleRowProps {
  rule: AlertRule;
}

function AlertRuleRow({ rule }: AlertRuleRowProps) {
  return (
    <li className="flex items-center gap-3 px-4 py-3.5">
      {/* 왼쪽: 제목 + 설명 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-primary leading-snug">{rule.title}</p>
        <p className="text-xs text-secondary mt-0.5 leading-relaxed">{rule.description}</p>
      </div>

      {/* 임계치 뱃지 (존재 시) */}
      {rule.threshold !== undefined && rule.thresholdUnit !== undefined && (
        <ThresholdBadge threshold={rule.threshold} unit={rule.thresholdUnit} />
      )}

      {/* 토글 스위치 */}
      <ToggleSwitch enabled={rule.enabled} />
    </li>
  );
}

// ============================================================
// 카테고리 섹션
// ============================================================

interface AlertCategorySectionProps {
  category: AlertRule["category"];
  rules: AlertRule[];
}

function AlertCategorySection({ category, rules }: AlertCategorySectionProps) {
  const meta = CATEGORY_META[category];

  return (
    <section className="bg-white border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card-sm)]">
      {/* 섹션 헤더 */}
      <div className={`flex items-center gap-2.5 px-4 py-3 border-b border-border ${meta.bg}`}>
        {meta.icon}
        <span className={`text-sm font-bold ${meta.accent}`}>{meta.label}</span>
        <span className="ml-auto text-[10px] font-semibold text-secondary bg-white border border-border px-2 py-0.5 rounded-full">
          {rules.length}개
        </span>
      </div>

      {/* 규칙 목록 */}
      <ul className="divide-y divide-border">
        {rules.map((rule) => (
          <AlertRuleRow key={rule.id} rule={rule} />
        ))}
      </ul>
    </section>
  );
}

// ============================================================
// AlertsTab 메인
// ============================================================

export function AlertsTab() {
  return (
    <div className="p-5 flex flex-col gap-4 max-w-5xl mx-auto w-full">
      {/* 페이지 헤더 */}
      <div className="flex items-center gap-2.5">
        <Bell size={18} weight="fill" className="text-primary shrink-0" />
        <div>
          <h2 className="text-base font-bold text-primary leading-tight">알림 설정</h2>
          <p className="text-xs text-secondary mt-0.5">
            조건 충족 시 자동으로 담당 Agent가 알림을 보냅니다
          </p>
        </div>
      </div>

      {/* 카테고리별 알림 섹션 */}
      {CATEGORY_ORDER.map((category) => {
        const rules = mockAlertRules.filter((r) => r.category === category);
        if (rules.length === 0) return null;

        return (
          <AlertCategorySection key={category} category={category} rules={rules} />
        );
      })}
    </div>
  );
}
