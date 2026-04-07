import type {
  AgentInfo,
  UrgentAction,
  CurrentIssue,
  ProductionSummary,
  CategoryContribution,
  TrendingItem,
  TodayChecklistItem,
  HourlySalesPoint,
  BenchmarkData,
  CategoryProfitability,
  PromotionStrategy,
  OrderItem,
  AutoReport,
  DeliverySettlement,
  ReviewSummary,
  AlertRule,
  AgentTrustData,
  RecommendedAction,
} from "@/shared/types/insight";

// ============================================================
// AI Agent 3종 — 제이(생산) / 로이(발주) / 루나(매출·인사이트)
// ============================================================

export const mockAgents: AgentInfo[] = [
  {
    id: "A",
    name: "제이",
    role: "생산 담당",
    status: "active",
    lastActionAt: "2분 전",
    confidence: 91,
  },
  {
    id: "B",
    name: "로이",
    role: "발주 담당",
    status: "active",
    lastActionAt: "8분 전",
    confidence: 84,
  },
  {
    id: "C",
    name: "루나",
    role: "매출·인사이트",
    status: "active",
    lastActionAt: "1분 전",
    confidence: 88,
  },
];

// ============================================================
// 즉시 조치 필요 목록 — 30~60분 내 조치 요구
// ============================================================

export const mockUrgentActions: UrgentAction[] = [
  {
    id: "ua-1",
    title: "글레이즈드 재고 소진 임박",
    reason: "현재 재고 8개 — 35분 내 품절 예상. 매출 손실 ₩42,000 위험.",
    agentName: "제이",
    tab: "monitoring",
    dueMinutes: 35,
  },
  {
    id: "ua-2",
    title: "오후 피크 전 먼치킨 추가 생산 필요",
    reason: "13:00~15:00 피크 대비 현재 재고 15개 부족 예측. 지금 생산 시작해야 제때 공급 가능.",
    agentName: "제이",
    tab: "monitoring",
    dueMinutes: 48,
  },
  {
    id: "ua-3",
    title: "내일 발주 마감 30분 전",
    reason: "로이가 검토한 발주서 최종 확정 대기 중. 마감 놓치면 내일 아침 재고 부족.",
    agentName: "로이",
    tab: "order",
    dueMinutes: 30,
  },
];

// ============================================================
// 현재 발생 이슈 — 혼합 severity
// ============================================================

export const mockCurrentIssues: CurrentIssue[] = [
  {
    id: "ci-1",
    title: "글레이즈드 소진 위험",
    detail: "35분 내 품절 예정. 기회손실 ₩42,000 예상. 즉시 생산 착수 권장.",
    severity: "urgent",
    agentName: "제이",
    detectedAt: "14:12",
  },
  {
    id: "ci-2",
    title: "쿨라타 매출 전일 대비 -18%",
    detail: "오늘 쿨라타 판매량이 급감. 프로모션 종료 영향으로 분석됨. 대체 음료 전면 배치 검토 필요.",
    severity: "warning",
    agentName: "루나",
    detectedAt: "13:55",
  },
  {
    id: "ci-3",
    title: "오후 배달 주문 집중 예측",
    detail: "14:00~17:00 배달 주문 전일 대비 +22% 예상. 포장 소재 재고 확인 권장.",
    severity: "warning",
    agentName: "루나",
    detectedAt: "14:05",
  },
  {
    id: "ci-4",
    title: "보스턴크림 생산 일정 정상",
    detail: "현재 재고 22개, 소진까지 3시간 이상. 오후 피크 대응 충분.",
    severity: "info",
    agentName: "제이",
    detectedAt: "14:00",
  },
];

// ============================================================
// 생산 현황 요약 (Agent 제이) — 3개 품목
// ============================================================

export const mockProductionSummary: ProductionSummary[] = [
  {
    itemName: "글레이즈드",
    minutesUntilRunout: 35,
    chanceLoss: 42000,
    status: "urgent",
  },
  {
    itemName: "보스턴크림",
    minutesUntilRunout: 190,
    chanceLoss: 0,
    status: "normal",
  },
  {
    itemName: "먼치킨",
    minutesUntilRunout: 75,
    chanceLoss: 18000,
    status: "warning",
  },
];

