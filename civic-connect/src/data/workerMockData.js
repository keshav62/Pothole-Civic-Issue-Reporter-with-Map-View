export const workerProfile = {
  id: "FW-101",
  name: "Rahul Sharma",
  role: "FIELD_WORKER",
  email: "rahul.sharma@civicconnect.com",
  phone: "+91 98765 43210",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
  department: "Road Maintenance",
  ward: "Ward 12 - Andheri East",
  completedTasksCount: 142,
  activeTasksCount: 3,
  rating: 4.8,
  joinDate: "2023-04-15T00:00:00Z"
};

export const workerTasks = [
  {
    id: "CC-1051",
    title: "Large Pothole on Main Street",
    category: "Pothole",
    description: "Deep pothole causing traffic slowdowns and potential damage to vehicles near the intersection.",
    location: "Main Street, near Central Park",
    latitude: 19.1136,
    longitude: 72.8697,
    priority: "CRITICAL",
    status: "IN_PROGRESS",
    dueDate: "2026-08-29T18:00:00Z",
    assignedDate: "2026-08-28T09:00:00Z",
    citizenName: "Amit Patel",
    department: "Road Maintenance",
    beforeImage: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80",
    afterImage: null
  },
  {
    id: "CC-1052",
    title: "Broken Streetlight",
    category: "Streetlight",
    description: "Streetlight pole number 42 is completely dark, causing safety issues for pedestrians at night.",
    location: "Oakwood Avenue",
    latitude: 19.1145,
    longitude: 72.8712,
    priority: "HIGH",
    status: "ASSIGNED",
    dueDate: "2026-08-30T12:00:00Z",
    assignedDate: "2026-08-28T10:30:00Z",
    citizenName: "Priya Singh",
    department: "Electrical",
    beforeImage: "https://images.unsplash.com/photo-1520697926135-b21908d1f2e6?auto=format&fit=crop&w=400&q=80",
    afterImage: null
  },
  {
    id: "CC-1053",
    title: "Overflowing Garbage Dumpster",
    category: "Waste Management",
    description: "Garbage has not been collected for 3 days and is spilling onto the road.",
    location: "Sector 4 Market Area",
    latitude: 19.1120,
    longitude: 72.8680,
    priority: "MEDIUM",
    status: "ACCEPTED",
    dueDate: "2026-08-31T10:00:00Z",
    assignedDate: "2026-08-28T11:15:00Z",
    citizenName: "Neha Gupta",
    department: "Sanitation",
    beforeImage: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80",
    afterImage: null
  },
  {
    id: "CC-1054",
    title: "Clogged Storm Drain",
    category: "Drainage",
    description: "Water logging occurs even with mild rain due to a completely blocked drain.",
    location: "MG Road, Phase 2",
    latitude: 19.1160,
    longitude: 72.8705,
    priority: "HIGH",
    status: "OVERDUE",
    dueDate: "2026-08-27T18:00:00Z",
    assignedDate: "2026-08-26T09:00:00Z",
    citizenName: "Vikram Desai",
    department: "Water & Sewage",
    beforeImage: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=400&q=80",
    afterImage: null
  },
  {
    id: "CC-1055",
    title: "Fallen Tree Branch",
    category: "Road Hazard",
    description: "Large tree branch fallen across the walking path.",
    location: "Lakeview Promenade",
    latitude: 19.1182,
    longitude: 72.8734,
    priority: "LOW",
    status: "COMPLETED",
    dueDate: "2026-08-28T18:00:00Z",
    assignedDate: "2026-08-28T08:00:00Z",
    citizenName: "Rohan Mehta",
    department: "Parks & Recreation",
    beforeImage: "https://images.unsplash.com/photo-1595168058299-dcbcc461cb28?auto=format&fit=crop&w=400&q=80",
    afterImage: "https://images.unsplash.com/photo-1595168058299-dcbcc461cb28?auto=format&fit=crop&w=400&q=80" // Using same for demo
  },
  {
    id: "CC-1056",
    title: "Traffic Light Malfunction",
    category: "Traffic",
    description: "Signals are stuck on red for all directions, causing massive gridlock.",
    location: "Highway Intersection 9",
    latitude: 19.1111,
    longitude: 72.8655,
    priority: "CRITICAL",
    status: "IN_PROGRESS",
    dueDate: "2026-08-29T10:00:00Z",
    assignedDate: "2026-08-29T08:30:00Z",
    citizenName: "Arjun Reddy",
    department: "Traffic Control",
    beforeImage: "https://images.unsplash.com/photo-1511215160868-6c8a002b8d4c?auto=format&fit=crop&w=400&q=80",
    afterImage: null
  },
  {
    id: "CC-1057",
    title: "Water Pipe Leak",
    category: "Water Supply",
    description: "Fresh water is gushing out of a cracked pipe near the residential complex.",
    location: "Sunrise Apartments, Gate 2",
    latitude: 19.1195,
    longitude: 72.8750,
    priority: "HIGH",
    status: "ASSIGNED",
    dueDate: "2026-08-29T15:00:00Z",
    assignedDate: "2026-08-29T09:15:00Z",
    citizenName: "Kavita Rao",
    department: "Water & Sewage",
    beforeImage: "https://images.unsplash.com/photo-1542159146-5e5d1ec9c7f6?auto=format&fit=crop&w=400&q=80",
    afterImage: null
  },
  {
    id: "CC-1058",
    title: "Missing Manhole Cover",
    category: "Road Hazard",
    description: "Dangerous open manhole in the middle of the sidewalk.",
    location: "Station Road",
    latitude: 19.1150,
    longitude: 72.8640,
    priority: "CRITICAL",
    status: "ACCEPTED",
    dueDate: "2026-08-29T12:00:00Z",
    assignedDate: "2026-08-29T07:45:00Z",
    citizenName: "Sanjay Joshi",
    department: "Road Maintenance",
    beforeImage: "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=400&q=80",
    afterImage: null
  },
  {
    id: "CC-1059",
    title: "Graffiti on Public Wall",
    category: "Vandalism",
    description: "Offensive graffiti painted on the community center wall.",
    location: "Community Center, Ward A",
    latitude: 19.1175,
    longitude: 72.8715,
    priority: "LOW",
    status: "OVERDUE",
    dueDate: "2026-08-25T17:00:00Z",
    assignedDate: "2026-08-20T10:00:00Z",
    citizenName: "Meera Nair",
    department: "Sanitation",
    beforeImage: "https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=400&q=80",
    afterImage: null
  },
  {
    id: "CC-1060",
    title: "Damaged Bus Shelter",
    category: "Infrastructure",
    description: "The roof of the bus shelter has collapsed after the recent storm.",
    location: "Bus Stop 45, Ring Road",
    latitude: 19.1105,
    longitude: 72.8760,
    priority: "MEDIUM",
    status: "COMPLETED",
    dueDate: "2026-08-27T18:00:00Z",
    assignedDate: "2026-08-25T11:30:00Z",
    citizenName: "Raj Patil",
    department: "Public Works",
    beforeImage: "https://images.unsplash.com/photo-1515286577457-3aa5a11488c9?auto=format&fit=crop&w=400&q=80",
    afterImage: "https://images.unsplash.com/photo-1515286577457-3aa5a11488c9?auto=format&fit=crop&w=400&q=80"
  }
];

