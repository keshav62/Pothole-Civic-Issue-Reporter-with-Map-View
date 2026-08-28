export const MOCK_NOTIFICATIONS = [
  {
    id: "NOTIF-101",
    title: "New Task Assigned: CC-1024",
    message: "Large pothole near Sector 15 school gate assigned to you.",
    type: "ASSIGNMENT", // ASSIGNMENT, SLA_WARNING, APPROVAL, SYSTEM
    role: "FIELD_WORKER",
    userId: "USR-004",
    time: "10 mins ago",
    read: false,
    link: "/worker/tasks/CC-1024"
  },
  {
    id: "NOTIF-102",
    title: "SLA Warning: CC-1042",
    message: "Issue CC-1042 (Broken streetlight) has 1 hour remaining before SLA breach.",
    type: "SLA_WARNING",
    role: "DEPARTMENT_ADMIN",
    department: "Electrical",
    time: "25 mins ago",
    read: false,
    link: "/department/issues"
  },
  {
    id: "NOTIF-103",
    title: "Task CC-1018 Completed",
    message: "Worker Vikas Singh completed task CC-1018 (Garbage pileup) with evidence.",
    type: "APPROVAL",
    role: "SUPER_ADMIN",
    time: "1 hour ago",
    read: true,
    link: "/admin/issues/CC-1018"
  },
  {
    id: "NOTIF-104",
    title: "Critical Escalation: CC-1025",
    message: "Water pipe breach in Sector 8 has exceeded 12h SLA limit.",
    type: "SLA_WARNING",
    role: "SUPER_ADMIN",
    time: "2 hours ago",
    read: false,
    link: "/admin/escalations"
  },
  {
    id: "NOTIF-105",
    title: "Task CC-1054 Marked Resolved",
    message: "Amit Kumar uploaded resolution proof for fallen tree on MG Marg.",
    type: "APPROVAL",
    role: "DEPARTMENT_ADMIN",
    department: "Road Maintenance",
    time: "3 hours ago",
    read: true,
    link: "/department/issues"
  }
];
