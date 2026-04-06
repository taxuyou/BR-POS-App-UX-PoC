"use client";

import { AlertTriangle, ChevronRight, Package, Shield, BarChart2, TrendingDown, Zap } from "lucide-react";
import {
  mockHomeBriefing,
  mockUrgentItems,
  totalChanceLoss,
  urgentProductionCount,
} from "@/entities/mock/pos-data";
import type { PosTab } from "@/shared/types/pos";

// ============================================================
// 메트릭 카드
// ============================================================

function MetricCard({
  label,
  value,
  sub,
  trendUp,
  trendDown,
  highlight,
  Icon,
}: {
  label: string;
  value: string;
  sub: string;
  trendUp?: boolean;
  trendDown?: boolean;
  highlight?: boolean;
  Icon?: React.FC<{ size?: number; className?: string }>;
}) {
  const subColor = (trendUp || trendDown) ? "text-success" : highlight ? "text-[#FF671F]" : "text-secondary";
  return (
    <div className={`card p-4 flex flex-col gap-2 ${highlight ? "ring-1 ring-[#FF671F]/20" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-secondary">{label}</p>
        {Icon && (
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${highlight ? "bg-[#FF671F]/8" : "bg-[#f0f1f3]"}`}>
            <Icon size={14} className={highlight ? "text-[#FF671F]" : "text-secondary"} />
          </div>
        )}
      </div>
      <p className={`text-2xl font-black tabular-nums leading-none ${highlight ? "text-[#FF671F]" : "text-primary"}`}>
        {value}
      </p>
      <p className={`text-xs font-medium ${subColor}`}>{sub}</p>
    </div>
  );
}

// ============================================================
// 즉시 조치 필요 섹션
// ============================================================

function UrgentSection({ onNavigate }: { onNavigate: (tab: PosTab) => void }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle size={15} className="text-[#FF671F]" />
          <span className="text-sm font-bold text-primary">즉시 조치 필요</span>
          <span className="text-[10px] font-bold bg-[#FF671F] text-white px-1.5 py-0.5 rounded-full">
            {urgentProductionCount}건
          </span>
        </div>
      </div>

      <div className="divide-y divide-border/50">
        {mockUrgentItems.map((item) => (
          <div key={item.name} className="accent-warning px-4 py-3.5 pl-5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-primary">{item.name}</p>
              <p className="text-xs text-secondary mt-0.5">{item.reason}</p>
            </div>
            <button
              onClick={() => onNavigate("inventory")}
              className="
                btn-shimmer
                shrink-0 h-8 px-3.5 flex items-center gap-1.5
                bg-primary text-white text-xs font-bold rounded-lg
                hover:bg-[#1a1a1a] active:bg-[#2a2a2a] active:scale-[0.97]
                focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1
                transition-all
              "
            >
              <Zap size={11} />
              생산 관리
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 퀵 네비 카드
// ============================================================

function QuickNavCard({
  Icon,
  label,
  sub,
  badge,
  onClick,
}: {
  Icon: React.FC<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
  sub: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        card card-hover p-4 text-left w-full
        focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1
        transition-all
      "
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="w-10 h-10 rounded-xl bg-[#f0f1f3] flex items-center justify-center">
          <Icon size={20} strokeWidth={1.6} className="text-primary" />
        </div>
        {badge && (
          <span className="text-[10px] font-bold bg-primary text-white px-1.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm font-bold text-primary">{label}</p>
      <div className="flex items-center gap-1 mt-0.5">
        <p className="text-xs text-secondary flex-1">{sub}</p>
        <ChevronRight size={12} className="text-tertiary shrink-0" />
      </div>
    </button>
  );
}

// ============================================================
// 홈 탭
// ============================================================

interface HomeTabProps {
  onNavigate: (tab: PosTab) => void;
}

export function HomeTab({ onNavigate }: HomeTabProps) {
  const today = new Date();
  const dateStr = `${today.getMonth() + 1}월 ${today.getDate()}일 (${["일","월","화","수","목","금","토"][today.getDay()]})`;

  return (
    <div className="p-6 space-y-5">
      {/* 데일리 브리핑 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-primary">오늘의 브리핑</h2>
          <span className="text-xs text-tertiary">{dateStr}</span>
        </div>

        <div className="card px-5 py-4 bg-[#f8f9fa]">
          <p className="text-sm text-secondary leading-relaxed">{mockHomeBriefing}</p>
        </div>
      </section>

      {/* 4개 메트릭 카드 */}
      <section className="grid grid-cols-4 gap-3">
        <MetricCard label="오늘 매출" value="₩125만" sub="+12.2% vs 전일" trendUp Icon={BarChart2} />
        <MetricCard
          label="기회손실 추정"
          value={`₩${(totalChanceLoss / 10000).toFixed(1)}만`}
          sub="즉시 개선 필요"
          highlight
          Icon={AlertTriangle}
        />
        <MetricCard label="폐기 비용" value="₩34K" sub="-8% vs 전일" trendDown Icon={TrendingDown} />
        <MetricCard label="즉시 조치" value={`${urgentProductionCount}건`} sub="생산 부족 품목" Icon={Zap} />
      </section>

      {/* 즉시 조치 필요 */}
      <UrgentSection onNavigate={onNavigate} />

      {/* 퀵 네비 */}
      <section>
        <p className="text-xs font-semibold text-tertiary mb-2.5 tracking-widest uppercase">바로 가기</p>
        <div className="grid grid-cols-3 gap-3">
          <QuickNavCard
            Icon={Package}
            label="생산 관리"
            sub="재고 역추정 기반"
            badge={urgentProductionCount > 0 ? `${urgentProductionCount}건` : undefined}
            onClick={() => onNavigate("inventory")}
          />
          <QuickNavCard
            Icon={Shield}
            label="발주 관리"
            sub="3단계 승인 플로우"
            badge="대기 중"
            onClick={() => onNavigate("order")}
          />
          <QuickNavCard
            Icon={BarChart2}
            label="매출 분석"
            sub="브리핑 보기"
            onClick={() => onNavigate("sales")}
          />
        </div>
      </section>
    </div>
  );
}