export const recentActivity = [
  {
    id: "ACT-001",
    type: "assigned",
    taskId: "CC-1057",
    taskTitle: "Water Pipe Leak",
    action: "Task assigned to you",
    timeAgo: "2 hours ago",
    time: "09:15 AM"
  },
  {
    id: "ACT-002",
    type: "started",
    taskId: "CC-1051",
    taskTitle: "Large Pothole on Main Street",
    action: "You started working on this task",
    timeAgo: "4 hours ago",
    time: "07:30 AM"
  },
  {
    id: "ACT-003",
    type: "proof_uploaded",
    taskId: "CC-1055",
    taskTitle: "Fallen Tree Branch",
    action: "You uploaded completion photo",
    timeAgo: "1 day ago",
    time: "Yesterday, 05:45 PM"
  },
  {
    id: "ACT-004",
    type: "completed",
    taskId: "CC-1055",
    taskTitle: "Fallen Tree Branch",
    action: "Task marked as resolved",
    timeAgo: "1 day ago",
    time: "Yesterday, 05:50 PM"
  },
  {
    id: "ACT-005",
    type: "assigned",
    taskId: "CC-1056",
    taskTitle: "Traffic Light Malfunction",
    action: "Task assigned to you",
    timeAgo: "2 days ago",
    time: "Aug 27, 08:30 AM"
  }
];



