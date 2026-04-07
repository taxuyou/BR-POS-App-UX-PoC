"use client";

/**
 * MonitoringTab — 모니터링 탭
 * - Agent 상태 카드 3종 (제이/로이/루나)
 * - 피크 타임 알림 섹션 (14:00 기준 이후 피크 강조)
 * - POS·배달앱·모바일·본사 서버 연결 상태
 */

import { Cpu, WifiHigh, DeviceMobile, Database, Clock, TrendUp } from "@phosphor-icons/react";
import type { Icon, IconWeight } from "@phosphor-icons/react";
import { mockAgents, mockHourlySales } from "@/entities/mock/insight-data";
import type { AgentInfo, AgentStatus, HourlySalesPoint } from "@/shared/types/insight";

// ============================================================
// 타입: Agent 카드 스타일 맵
// ============================================================

/** Agent ID별 색조 테마 */
const AGENT_THEME: Record<AgentInfo["id"], { bg: string; badge: string; dot: string }> = {
  A: { bg: "bg-blue-50",   badge: "bg-blue-100 text-blue-700 border-blue-200",   dot: "bg-blue-500"   },
  B: { bg: "bg-green-50",  badge: "bg-green-100 text-green-700 border-green-200",  dot: "bg-green-500"  },
  C: { bg: "bg-purple-50", badge: "bg-purple-100 text-purple-700 border-purple-200", dot: "bg-purple-500" },
};

/** Agent 상태별 뱃지 스타일 */
const STATUS_STYLE: Record<AgentStatus, { label: string; cls: string; pulse: boolean }> = {
  active: { label: "활성", cls: "bg-emerald-100 text-emerald-700 border-emerald-200", pulse: true  },
  idle:   { label: "대기", cls: "bg-surface text-secondary border-border",            pulse: false },
  error:  { label: "오류", cls: "bg-red-100 text-red-600 border-red-200",             pulse: false },
};

// ============================================================
// 섹션 1: Agent 상태 카드 3종
// ============================================================

function AgentCard({ agent }: { agent: AgentInfo }) {
  const theme  = AGENT_THEME[agent.id];
  const status = STATUS_STYLE[agent.status];

  return (
    <div className={`rounded-xl border border-border p-4 flex flex-col gap-3 ${theme.bg}`}>
      {/* 헤더: 이름 + 상태 뱃지 */}
      <div className="flex items-start justify-between gap-2">
        <div>
          {/* Agent 이름 — 크게 */}
          <p className="text-lg font-black text-primary leading-none">{agent.name}</p>
          <p className="text-xs text-secondary mt-0.5">{agent.role}</p>
        </div>

        {/* 상태 뱃지 */}
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${status.cls}`}>
          {/* 활성 시 펄스 닷 */}
          {status.pulse ? (
            <span className="relative flex w-1.5 h-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-emerald-500" />
            </span>
          ) : (
            <span className={`w-1.5 h-1.5 rounded-full ${agent.status === "error" ? "bg-red-500" : "bg-gray-400"}`} />
          )}
          {status.label}
        </span>
      </div>

      {/* 확신도 바 */}
      <div>
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-tertiary">확신도</span>
          <span className="font-bold text-primary">{agent.confidence}%</span>
        </div>
        <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${theme.dot}`}
            style={{ width: `${agent.confidence}%` }}
          />
        </div>
      </div>

      {/* 마지막 액션 시간 */}
      <p className="text-[10px] text-tertiary">마지막 액션: {agent.lastActionAt}</p>
    </div>
  );
}