// ============================================================
// 카테고리별 매출 기여도 (Agent 루나) — 5개 카테고리
// ============================================================

export const mockCategoryContribution: CategoryContribution[] = [
  {
    category: "도넛",
    revenueShare: 42,
    quantity: 312,
    margin: 68,
    deliveryShare: 34,
    storeShare: 66,
  },
  {
    category: "음료",
    revenueShare: 28,
    quantity: 187,
    margin: 72,
    deliveryShare: 41,
    storeShare: 59,
  },
  {
    category: "쿨라타",
    revenueShare: 14,
    quantity: 98,
    margin: 61,
    deliveryShare: 55,
    storeShare: 45,
  },
  {
    category: "베이글",
    revenueShare: 10,
    quantity: 64,
    margin: 55,
    deliveryShare: 28,
    storeShare: 72,
  },
  {
    category: "머핀",
    revenueShare: 6,
    quantity: 41,
    margin: 58,
    deliveryShare: 22,
    storeShare: 78,
  },
];

// ============================================================
// KPI 단일값 — 오늘 기준
// ============================================================

/** 오늘 매출 (원) */
export const mockTodaySales = 1250000;
/** AI 실매출 — 인건비·재료비·배달 수수료 제외 순이익 추정 */
export const mockAiNetSales = 780000;

/** 기회손실 추정 (원) */
export const mockOpportunityLoss = 187000;

/** 폐기 비용 (원) */
export const mockWasteCost = 34000;

/** 즉시 조치 건수 */
export const mockUrgentCount = 3;

// ============================================================
// AI 브리핑 텍스트 (Agent 루나)
// ============================================================

export const mockBriefingText =
  "오늘 오전 매출이 어제보다 12.2% 상승했어요. 글레이즈드가 30분 안에 품절될 수 있어요 — 지금 생산 시작하면 피크 시간 전에 딱 맞게 공급 가능해요. 쿨라타 판매가 전일 대비 18% 줄었는데, 프로모션 종료 영향으로 보여요. 오후 배달 주문이 집중될 예정이니 포장 소재 재고도 한번 확인해 두세요.";

/** 인기상품 상승 감지 목록 */
export const mockTrendingItems: TrendingItem[] = [
  { itemName: "먼치킨", salesGrowth: 34, minutesUntilRunout: 75 },
  { itemName: "아이스 아메리카노", salesGrowth: 22, minutesUntilRunout: 120 },
];

/** 오늘의 핵심 체크리스트 — 루나가 트렌딩 + 이슈 기반 생성 */
export const mockTodayChecklist: TodayChecklistItem[] = [
  {
    id: "tc-1",
    task: "글레이즈드 즉시 생산 착수",
    reason: "35분 내 품절 예정 — ₩42,000 기회손실 방지",
    category: "production",
    done: false,
  },
  {
    id: "tc-2",
    task: "로이 발주서 최종 확인",
    reason: "마감 30분 전 — 놓치면 내일 재고 부족",
    category: "order",
    done: false,
  },
  {
    id: "tc-3",
    task: "먼치킨 입구 쪽 전면 배치",
    reason: "오늘 +34% 인기 급등 — 충동 구매 전환 극대화",
    category: "sales",
    done: false,
  },
  {
    id: "tc-4",
    task: "포장 소재 재고 확인",
    reason: "오후 배달 주문 +22% 예측 — 소재 부족 시 지연 발생",
    category: "operation",
    done: false,
  },
];

/** 시간대별 매출 + 피크 감지 */
export const mockHourlySales: HourlySalesPoint[] = [
  { hour: 8,  sales: 85000,  isPeak: false, footfallChange: +5  },
  { hour: 9,  sales: 142000, isPeak: false, footfallChange: +8  },
  { hour: 10, sales: 98000,  isPeak: false, footfallChange: -3  },
  { hour: 11, sales: 165000, isPeak: true,  footfallChange: +15 },
  { hour: 12, sales: 248000, isPeak: true,  footfallChange: +28 },
  { hour: 13, sales: 187000, isPeak: true,  footfallChange: +18 },
  { hour: 14, sales: 134000, isPeak: false, footfallChange: +4  },
  { hour: 15, sales: 156000, isPeak: true,  footfallChange: +12 },
  { hour: 16, sales: 112000, isPeak: false, footfallChange: -6  },
  { hour: 17, sales: 178000, isPeak: true,  footfallChange: +21 },
  { hour: 18, sales: 145000, isPeak: false, footfallChange: +9  },
  { hour: 19, sales: 88000,  isPeak: false, footfallChange: -2  },
];

