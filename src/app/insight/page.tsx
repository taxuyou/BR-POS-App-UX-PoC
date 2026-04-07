"use client";

/**
 * Insight Console 메인 페이지
 * - 점주 관리 > Insight Console 진입점
 * - 탭 상태 관리 후 InsightLayout + 탭 컴포넌트에 위임
 */

import { useState } from "react";
import { InsightLayout } from "./_components/InsightLayout";
import { DashboardTab } from "./_components/tabs/DashboardTab";
import { ActionsTab } from "./_components/tabs/ActionsTab";
import { IssuesTab } from "./_components/tabs/IssuesTab";
import { AnalyticsTab } from "./_components/tabs/AnalyticsTab";
import { MonitoringTab } from "./_components/tabs/MonitoringTab";
import { AlertsTab } from "./_components/tabs/AlertsTab";
import { OrderTab } from "./_components/tabs/OrderTab";
import { ReportTab } from "./_components/tabs/ReportTab";
import type { InsightTab } from "@/shared/types/insight";

export default function InsightPage() {
  const [activeTab, setActiveTab] = useState<InsightTab>("dashboard");

  return (
    <InsightLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "dashboard"  && <DashboardTab onNavigate={setActiveTab} />}
      {activeTab === "monitoring" && <MonitoringTab />}
      {activeTab === "analytics"  && <AnalyticsTab />}
      {activeTab === "actions"    && <ActionsTab />}
      {activeTab === "issues"     && <IssuesTab />}
      {activeTab === "alerts"     && <AlertsTab />}
      {activeTab === "order"      && <OrderTab />}
      {activeTab === "report"     && <ReportTab />}
    </InsightLayout>
  );
}