function AgentStatusSection() {
  return (
    <section className="bg-card border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card-sm)]">
      {/* 섹션 헤더 */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <Cpu size={15} weight="fill" className="text-primary" />
        <span className="text-sm font-bold text-primary">AI Agent 상태</span>
        {/* 활성 Agent 수 */}
        <span className="ml-auto text-xs text-secondary">
          {mockAgents.filter((a) => a.status === "active").length}/{mockAgents.length} 활성
        </span>
      </div>

      {/* 3열 그리드 */}
      <div className="p-4 grid grid-cols-3 gap-3">
        {(mockAgents as AgentInfo[]).map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </section>
  );
}

// ============================================================
// 섹션 2: 피크 타임 알림
// 현재 시각을 14:00으로 가정 — mock 데이터 기반
// ============================================================

/** mock 기준 현재 시각: 14시 (POC 목적 하드코딩) */
const MOCK_CURRENT_HOUR = 14;

function PeakAlertSection() {
  /** 현재 시각 이후의 피크 시간대만 필터링 */
  const upcomingPeaks = (mockHourlySales as HourlySalesPoint[]).filter(
    (p) => p.isPeak && p.hour > MOCK_CURRENT_HOUR
  );

  if (upcomingPeaks.length === 0) {
    return (
      <section className="bg-card border border-border rounded-xl p-4 text-center text-sm text-secondary">
        오늘 남은 피크 시간대 없음
      </section>
    );
  }

  return (
    <section className="bg-card border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card-sm)]">
      {/* 섹션 헤더 */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-[#FFF8F5]">
        <Clock size={15} weight="fill" className="text-[#FF671F]" />
        <span className="text-sm font-bold text-primary">피크 타임 예보</span>
        <span className="ml-auto text-xs text-[#FF671F] font-semibold">{upcomingPeaks.length}개 예정</span>
      </div>

      <div className="p-4 flex flex-col gap-2">
        {upcomingPeaks.map((peak) => (
          <div
            key={peak.hour}
            className="flex items-center gap-3 bg-[#FFF8F5] border border-[#FF671F]/15 rounded-xl px-4 py-3"
          >
            {/* 아이콘 */}
            <TrendUp size={18} weight="fill" className="text-[#FF671F] shrink-0" />

            {/* 정보 */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-primary">{peak.hour}시 피크 예정</p>
              <p className="text-xs text-secondary mt-0.5">
                유동 인구 {peak.footfallChange >= 0 ? "+" : ""}{peak.footfallChange}% 예측
              </p>
            </div>

            {/* 권장 액션 뱃지 */}
            <span className="shrink-0 px-2 py-1 rounded-lg bg-primary text-white text-[10px] font-semibold">
              생산 준비 권장
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// 섹션 3: POS · 시스템 연결 상태
// ============================================================

interface ConnectionItem {
  label: string;
  sublabel?: string;
  icon: Icon;
  iconWeight: IconWeight;
  status: "ok" | "warn" | "error";
}

const CONNECTION_ITEMS: ConnectionItem[] = [
  { label: "POS 단말기",    sublabel: "메인·보조 2대",    icon: Database,     iconWeight: "fill",    status: "ok" },
  { label: "배민",          sublabel: "배달의민족",        icon: WifiHigh,     iconWeight: "regular", status: "ok" },
  { label: "쿠팡이츠",      sublabel: "배달앱 연동",       icon: WifiHigh,     iconWeight: "regular", status: "ok" },
  { label: "모바일 앱",     sublabel: "던킨 공식 앱",      icon: DeviceMobile, iconWeight: "regular", status: "ok" },
  { label: "본사 서버",     sublabel: "프랜차이즈 HQ",     icon: Database,     iconWeight: "fill",    status: "ok" },
];

const STATUS_COLOR: Record<ConnectionItem["status"], { dot: string; text: string; label: string }> = {
  ok:    { dot: "bg-emerald-500", text: "text-emerald-600", label: "정상" },
  warn:  { dot: "bg-amber-400",   text: "text-amber-600",   label: "점검 필요" },
  error: { dot: "bg-red-500",     text: "text-red-600",     label: "연결 오류" },
};

function ConnectionStatusSection() {
  return (
    <section className="bg-card border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card-sm)]">
      {/* 섹션 헤더 */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <WifiHigh size={15} weight="fill" className="text-primary" />
        <span className="text-sm font-bold text-primary">시스템 연결 상태</span>
        <span className="ml-auto text-xs text-emerald-600 font-semibold">전체 정상</span>
      </div>

      <ul className="divide-y divide-border">
        {CONNECTION_ITEMS.map((item) => {
          const s = STATUS_COLOR[item.status];
          const IconComponent = item.icon;
          return (
            <li key={item.label} className="flex items-center gap-3 px-4 py-3">
              {/* 아이콘 */}
              <IconComponent size={16} className="text-secondary shrink-0" weight={item.iconWeight} />

              {/* 이름 */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-primary">{item.label}</p>
                {item.sublabel && (
                  <p className="text-[10px] text-tertiary">{item.sublabel}</p>
                )}
              </div>

              {/* 상태 */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                <span className={`text-xs font-semibold ${s.text}`}>{s.label}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ============================================================
// MonitoringTab — 3개 섹션 조합
// ============================================================

export function MonitoringTab() {
  return (
    <div className="p-5 flex flex-col gap-4 max-w-5xl mx-auto w-full">
      {/* 섹션 1: Agent 상태 카드 */}
      <AgentStatusSection />

      {/* 섹션 2: 피크 타임 예보 */}
      <PeakAlertSection />

      {/* 섹션 3: 시스템 연결 상태 */}
      <ConnectionStatusSection />
    </div>
  );
}
