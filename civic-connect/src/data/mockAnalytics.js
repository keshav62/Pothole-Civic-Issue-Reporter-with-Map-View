export const MOCK_ANALYTICS_DATA = {
  kpis: {
    totalIssues: "12,540",
    totalChange: "+8.4%",
    pending: "2,340",
    pendingChange: "-4.2%",
    inProgress: "1,120",
    inProgressChange: "+12.1%",
    resolved: "9,080",
    resolvedChange: "+15.3%",
    critical: "84",
    criticalChange: "-2.1%",
    avgResolutionTime: "2.4 days",
    avgResolutionChange: "-0.5 days"
  },
  issuesOverTime: [
    { date: "Aug 22", reported: 410, resolved: 380, pending: 120 },
    { date: "Aug 23", reported: 450, resolved: 410, pending: 140 },
    { date: "Aug 24", reported: 520, resolved: 490, pending: 110 },
    { date: "Aug 25", reported: 480, resolved: 460, pending: 130 },
    { date: "Aug 26", reported: 610, resolved: 540, pending: 180 },
    { date: "Aug 27", reported: 590, resolved: 580, pending: 150 },
    { date: "Aug 28", reported: 640, resolved: 610, pending: 170 }
  ],
  categoryBreakdown: [
    { name: "Pothole / Roads", count: 4320, percentage: 34.4, color: "#3B82F6" },
    { name: "Sanitation & Garbage", count: 3150, percentage: 25.1, color: "#10B981" },
    { name: "Water Supply & Leakage", count: 1890, percentage: 15.1, color: "#06B6D4" },
    { name: "Electrical & Lights", count: 1420, percentage: 11.3, color: "#F59E0B" },
    { name: "Drainage & Flooding", count: 980, percentage: 7.8, color: "#6366F1" },
    { name: "Parks & Infrastructure", count: 780, percentage: 6.3, color: "#14B8A6" }
  ],
  statusDistribution: [
    { name: "Resolved", value: 9080, color: "#10B981" },
    { name: "Pending / Verified", value: 2340, color: "#F59E0B" },
    { name: "In Progress", value: 1120, color: "#3B82F6" },
    { name: "Critical / Breached", value: 84, color: "#EF4444" }
  ],
  wardPerformance: [
    { ward: "Ward 15", total: 1840, resolved: 1490, rate: 81, avgHours: 32 },
    { ward: "Ward 8", total: 1520, resolved: 1280, rate: 84, avgHours: 28 },
    { ward: "Ward 12", total: 1390, resolved: 1250, rate: 90, avgHours: 22 },
    { ward: "Ward 4", total: 1150, resolved: 980, rate: 85, avgHours: 26 },
    { ward: "Ward 22", total: 980, resolved: 910, rate: 93, avgHours: 19 }
  ],
  slaComplianceByDepartment: [
    { department: "Road Maintenance", sla: 91, target: 95 },
    { department: "Sanitation", sla: 95, target: 95 },
    { department: "Electrical", sla: 88, target: 90 },
    { department: "Water Supply", sla: 89, target: 92 },
    { department: "Drainage", sla: 92, target: 90 },
    { department: "Parks", sla: 96, target: 90 },
    { department: "Traffic", sla: 93, target: 95 }
  ],
  topProblemAreas: [
    { ward: "Ward 15", issuesCount: 423, primaryCategory: "Pothole / Roads", status: "HIGH_RISK" },
    { ward: "Ward 8", issuesCount: 312, primaryCategory: "Water Supply", status: "MODERATE_RISK" },
    { ward: "Ward 12", issuesCount: 287, primaryCategory: "Sanitation", status: "ATTENTION_NEEDED" },
    { ward: "Ward 4", issuesCount: 210, primaryCategory: "Drainage", status: "STABLE" },
    { ward: "Ward 22", issuesCount: 175, primaryCategory: "Parks", status: "LOW_RISK" }
  ]
};