/** 벤치마킹 데이터 — 타 가맹점 비교 */
export const mockBenchmarkData: BenchmarkData[] = [
  { metric: "일 평균 매출",    myValue: 1250000, topTenAvg: 1820000, regionAvg: 1100000, unit: "원" },
  { metric: "기회손실율",      myValue: 14.9,    topTenAvg: 6.2,     regionAvg: 12.4,    unit: "%" },
  { metric: "배달 매출 비중",  myValue: 38,      topTenAvg: 47,      regionAvg: 35,      unit: "%" },
  { metric: "폐기율",          myValue: 2.7,     topTenAvg: 1.4,     regionAvg: 2.9,     unit: "%" },
  { metric: "피크 전환율",     myValue: 61,      topTenAvg: 78,      regionAvg: 63,      unit: "%" },
];

/** 카테고리별 수익성 분석 */
export const mockCategoryProfitability: CategoryProfitability[] = [
  { category: "도넛",   revenue: 525000, cost: 168000, margin: 68, unitMargin: 1120, topItem: "글레이즈드",      topItemMargin: 72 },
  { category: "음료",   revenue: 350000, cost: 98000,  margin: 72, unitMargin: 870,  topItem: "아이스 아메리카노", topItemMargin: 78 },
  { category: "쿨라타", revenue: 175000, cost: 68250,  margin: 61, unitMargin: 1050, topItem: "딸기 쿨라타",      topItemMargin: 64 },
  { category: "베이글", revenue: 125000, cost: 56250,  margin: 55, unitMargin: 950,  topItem: "플레인 베이글",     topItemMargin: 58 },
  { category: "머핀",   revenue: 75000,  cost: 31500,  margin: 58, unitMargin: 680,  topItem: "초코 머핀",         topItemMargin: 61 },
];

/** 프로모션 전략 추천 — 루나 생성 */
export const mockPromotionStrategies: PromotionStrategy[] = [
  {
    id: "ps-1",
    title: "먼치킨 세트 할인",
    targetItem: "먼치킨",
    expectedRevenueLift: 18,
    cost: 45000,
    roi: 312,
    reason: "오늘 판매 급등 + 피크 타임 충동 구매 패턴 포착. 10개입 세트 10% 할인 시 객단가 ↑.",
  },
  {
    id: "ps-2",
    title: "오후 배달 쿨라타 번들",
    targetItem: "쿨라타",
    expectedRevenueLift: 22,
    cost: 32000,
    roi: 428,
    reason: "쿨라타 매출 -18% 만회. 배달 피크 14~17시 도넛+쿨라타 묶음 할인으로 전환율 회복.",
  },
];

/** 알림 규칙 목록 */
export const mockAlertRules: AlertRule[] = [
  {
    id: "al-1",
    title: "재고 소진 임박 알림",
    description: "품목 소진 예상 시간이 N분 이내일 때 알림",
    category: "production",
    enabled: true,
    threshold: 60,
    thresholdUnit: "분",
  },
  {
    id: "al-2",
    title: "기회손실 임계치 초과",
    description: "기회손실 추정 비용이 N만원 초과 시 알림",
    category: "production",
    enabled: true,
    threshold: 10,
    thresholdUnit: "만원",
  },
  {
    id: "al-3",
    title: "발주 마감 임박 알림",
    description: "발주 마감 N분 전 자동 알림",
    category: "order",
    enabled: true,
    threshold: 30,
    thresholdUnit: "분",
  },
  {
    id: "al-4",
    title: "매출 급락 감지",
    description: "전일 동시간 대비 매출이 N% 이상 감소 시 알림",
    category: "sales",
    enabled: true,
    threshold: 20,
    thresholdUnit: "%",
  },
  {
    id: "al-5",
    title: "인기상품 급등 감지",
    description: "특정 품목 판매가 전일 대비 N% 이상 급등 시 알림",
    category: "sales",
    enabled: true,
    threshold: 25,
    thresholdUnit: "%",
  },
  {
    id: "al-6",
    title: "POS 연결 끊김 알림",
    description: "POS 단말기 연결이 N분 이상 끊길 시 즉시 알림",
    category: "system",
    enabled: true,
    threshold: 5,
    thresholdUnit: "분",
  },
  {
    id: "al-7",
    title: "배달앱 연동 오류 알림",
    description: "배달앱 연동 상태 이상 감지 시 즉시 알림",
    category: "system",
    enabled: false,
    threshold: undefined,
    thresholdUnit: undefined,
  },
  {
    id: "al-8",
    title: "부정 리뷰 실시간 알림",
    description: "별점 2점 이하 리뷰 등록 시 즉시 알림",
    category: "sales",
    enabled: false,
    threshold: undefined,
    thresholdUnit: undefined,
  },
];

