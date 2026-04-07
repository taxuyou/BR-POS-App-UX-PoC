"use client";

import { Warning, CaretRight, Package, Shield, ChartBar, TrendDown, Lightning, Sparkle } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import {
  mockHomeBriefing,
  mockUrgentItems,
  totalChanceLoss,
  urgentProductionCount,
} from "@/entities/mock/pos-data";
import type { PosTab } from "@/shared/types/pos";

function MetricCard({
  label, value, sub, trendUp, trendDown, highlight, Icon: CardIcon,
}: {
  label: string; value: string; sub: string;
  trendUp?: boolean; trendDown?: boolean; highlight?: boolean;
  Icon?: Icon;
}) {
  const subColor = (trendUp || trendDown) ? "text-success" : highlight ? "text-[#FF671F]" : "text-secondary";
  return (
    <div className={`card p-4 flex flex-col gap-2 ${highlight ? "ring-1 ring-[#FF671F]/20" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-secondary">{label}</p>
        {CardIcon && (
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${highlight ? "bg-[#FF671F]/8" : "bg-[#f0f1f3]"}`}>
            <CardIcon size={15} weight="regular" className={highlight ? "text-[#FF671F]" : "text-secondary"} />
          </div>
        )}
      </div>
      <p className={`text-2xl font-black tabular-nums leading-none ${highlight ? "text-[#FF671F]" : "text-primary"}`}>{value}</p>
      <p className={`text-xs font-medium ${subColor}`}>{sub}</p>
    </div>
  );
}

function UrgentSection({ onNavigate }: { onNavigate: (tab: PosTab) => void }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Warning size={16} weight="fill" className="text-[#FF671F]" />
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
                btn-shimmer shrink-0 h-8 px-3.5 flex items-center gap-1.5
                bg-primary text-white text-xs font-bold rounded-lg
                hover:bg-[#1a1a1a] active:bg-[#2a2a2a] active:scale-[0.97]
                focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1
                transition-all
              "
            >
              <Lightning size={12} weight="fill" />
              생산 관리
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickNavCard({
  Icon: NavIcon, label, sub, badge, onClick,
}: {
  Icon: Icon; label: string; sub: string; badge?: string; onClick: () => void;
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
          <NavIcon size={20} weight="regular" className="text-primary" />
        </div>
        {badge && (
          <span className="text-[10px] font-bold bg-primary text-white px-1.5 py-0.5 rounded-full">{badge}</span>
        )}
      </div>
      <p className="text-sm font-bold text-primary">{label}</p>
      <div className="flex items-center gap-1 mt-0.5">
        <p className="text-xs text-secondary flex-1">{sub}</p>
        <CaretRight size={12} weight="regular" className="text-tertiary shrink-0" />
      </div>
    </button>
  );
}

interface HomeTabProps { onNavigate: (tab: PosTab) => void; }

export function HomeTab({ onNavigate }: HomeTabProps) {
  const today = new Date();
  const dateStr = `${today.getMonth() + 1}월 ${today.getDate()}일 (${["일","월","화","수","목","금","토"][today.getDay()]})`;

  return (
    <div className="p-6 space-y-6">
      {/* 응답형 메인 그리드 2:1 */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* 좌측 영역 (2/3): 오늘의 브리핑 및 조치 사항 */}
        <div className="col-span-2 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-primary">오늘의 브리핑</h2>
              <span className="text-xs text-tertiary">{dateStr}</span>
            </div>
            <div className="card px-5 py-4 bg-white border-none shadow-sm">
              <p className="text-sm text-secondary leading-relaxed font-medium">
                {mockHomeBriefing}
              </p>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3">
            <MetricCard label="오늘 매출" value="₩125만" sub="+12.2% vs 전일" trendUp Icon={ChartBar} />
            <MetricCard label="기회손실 추정" value={`₩${(totalChanceLoss / 10000).toFixed(1)}만`} sub="즉시 개선 필요" highlight Icon={Warning} />
          </section>

          <UrgentSection onNavigate={onNavigate} />
        </div>

        {/* 우측 영역 (1/3): 추천 액션 및 바로 가기 */}
        <div className="col-span-1 space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Sparkle size={16} weight="fill" className="text-primary" />
              <h2 className="text-base font-bold text-primary">추천 액션</h2>
            </div>
            <div className="space-y-3">
              <QuickNavCard 
                Icon={Package} 
                label="내일 생산 계획 수립" 
                sub="매출 예측 기반 권장"
                badge="추천"
                onClick={() => onNavigate("inventory")} 
              />
              <QuickNavCard 
                Icon={Shield} 
                label="부족 자재 선발주" 
                sub="우유, 파우더 외 3건" 
                badge="긴급" 
                onClick={() => onNavigate("order")} 
              />
              <QuickNavCard 
                Icon={ChartBar} 
                label="주간 매출 리포트 확인" 
                sub="일요일 대비 분석" 
                onClick={() => onNavigate("sales")} 
              />
            </div>
          </section>

          <section className="card p-5 bg-primary text-white overflow-hidden relative group cursor-pointer active:scale-[0.98] transition-all">
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-white/60 mb-1 tracking-wider">AI INSIGHT</p>
              <p className="text-sm font-bold leading-snug">
                오후 2시경 아이스 아메리카노 <br/>
                판매량이 급증할 것으로 예상됩니다.
              </p>
              <div className="mt-4 flex items-center gap-1 text-[10px] font-bold">
                상세 분석 보기 <CaretRight size={10} weight="bold" />
              </div>
            </div>
            <Sparkle 
              size={120} 
              weight="fill" 
              className="absolute -right-8 -bottom-8 text-white/5 group-hover:rotate-12 transition-transform duration-500" 
            />
          </section>
        </div>
      </div>
    </div>
  );
}