export const workerNotifications = [
  {
    id: 'notif-1',
    type: 'TASK_ASSIGNED',
    title: 'New Task Assigned',
    message: 'Pothole #1024 has been assigned to you.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    isRead: false,
    taskId: '1024'
  },
  {
    id: 'notif-2',
    type: 'DEADLINE_APPROACHING',
    title: 'Task Deadline Approaching',
    message: 'Pothole #1024 is due tomorrow. Please complete the repair.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isRead: false,
    taskId: '1024'
  },
  {
    id: 'notif-3',
    type: 'TASK_OVERDUE',
    title: 'Task Overdue',
    message: 'Fallen Tree #1027 is now overdue.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isRead: true,
    taskId: '1027'
  },
  {
    id: 'notif-4',
    type: 'STATUS_UPDATED',
    title: 'Task Status Updated',
    message: 'Task #1022 status was updated to IN_PROGRESS.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    isRead: true,
    taskId: '1022'
  },
  {
    id: 'notif-5',
    type: 'RESOLUTION_APPROVED',
    title: 'Resolution Approved',
    message: 'Your resolution proof for #1021 was approved by the department.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    isRead: true,
    taskId: '1021'
  },
  {
    id: 'notif-6',
    type: 'RESOLUTION_REJECTED',
    title: 'Resolution Rejected',
    message: 'Your resolution proof for #1025 was rejected. Needs clearer photos.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
    isRead: true,
    taskId: '1025'
  },
  {
    id: 'notif-7',
    type: 'TASK_REASSIGNED',
    title: 'Task Reassigned',
    message: 'Task #1020 has been reassigned to another worker.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // 5 days ago
    isRead: true,
    taskId: '1020'
  }
];

export const CATEGORY_META = {
  Pothole: { icon: "🕳️", color: "text-amber-500", bg: "bg-amber-50" },
  Streetlight: { icon: "💡", color: "text-blue-500", bg: "bg-blue-50" },
  "Waste Management": { icon: "🗑️", color: "text-emerald-500", bg: "bg-emerald-50" },
  Drainage: { icon: "💧", color: "text-cyan-500", bg: "bg-cyan-50" },
  "Road Hazard": { icon: "🚧", color: "text-red-500", bg: "bg-red-50" },
  Traffic: { icon: "🚦", color: "text-rose-500", bg: "bg-rose-50" },
  "Water Supply": { icon: "🚰", color: "text-blue-600", bg: "bg-blue-100" },
  Vandalism: { icon: "🖌️", color: "text-purple-500", bg: "bg-purple-50" },
  Infrastructure: { icon: "🏗️", color: "text-slate-500", bg: "bg-slate-50" }
};

export const PRIORITY_META = {
  LOW: { color: "text-blue-500", bg: "bg-blue-50" },
  MEDIUM: { color: "text-amber-500", bg: "bg-amber-50" },
  HIGH: { color: "text-orange-500", bg: "bg-orange-50" },
  CRITICAL: { color: "text-red-500", bg: "bg-red-50" }
};
