// ─────────────────────────────────────────────────────────────────────────────
// workerMockData.js  –  All mock data for the Field Worker module
// ─────────────────────────────────────────────────────────────────────────────

// Current logged-in worker
export const currentWorker = {
  id: "FW-101",
  name: "Rajesh Kumar",
  firstName: "Rajesh",
  role: "Field Worker",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
  department: "Road Maintenance",
  assignedWard: "Ward A – Sector 15",
  email: "rajesh.worker@civicconnect.in",
  phone: "+91 98765 43210",
  employeeId: "EMP-2347",
  joinedDate: "2024-03-15",
  completedAllTime: 82,
  rating: 4.7,
};

// ─── Category metadata ────────────────────────────────────────────────────────
export const CATEGORY_META = {
  Potholes:     { icon: "🕳️",  color: "red"    },
  Garbage:      { icon: "🗑️",  color: "orange" },
  Streetlights: { icon: "💡",  color: "yellow" },
  Waterlogging: { icon: "🌊",  color: "blue"   },
  Traffic:      { icon: "🚦",  color: "purple" },
  Drainage:     { icon: "🚿",  color: "teal"   },
  RoadDamage:   { icon: "🛣️",  color: "slate"  },
};

// ─── Priority metadata ────────────────────────────────────────────────────────
export const PRIORITY_META = {
  High:   { label: "High",   dot: "#ef4444", badge: "bg-red-100 text-red-700 border-red-200"       },
  Medium: { label: "Medium", dot: "#f59e0b", badge: "bg-amber-100 text-amber-700 border-amber-200" },
  Low:    { label: "Low",    dot: "#60a5fa", badge: "bg-blue-100 text-blue-700 border-blue-200"    },
};

// ─── Tasks assigned to this worker ───────────────────────────────────────────
export const workerTasks = [
  {
    id: "ISS-1021",
    title: "Large Pothole on Main St",
    category: "Potholes",
    description: "Massive pothole in the middle lane near the central library causing traffic slowdowns and risk to two-wheelers.",
    location: { address: "123 Main St, Sector 15", ward: "Ward A", lat: 40.7128, lng: -74.0060, mapX: 42, mapY: 35 },
    status: "in-progress",
    priority: "High",
    assignedAt: "2026-08-25T10:30:00Z",
    dueDate:    "2026-08-29T17:00:00Z",
    updatedAt:  "2026-08-28T14:15:00Z",
    images: { before: ["https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800"], after: [] },
    reportedBy: "John D.",
  },
  {
    id: "ISS-1025",
    title: "Overflowing Garbage Bin",
    category: "Garbage",
    description: "The garbage bin near the park entrance has not been cleared for 3 days. Overflowing and causing stench.",
    location: { address: "Greenwood Park Entrance", ward: "Ward B", lat: 40.7138, lng: -74.0080, mapX: 60, mapY: 55 },
    status: "assigned",
    priority: "Medium",
    assignedAt: "2026-08-27T08:20:00Z",
    dueDate:    "2026-08-30T12:00:00Z",
    updatedAt:  "2026-08-27T10:00:00Z",
    images: { before: ["https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800"], after: [] },
    reportedBy: "Jane S.",
  },
  {
    id: "ISS-1030",
    title: "Broken Streetlight on Oak Ave",
    category: "Streetlights",
    description: "The streetlight on Oak Avenue is completely broken, making the street dangerous at night.",
    location: { address: "45 Oak Avenue", ward: "Ward A", lat: 40.7150, lng: -74.0100, mapX: 25, mapY: 65 },
    status: "resolved",
    priority: "Low",
    assignedAt: "2026-08-20T18:45:00Z",
    dueDate:    "2026-08-23T17:00:00Z",
    updatedAt:  "2026-08-22T09:30:00Z",
    images: {
      before: ["https://images.unsplash.com/photo-1519772879590-7d7d363d6b05?auto=format&fit=crop&q=80&w=800"],
      after:  ["https://images.unsplash.com/photo-1534085444738-f1c508210168?auto=format&fit=crop&q=80&w=800"],
    },
    reportedBy: "John D.",
  },
  {
    id: "ISS-1035",
    title: "Severe Waterlogging at Market Rd",
    category: "Waterlogging",
    description: "Drainage is blocked leading to knee-deep waterlogging after yesterday's rain. Urgent clearance needed.",
    location: { address: "Market Road Junction", ward: "Ward A", lat: 40.7160, lng: -74.0040, mapX: 70, mapY: 30 },
    status: "assigned",
    priority: "High",
    assignedAt: "2026-08-28T07:15:00Z",
    dueDate:    "2026-08-29T10:00:00Z",   // overdue
    updatedAt:  "2026-08-28T08:00:00Z",
    images: { before: ["https://images.unsplash.com/photo-1527402858-5d15a5fbc40d?auto=format&fit=crop&q=80&w=800"], after: [] },
    reportedBy: "Jane S.",
  },
  {
    id: "ISS-1040",
    title: "Traffic Signal Malfunction",
    category: "Traffic",
    description: "Traffic signal at the main crossroads has been blinking red continuously since morning causing chaos.",
    location: { address: "MG Road Crossroads", ward: "Ward C", lat: 40.7110, lng: -74.0070, mapX: 55, mapY: 20 },
    status: "assigned",
    priority: "High",
    assignedAt: "2026-08-29T06:00:00Z",
    dueDate:    "2026-08-29T14:00:00Z",
    updatedAt:  "2026-08-29T06:00:00Z",
    images: { before: [], after: [] },
    reportedBy: "Priya M.",
  },
];

// ─── Recent activity feed ─────────────────────────────────────────────────────
export const recentActivity = [
  {
    id: "ACT-001",
    type: "completed",
    taskId: "ISS-1030",
    taskTitle: "Broken Streetlight on Oak Ave",
    message: "Task marked as resolved",
    timestamp: "2026-08-28T14:30:00Z",
    timeAgo: "2 hours ago",
  },
  {
    id: "ACT-002",
    type: "proof_uploaded",
    taskId: "ISS-1021",
    taskTitle: "Large Pothole on Main St",
    message: "Before/after photos uploaded",
    timestamp: "2026-08-28T11:00:00Z",
    timeAgo: "5 hours ago",
  },
  {
    id: "ACT-003",
    type: "started",
    taskId: "ISS-1021",
    taskTitle: "Large Pothole on Main St",
    message: "Task status changed to In Progress",
    timestamp: "2026-08-28T09:00:00Z",
    timeAgo: "7 hours ago",
  },
  {
    id: "ACT-004",
    type: "assigned",
    taskId: "ISS-1035",
    taskTitle: "Severe Waterlogging at Market Rd",
    message: "New task assigned by Dept. Admin",
    timestamp: "2026-08-28T07:15:00Z",
    timeAgo: "Yesterday, 8:00 AM",
  },
  {
    id: "ACT-005",
    type: "assigned",
    taskId: "ISS-1025",
    taskTitle: "Overflowing Garbage Bin",
    message: "New task assigned by Dept. Admin",
    timestamp: "2026-08-27T08:20:00Z",
    timeAgo: "Yesterday, 11:30 AM",
  },
];