// ============================================================
// 발주 목록 — 로이 검토 기반
// ============================================================

export const mockOrderItems: OrderItem[] = [
  {
    id: "oi-1",
    itemName: "글레이즈드 도넛 믹스",
    category: "도넛",
    roiRecommendedQty: 15,
    hqQty: 12,
    finalQty: 15,
    unitPrice: 8500,
    status: "reviewing",
    roiReason: "주말 피크 + 현재 재고 소진 임박. 12박스론 월요일 오전 재고 부족 예상.",
  },
  {
    id: "oi-2",
    itemName: "먼치킨 믹스",
    category: "도넛",
    roiRecommendedQty: 20,
    hqQty: 18,
    finalQty: 20,
    unitPrice: 6200,
    status: "confirmed",
    roiReason: "이번 주 +34% 판매 급등. 트렌딩 유지 대비 추가 2박스 확보 권장.",
  },
  {
    id: "oi-3",
    itemName: "아이스 아메리카노 원두",
    category: "음료",
    roiRecommendedQty: 8,
    hqQty: 8,
    finalQty: 8,
    unitPrice: 22000,
    status: "confirmed",
    roiReason: "본사 지시량 적정. 현재 재고 + 발주량으로 2주 충분.",
  },
  {
    id: "oi-4",
    itemName: "쿨라타 베이스",
    category: "음료",
    roiRecommendedQty: 6,
    hqQty: 10,
    finalQty: 6,
    unitPrice: 15000,
    status: "pending",
    roiReason: "쿨라타 매출 -18% 감소 중. 본사 지시 10박스 과잉. 6박스로 하향 권장.",
  },
  {
    id: "oi-5",
    itemName: "베이글 반죽",
    category: "베이글",
    roiRecommendedQty: 5,
    hqQty: 5,
    finalQty: 5,
    unitPrice: 12000,
    status: "sent",
    roiReason: "적정 수준. 발주 완료.",
  },
];

// ============================================================
// 자동 생성 리포트 목록
// ============================================================

export const mockAutoReports: AutoReport[] = [
  {
    id: "ar-1",
    title: "4월 1주차 운영 리포트",
    generatedAt: "2026-04-07 06:00",
    type: "weekly",
    summary: "이번 주 매출 ₩8.75M (+9.2% vs 전주). 기회손실 총 ₩1.31M. 먼치킨 판매 급등 주목. 쿨라타 매출 회복 전략 필요.",
  },
  {
    id: "ar-2",
    title: "2026년 3월 월간 리포트",
    generatedAt: "2026-04-01 06:00",
    type: "monthly",
    summary: "3월 총 매출 ₩37.2M. 전월 대비 +5.8%. 배달 채널 비중 38% → 41%로 성장. 폐기율 2.7%로 업계 평균 하회.",
  },
  {
    id: "ar-3",
    title: "2026-04-07 일일 리포트",
    generatedAt: "2026-04-07 23:59",
    type: "daily",
    summary: "오늘 매출 ₩1.25M (+12.2%). 기회손실 ₩187K. 즉시 조치 3건 중 2건 완료.",
  },
];

// ============================================================
// 배달 플랫폼 정산 현황
// ============================================================

