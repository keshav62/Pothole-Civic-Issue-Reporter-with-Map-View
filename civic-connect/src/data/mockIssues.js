export const mockIssues = [
  {
    id: "ISS-1021",
    title: "Large Pothole on Main St",
    category: "Potholes",
    categoryIcon: "🔴",
    description: "There is a massive pothole in the middle lane near the central library. It's causing traffic slowdowns and poses a risk to two-wheelers.",
    location: {
      address: "123 Main St, Sector 15",
      ward: "Ward A",
      lat: 40.7128,
      lng: -74.0060,
      mapX: 42,   // % position on the mini-map
      mapY: 35,
    },
    reporter: "U-001",
    assignedTo: "FW-101",
    status: "in-progress",
    priority: "High",
    createdAt: "2026-08-25T10:30:00Z",
    updatedAt: "2026-08-28T14:15:00Z",
    dueDate: "2026-08-29T17:00:00Z",
    images: {
      before: ["https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800"],
      after: []
    }
  },
  {
    id: "ISS-1025",
    title: "Overflowing Garbage Bin",
    category: "Garbage",
    categoryIcon: "🟠",
    description: "The garbage bin near the park entrance has not been cleared for 3 days. It's overflowing and smells terrible.",
    location: {
      address: "Greenwood Park Entrance",
      ward: "Ward 8",
      lat: 40.7138,
      lng: -74.0080,
      mapX: 60,
      mapY: 55,
    },
    reporter: "U-002",
    assignedTo: "FW-101",
    status: "assigned",
    priority: "Medium",
    createdAt: "2026-08-27T08:20:00Z",
    updatedAt: "2026-08-27T10:00:00Z",
    dueDate: "2026-08-30T12:00:00Z",
    images: {
      before: ["https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800"],
      after: []
    }
  },
  {
    id: "ISS-1030",
    title: "Broken Streetlight on Oak Ave",
    category: "Streetlights",
    categoryIcon: "🟡",
    description: "The streetlight on Oak Avenue is completely broken, making the street very dark at night.",
    location: {
      address: "45 Oak Avenue",
      ward: "Ward 12",
      lat: 40.7150,
      lng: -74.0100,
      mapX: 25,
      mapY: 65,
    },
    reporter: "U-001",
    assignedTo: "FW-101",
    status: "resolved",
    priority: "Low",
    createdAt: "2026-08-20T18:45:00Z",
    updatedAt: "2026-08-22T09:30:00Z",
    dueDate: "2026-08-23T17:00:00Z",
    images: {
      before: ["https://images.unsplash.com/photo-1519772879590-7d7d363d6b05?auto=format&fit=crop&q=80&w=800"],
      after: ["https://images.unsplash.com/photo-1534085444738-f1c508210168?auto=format&fit=crop&q=80&w=800"]
    }
  },
  {
    id: "ISS-1035",
    title: "Severe Waterlogging at Market Rd",
    category: "Waterlogging",
    categoryIcon: "🔵",
    description: "Drainage is blocked leading to knee-deep waterlogging after yesterday's rain.",
    location: {
      address: "Market Road",
      ward: "Ward A",
      lat: 40.7160,
      lng: -74.0040,
      mapX: 70,
      mapY: 30,
    },
    reporter: "U-002",
    assignedTo: "FW-101",
    status: "assigned",
    priority: "High",
    createdAt: "2026-08-28T07:15:00Z",
    updatedAt: "2026-08-28T08:00:00Z",
    dueDate: "2026-08-29T10:00:00Z",
    images: {
      before: ["https://images.unsplash.com/photo-1527402858-5d15a5fbc40d?auto=format&fit=crop&q=80&w=800"],
      after: []
    }
  },
  {
    id: "ISS-1040",
    title: "Traffic Signal Malfunction",
    category: "Traffic",
    categoryIcon: "🟤",
    description: "Traffic signal at the main crossroads has been blinking red continuously since morning.",
    location: {
      address: "MG Road Crossroads",
      ward: "Ward 5",
      lat: 40.7110,
      lng: -74.0070,
      mapX: 55,
      mapY: 20,
    },
    reporter: "U-001",
    assignedTo: "FW-101",
    status: "assigned",
    priority: "High",
    createdAt: "2026-08-29T06:00:00Z",
    updatedAt: "2026-08-29T06:00:00Z",
    dueDate: "2026-08-29T14:00:00Z",
    images: {
      before: [],
      after: []
    }
  }
];

export const recentActivity = [
  {
    id: "ACT-001",
    issueId: "ISS-1030",
    action: "marked as resolved",
    detail: "Broken Streetlight on Oak Ave",
    time: "2 hours ago",
    icon: "✅",
  },
  {
    id: "ACT-002",
    issueId: "ISS-1021",
    action: "status updated to In Progress",
    detail: "Large Pothole on Main St",
    time: "5 hours ago",
    icon: "🔄",
  },
  {
    id: "ACT-003",
    issueId: "ISS-1035",
    action: "new task assigned",
    detail: "Severe Waterlogging at Market Rd",
    time: "Yesterday, 8:00 AM",
    icon: "📋",
  },
  {
    id: "ACT-004",
    issueId: "ISS-1025",
    action: "photo evidence uploaded",
    detail: "Overflowing Garbage Bin",
    time: "Yesterday, 11:30 AM",
    icon: "📷",
  },
];
