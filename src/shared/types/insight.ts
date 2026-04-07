/** Insight Console 전용 타입 정의 */

/** Insight Console 탭 목록 */
export type InsightTab =
  | "dashboard"
  | "monitoring"
  | "analytics"
  | "actions"
  | "report"
  | "order"
  | "issues"
  | "alerts";

/** AI Agent 상태 */
export type AgentStatus = "active" | "idle" | "error";

/** AI Agent 정보 */
export interface AgentInfo {
  id: "A" | "B" | "C";
  name: "제이" | "로이" | "루나";
  /** "생산 담당" | "발주 담당" | "매출·인사이트" */
  role: string;
  status: AgentStatus;
  lastActionAt: string;
  /** 확신도 0-100 */
  confidence: number;
}

/** 즉시 조치 필요 항목 */
export interface UrgentAction {
  id: string;
  title: string;
  reason: string;
  agentName: string;
  tab: InsightTab;
  /** 몇 분 내 조치 필요 */
  dueMinutes: number;
}

/** 현재 발생 이슈 */
export interface CurrentIssue {
  id: string;
  title: string;
  detail: string;
  severity: "urgent" | "warning" | "info";
  agentName: string;
  detectedAt: string;
}

/** 생산 현황 요약 (Agent 제이) */
export interface ProductionSummary {
  itemName: string;
  minutesUntilRunout: number;
  /** 기회손실 추정 (원) */
  chanceLoss: number;
  status: "urgent" | "warning" | "normal";
}

/** 카테고리별 매출 기여도 (Agent 루나) */
export interface CategoryContribution {
  category: string;
  /** 매출 기여 % */
  revenueShare: number;
  /** 판매 수량 */
  quantity: number;
  /** 마진 % */
  margin: number;
  /** 배달 비중 % */
  deliveryShare: number;
  /** 매장 비중 % */
  storeShare: number;
}

/** 인기상품 상승 감지 — Agent 루나 */
export interface TrendingItem {
  itemName: string;
  /** 전일 대비 판매량 상승 % */
  salesGrowth: number;
  /** 현재 재고 (분 기준 소진 예상) */
  minutesUntilRunout: number;
}

/** 오늘의 핵심 체크리스트 항목 — Agent 루나가 트렌딩/이슈 기반으로 생성 */
export interface TodayChecklistItem {
  id: string;
  task: string;
  reason: string;
  /** "production" | "order" | "sales" | "operation" */
  category: "production" | "order" | "sales" | "operation";
  done: boolean;
}

/** 시간대별 매출 + 피크 감지 */
export interface HourlySalesPoint {
  hour: number; // 0-23
  sales: number; // 원
  isPeak: boolean;
  /** 유동 인구 변화 % (전주 동시간 대비) */
  footfallChange: number;
}

/** 벤치마킹 데이터 — 타 가맹점 비교 */
export interface BenchmarkData {
  metric: string;
  myValue: number;
  topTenAvg: number; // 상위 10% 가맹점 평균
  regionAvg: number; // 같은 상권 평균
  unit: string; // "원" | "%" | "개"
}

/** 카테고리별 수익성 분석 */
export interface CategoryProfitability {
  category: string;
  revenue: number;       // 매출액 (원)
  cost: number;          // 원가 (원)
  margin: number;        // 마진율 %
  unitMargin: number;    // 개당 마진 (원)
  topItem: string;       // 대표 상품명
  topItemMargin: number; // 대표 상품 마진 %
}

/** 프로모션 전략 추천 */
export interface PromotionStrategy {
  id: string;
  title: string;
  targetItem: string;
  expectedRevenueLift: number; // 예상 매출 증가 %
  cost: number;                // 프로모션 비용 (원)
  roi: number;                 // 예상 ROI %
  reason: string;
}

/** 발주 항목 */
export interface OrderItem {
  id: string;
  itemName: string;
  category: string;
  roiRecommendedQty: number;   // 로이 추천 수량
  hqQty: number;               // 본사 지시 수량
  finalQty: number;            // 최종 확정 수량
  unitPrice: number;           // 단가 (원)
  status: "pending" | "reviewing" | "confirmed" | "sent";
  roiReason: string;           // 로이 추천 근거
}

/** 자동 생성 리포트 */
export interface AutoReport {
  id: string;
  title: string;
  generatedAt: string;
  type: "daily" | "weekly" | "monthly";
  summary: string;
}

/** 배달 플랫폼 정산 */
export interface DeliverySettlement {
  platform: string;
  revenue: number;
  commission: number;
  commissionRate: number;
  netRevenue: number;
}

/** 리뷰 모니터링 요약 */
export interface ReviewSummary {
  platform: string;
  avgRating: number;
  totalCount: number;
  recentPositive: number;
  recentNegative: number;
  topKeyword: string;
}

/** AI 신뢰도 패널 — 판단 근거 항목 */
export interface TrustEvidence {
  /** 근거 유형 */
  type: "data" | "pattern" | "external";
  label: string;
  description: string;
}

/** AI 신뢰도 패널 — Agent별 신뢰도 정보 */
export interface AgentTrustData {
  agentName: "제이" | "로이" | "루나";
  role: string;
  /** 확신도 0-100 */
  confidence: number;
  /** 학습 데이터 일수 */
  trainedDays: number;
  /** 유사 상황 정확도 0-100 */
  accuracy: number;
  /** 판단 근거 목록 */
  evidences: TrustEvidence[];
}

/** 즉시 추천 액션 (AI 신뢰도 패널 하단) */
export interface RecommendedAction {
  id: string;
  agentName: "제이" | "로이" | "루나";
  title: string;
  description: string;
  /** 예상 효과 % */
  expectedLift: number;
  tab: InsightTab;
}

/** 알림 규칙 */
export interface AlertRule {
  id: string;
  title: string;
  description: string;
  category: "production" | "order" | "sales" | "system";
  enabled: boolean;
  /** 임계치 값 (선택적) */
  threshold?: number;
  /** 임계치 단위 */
  thresholdUnit?: string;
}