export const mockDeliverySettlements: DeliverySettlement[] = [
  { platform: "배달의민족", revenue: 485000, commission: 63050, commissionRate: 13, netRevenue: 421950 },
  { platform: "쿠팡이츠",   revenue: 312000, commission: 46800, commissionRate: 15, netRevenue: 265200 },
  { platform: "요기요",     revenue: 128000, commission: 17920, commissionRate: 14, netRevenue: 110080 },
];

// ============================================================
// 리뷰 모니터링 요약
// ============================================================

export const mockReviewSummary: ReviewSummary[] = [
  { platform: "배달의민족", avgRating: 4.8, totalCount: 312, recentPositive: 28, recentNegative: 2,  topKeyword: "신선해요" },
  { platform: "쿠팡이츠",   avgRating: 4.6, totalCount: 187, recentPositive: 19, recentNegative: 4,  topKeyword: "빠른배달" },
  { platform: "구글",       avgRating: 4.3, totalCount: 94,  recentPositive: 11, recentNegative: 3,  topKeyword: "친절해요" },
];

// ============================================================
// AI 신뢰도 패널 — Agent별 판단 근거 + 학습 기반 데이터
// 점주 신뢰도 향상을 위한 Explainable AI 핵심 데이터
// ============================================================

export const mockAgentTrustData: AgentTrustData[] = [
  {
    agentName: "제이",
    role: "생산 담당",
    confidence: 91,
    trainedDays: 37,
    accuracy: 89,
    evidences: [
      {
        type: "data",
        label: "판매 데이터",
        description: "최근 30일 시간대별 글레이즈드·먼치킨 판매량 분석",
      },
      {
        type: "pattern",
        label: "소진 패턴",
        description: "월~금 오전 11시~오후 1시 집중 소진 반복 패턴 확인",
      },
      {
        type: "external",
        label: "유동 인구",
        description: "강남역 유동 인구 데이터 — 오늘 오후 피크 예상 +12%",
      },
    ],
  },
  {
    agentName: "로이",
    role: "발주 담당",
    confidence: 84,
    trainedDays: 37,
    accuracy: 82,
    evidences: [
      {
        type: "data",
        label: "재고 이력",
        description: "최근 6주 발주량 대비 실소진량 비교 분석",
      },
      {
        type: "pattern",
        label: "주말 수요",
        description: "금~일요일 도넛류 수요 평균 +28% 증가 패턴",
      },
      {
        type: "external",
        label: "본사 지침",
        description: "본사 권장량 ± 20% 이내 조정 원칙 적용",
      },
    ],
  },
  {
    agentName: "루나",
    role: "매출·인사이트",
    confidence: 88,
    trainedDays: 37,
    accuracy: 84,
    evidences: [
      {
        type: "data",
        label: "매출 분석",
        description: "오늘 카테고리별 매출 vs 최근 4주 동일 요일 평균 비교",
      },
      {
        type: "pattern",
        label: "피크 감지",
        description: "오전 10~11시, 오후 3~4시 피크 타임 반복 확인",
      },
      {
        type: "external",
        label: "날씨 연동",
        description: "기상청 API — 오늘 오후 맑음, 기온 22°C (아이스 수요 ↑)",
      },
    ],
  },
];

// ============================================================
// 즉시 추천 액션 — AI 신뢰도 패널 하단 (루나·제이·로이 합작)
// ============================================================

export const mockRecommendedActions: RecommendedAction[] = [
  {
    id: "ra-1",
    agentName: "제이",
    title: "글레이즈드 즉시 추가 생산",
    description: "35분 내 품절 예상. 지금 생산 시작하면 점심 피크 대응 가능.",
    expectedLift: 8,
    tab: "monitoring",
  },
  {
    id: "ra-2",
    agentName: "루나",
    title: "오후 아이스 음료 프로모션 재노출",
    description: "날씨 22°C + 오후 피크 겹침. 배달 앱 배너 우선순위 조정 권장.",
    expectedLift: 6,
    tab: "actions",
  },
  {
    id: "ra-3",
    agentName: "로이",
    title: "먼치킨 발주서 최종 확정",
    description: "트렌딩 +34% 지속. 확정 마감 2시간 내. 지금 승인 필요.",
    expectedLift: 5,
    tab: "order",
  },
];
