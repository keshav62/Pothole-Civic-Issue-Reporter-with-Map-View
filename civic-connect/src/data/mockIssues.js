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

export const MOCK_ISSUES = [
  {
    id: "CC-1024",
    title: "Large hazardous pothole near Sector 15 school gate",
    category: "Pothole",
    description: "Deep pothole measuring approximately 4ft x 3ft created after recent monsoon rains right outside St. Mary's School main gate. Causing extreme traffic congestion and poses serious danger to school buses and cyclists.",
    priority: "HIGH",
    status: "IN_PROGRESS",
    ward: "Ward 15",
    department: "Road Maintenance",
    assignedWorker: "Rahul Sharma",
    workerId: "USR-004",
    latitude: 28.6139,
    longitude: 77.2090,
    address: "Block B, Sector 15, Near School Gate 2, New Delhi",
    reportedBy: "Anil Kapoor (Citizen)",
    reportedDate: "2026-08-28 08:30 AM",
    slaHours: 24,
    elapsedHours: 14,
    slaDue: "2026-08-29 08:30 AM",
    slaStatus: "ON_TIME", // ON_TIME, BREACHED, WARNING
    images: {
      before: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
      after: null
    },
    workNotes: "",
    timeline: [
      { status: "REPORTED", title: "Reported by Citizen", date: "2026-08-28 08:30 AM", actor: "Anil K." },
      { status: "VERIFIED", title: "Verified by Super Admin", date: "2026-08-28 09:15 AM", actor: "Super Admin" },
      { status: "ASSIGNED", title: "Assigned to Field Worker", date: "2026-08-28 10:00 AM", actor: "Road Admin" },
      { status: "IN_PROGRESS", title: "Work Started", date: "2026-08-28 10:42 AM", actor: "Rahul Sharma" }
    ]
  },
  {
    id: "CC-1025",
    title: "Major water pipeline leakage flooding Sector 8 market",
    category: "Water Leakage",
    description: "8-inch main supply pipe burst causing thousands of liters of drinking water wastage and flooding 12 commercial shops in Block C market complex.",
    priority: "CRITICAL",
    status: "ASSIGNED",
    ward: "Ward 8",
    department: "Water Supply",
    assignedWorker: "Amit Kumar",
    workerId: "USR-005",
    latitude: 28.6250,
    longitude: 77.2180,
    address: "Market Complex, Block C, Sector 8, New Delhi",
    reportedBy: "Sunita Verma (Citizen)",
    reportedDate: "2026-08-28 06:15 AM",
    slaHours: 12,
    elapsedHours: 18,
    slaDue: "2026-08-28 06:15 PM",
    slaStatus: "BREACHED",
    images: {
      before: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
      after: null
    },
    workNotes: "",
    timeline: [
      { status: "REPORTED", title: "Reported by Citizen", date: "2026-08-28 06:15 AM", actor: "Sunita V." },
      { status: "VERIFIED", title: "Verified by Super Admin", date: "2026-08-28 07:00 AM", actor: "Super Admin" },
      { status: "ASSIGNED", title: "Assigned to Water Dept Worker", date: "2026-08-28 07:30 AM", actor: "Water Admin" }
    ]
  },
  {
    id: "CC-1018",
    title: "Uncleared solid waste and garbage dump near Ward 12 park",
    category: "Garbage Pileup",
    description: "Overflowing municipal dustbins creating severe stench and hygiene hazards. Stray animals scattering refuse onto main walking path.",
    priority: "MEDIUM",
    status: "RESOLVED",
    ward: "Ward 12",
    department: "Sanitation",
    assignedWorker: "Vikas Singh",
    workerId: "USR-006",
    latitude: 28.6010,
    longitude: 77.1950,
    address: "Central Park West, Sector 12, New Delhi",
    reportedBy: "Rohan Gupta (Citizen)",
    reportedDate: "2026-08-27 10:00 AM",
    slaHours: 48,
    elapsedHours: 26,
    slaDue: "2026-08-29 10:00 AM",
    slaStatus: "RESOLVED_ON_TIME",
    images: {
      before: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
      after: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
    },
    workNotes: "Sanitation team cleared 2.5 tons of solid waste using compactor truck CT-04 and sanitized the surrounding 50m radius with disinfectant powder.",
    timeline: [
      { status: "REPORTED", title: "Reported by Citizen", date: "2026-08-27 10:00 AM", actor: "Rohan G." },
      { status: "VERIFIED", title: "Verified by Super Admin", date: "2026-08-27 11:30 AM", actor: "Super Admin" },
      { status: "ASSIGNED", title: "Assigned to Sanitation Worker", date: "2026-08-27 01:00 PM", actor: "Sanitation Admin" },
      { status: "IN_PROGRESS", title: "Work Started", date: "2026-08-27 03:00 PM", actor: "Vikas Singh" },
      { status: "RESOLVED", title: "Resolved & Verified", date: "2026-08-28 09:00 AM", actor: "Vikas Singh" }
    ]
  },
  {
    id: "CC-1042",
    title: "Broken streetlight array on Ring Road Junction",
    category: "Streetlight",
    description: "5 consecutive LED street poles malfunctioning creating complete dark zone over 200 meters of high-speed arterial road.",
    priority: "HIGH",
    status: "VERIFIED",
    ward: "Ward 15",
    department: "Electrical",
    assignedWorker: null,
    workerId: null,
    latitude: 28.6180,
    longitude: 77.2150,
    address: "Ring Road Flyover Junction, Ward 15, New Delhi",
    reportedBy: "Priya Malik (Citizen)",
    reportedDate: "2026-08-28 01:20 AM",
    slaHours: 24,
    elapsedHours: 23,
    slaDue: "2026-08-29 01:20 AM",
    slaStatus: "WARNING",
    images: {
      before: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
      after: null
    },
    workNotes: "",
    timeline: [
      { status: "REPORTED", title: "Reported by Citizen", date: "2026-08-28 01:20 AM", actor: "Priya M." },
      { status: "VERIFIED", title: "Verified by Super Admin", date: "2026-08-28 02:00 AM", actor: "Super Admin" }
    ]
  },
  {
    id: "CC-1050",
    title: "Clogged stormwater drain causing local road flooding",
    category: "Drainage",
    description: "Plastic debris blocking 3 drainage grates near Metro Station Gate 3. Heavy puddle accumulation obstructing pedestrian crossing.",
    priority: "HIGH",
    status: "IN_PROGRESS",
    ward: "Ward 4",
    department: "Drainage",
    assignedWorker: "Deepak Patel",
    workerId: "USR-007",
    latitude: 28.6300,
    longitude: 77.2200,
    address: "Metro Station Gate 3, Sector 4, New Delhi",
    reportedBy: "Suresh Menon (Citizen)",
    reportedDate: "2026-08-28 09:00 AM",
    slaHours: 24,
    elapsedHours: 5,
    slaDue: "2026-08-29 09:00 AM",
    slaStatus: "ON_TIME",
    images: {
      before: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80",
      after: null
    },
    workNotes: "Suction tanker dispatched to desilt drain inlet.",
    timeline: [
      { status: "REPORTED", title: "Reported by Citizen", date: "2026-08-28 09:00 AM", actor: "Suresh M." },
      { status: "VERIFIED", title: "Verified by Super Admin", date: "2026-08-28 09:30 AM", actor: "Super Admin" },
      { status: "ASSIGNED", title: "Assigned to Drainage Dept", date: "2026-08-28 10:15 AM", actor: "Drainage Admin" },
      { status: "IN_PROGRESS", title: "Work Started", date: "2026-08-28 11:00 AM", actor: "Deepak Patel" }
    ]
  },
  {
    id: "CC-1051",
    title: "Traffic signal lights stuck on red in all directions",
    category: "Traffic Signal",
    description: "Short circuit in traffic controller board causing quad-directional gridlock at busy 4-way intersection.",
    priority: "CRITICAL",
    status: "REPORTED",
    ward: "Ward 8",
    department: "Traffic",
    assignedWorker: null,
    workerId: null,
    latitude: 28.6220,
    longitude: 77.2110,
    address: "Connaught Chowk, Ward 8, New Delhi",
    reportedBy: "Traffic Police Cell",
    reportedDate: "2026-08-28 11:30 AM",
    slaHours: 6,
    elapsedHours: 1,
    slaDue: "2026-08-28 05:30 PM",
    slaStatus: "ON_TIME",
    images: {
      before: "https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=800&q=80",
      after: null
    },
    workNotes: "",
    timeline: [
      { status: "REPORTED", title: "Reported by Traffic Police", date: "2026-08-28 11:30 AM", actor: "Control Room" }
    ]
  },
  {
    id: "CC-1052",
    title: "Damaged children swing set in District Children Park",
    category: "Park Maintenance",
    description: "Rusty chain snapped on main swing frame. Sharp metal edge exposed near toddlers play section.",
    priority: "LOW",
    status: "VERIFIED",
    ward: "Ward 22",
    department: "Parks",
    assignedWorker: null,
    workerId: null,
    latitude: 28.5900,
    longitude: 77.2000,
    address: "District Children Park, Sector 22, New Delhi",
    reportedBy: "Meenakshi Sundaram (Citizen)",
    reportedDate: "2026-08-26 04:00 PM",
    slaHours: 72,
    elapsedHours: 44,
    slaDue: "2026-08-29 04:00 PM",
    slaStatus: "ON_TIME",
    images: {
      before: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
      after: null
    },
    workNotes: "",
    timeline: [
      { status: "REPORTED", title: "Reported by Citizen", date: "2026-08-26 04:00 PM", actor: "Meenakshi S." },
      { status: "VERIFIED", title: "Verified by Super Admin", date: "2026-08-26 05:30 PM", actor: "Super Admin" }
    ]
  },
  {
    id: "CC-1053",
    title: "Open sewage manhole cover on main pedestrian sidewalk",
    category: "Drainage",
    description: "Concrete manhole lid broken in half leaving 6ft deep open chamber right outside Metro Gate 1.",
    priority: "CRITICAL",
    status: "ASSIGNED",
    ward: "Ward 15",
    department: "Drainage",
    assignedWorker: "Rahul Sharma",
    workerId: "USR-004",
    latitude: 28.6120,
    longitude: 77.2070,
    address: "Walkway opposite Metro Gate 1, Ward 15, New Delhi",
    reportedBy: "Vikram Sethi (Citizen)",
    reportedDate: "2026-08-28 07:45 AM",
    slaHours: 12,
    elapsedHours: 5,
    slaDue: "2026-08-28 07:45 PM",
    slaStatus: "ON_TIME",
    images: {
      before: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80",
      after: null
    },
    workNotes: "",
    timeline: [
      { status: "REPORTED", title: "Reported by Citizen", date: "2026-08-28 07:45 AM", actor: "Vikram S." },
      { status: "VERIFIED", title: "Verified by Super Admin", date: "2026-08-28 08:15 AM", actor: "Super Admin" },
      { status: "ASSIGNED", title: "Assigned to Rahul Sharma", date: "2026-08-28 08:45 AM", actor: "Drainage Admin" }
    ]
  },
  {
    id: "CC-1054",
    title: "Fallen tree branch blocking two lanes on Mahatma Gandhi Marg",
    category: "Road Maintenance",
    description: "Heavy banyan tree limb snapped during high winds blocking northbound inner lane.",
    priority: "HIGH",
    status: "RESOLVED",
    ward: "Ward 8",
    department: "Road Maintenance",
    assignedWorker: "Amit Kumar",
    workerId: "USR-005",
    latitude: 28.6270,
    longitude: 77.2190,
    address: "Mahatma Gandhi Marg North, Ward 8, New Delhi",
    reportedBy: "Highway Patrol",
    reportedDate: "2026-08-27 05:00 PM",
    slaHours: 24,
    elapsedHours: 12,
    slaDue: "2026-08-28 05:00 PM",
    slaStatus: "RESOLVED_ON_TIME",
    images: {
      before: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
      after: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
    },
    workNotes: "Tree limb chainsawed, logs cleared into truck RR-12, asphalt swept clean.",
    timeline: [
      { status: "REPORTED", title: "Reported by Highway Patrol", date: "2026-08-27 05:00 PM", actor: "Highway Control" },
      { status: "VERIFIED", title: "Verified by Admin", date: "2026-08-27 05:30 PM", actor: "Super Admin" },
      { status: "ASSIGNED", title: "Assigned to Amit Kumar", date: "2026-08-27 06:00 PM", actor: "Road Admin" },
      { status: "IN_PROGRESS", title: "Work Started", date: "2026-08-27 07:00 PM", actor: "Amit Kumar" },
      { status: "RESOLVED", title: "Work Completed", date: "2026-08-28 05:00 AM", actor: "Amit Kumar" }
    ]
  },
  {
    id: "CC-1055",
    title: "Multiple dangerous potholes near Central Market intersection",
    category: "Pothole",
    description: "Cluster of 3 consecutive severe potholes on the left lane causing heavy vehicular swerving and two-wheeler accidents.",
    priority: "CRITICAL",
    status: "REPORTED",
    ward: "Ward 15",
    department: "Road Maintenance",
    assignedWorker: null,
    workerId: null,
    latitude: 28.6155,
    longitude: 77.2115,
    address: "Central Market South Access Road, Ward 15, New Delhi",
    reportedBy: "Sanjay Singhania (Citizen)",
    reportedDate: "2026-08-29 07:00 AM",
    slaHours: 24,
    elapsedHours: 2,
    slaDue: "2026-08-30 07:00 AM",
    slaStatus: "ON_TIME",
    images: {
      before: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
      after: null
    },
    workNotes: "",
    timeline: [
      { status: "REPORTED", title: "Reported by Citizen", date: "2026-08-29 07:00 AM", actor: "Sanjay S." }
    ]
  },
  {
    id: "CC-1056",
    title: "Low water pressure and dirty water supply in Block D residential line",
    category: "Water Leakage",
    description: "Contaminated brown water output in 35 households due to cross-leakage near underground junction.",
    priority: "HIGH",
    status: "IN_PROGRESS",
    ward: "Ward 8",
    department: "Water Supply",
    assignedWorker: "Amit Kumar",
    workerId: "USR-005",
    latitude: 28.6235,
    longitude: 77.2160,
    address: "Block D Residential Row, Sector 8, New Delhi",
    reportedBy: "Residents Welfare Association",
    reportedDate: "2026-08-28 02:00 PM",
    slaHours: 24,
    elapsedHours: 16,
    slaDue: "2026-08-29 02:00 PM",
    slaStatus: "ON_TIME",
    images: {
      before: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
      after: null
    },
    workNotes: "Pipeline pressure test underway; flushing valve opened.",
    timeline: [
      { status: "REPORTED", title: "Reported by RWA", date: "2026-08-28 02:00 PM", actor: "RWA Secretary" },
      { status: "VERIFIED", title: "Verified by Super Admin", date: "2026-08-28 02:30 PM", actor: "Super Admin" },
      { status: "ASSIGNED", title: "Assigned to Amit Kumar", date: "2026-08-28 03:00 PM", actor: "Water Admin" },
      { status: "IN_PROGRESS", title: "Work Started", date: "2026-08-28 04:00 PM", actor: "Amit Kumar" }
    ]
  },
  {
    id: "CC-1057",
    title: "Illegal commercial waste dumping near community clinic",
    category: "Garbage Pileup",
    description: "Unsegregated commercial packaging and wet waste dumped on open curb outside dispensary.",
    priority: "HIGH",
    status: "VERIFIED",
    ward: "Ward 12",
    department: "Sanitation",
    assignedWorker: null,
    workerId: null,
    latitude: 28.6030,
    longitude: 77.1975,
    address: "Dispensary Lane, Ward 12, New Delhi",
    reportedBy: "Dr. Alok Verma",
    reportedDate: "2026-08-29 06:30 AM",
    slaHours: 24,
    elapsedHours: 4,
    slaDue: "2026-08-30 06:30 AM",
    slaStatus: "ON_TIME",
    images: {
      before: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
      after: null
    },
    workNotes: "",
    timeline: [
      { status: "REPORTED", title: "Reported by Citizen", date: "2026-08-29 06:30 AM", actor: "Dr. Alok V." },
      { status: "VERIFIED", title: "Verified by Super Admin", date: "2026-08-29 07:00 AM", actor: "Super Admin" }
    ]
  },
  {
    id: "CC-1058",
    title: "Severe stormwater drain overflow near bus terminal",
    category: "Drainage",
    description: "Silted arterial culvert overflowing across 3 bus parking bays with foul black sludge.",
    priority: "CRITICAL",
    status: "ASSIGNED",
    ward: "Ward 4",
    department: "Drainage",
    assignedWorker: "Deepak Patel",
    workerId: "USR-007",
    latitude: 28.6320,
    longitude: 77.2220,
    address: "Inter-State Bus Terminal North Gate, Ward 4, New Delhi",
    reportedBy: "Transport Authority Inspector",
    reportedDate: "2026-08-29 05:45 AM",
    slaHours: 12,
    elapsedHours: 4,
    slaDue: "2026-08-29 05:45 PM",
    slaStatus: "ON_TIME",
    images: {
      before: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80",
      after: null
    },
    workNotes: "",
    timeline: [
      { status: "REPORTED", title: "Reported by Transit Staff", date: "2026-08-29 05:45 AM", actor: "Transit Cell" },
      { status: "VERIFIED", title: "Verified by Admin", date: "2026-08-29 06:15 AM", actor: "Super Admin" },
      { status: "ASSIGNED", title: "Assigned to Deepak Patel", date: "2026-08-29 06:30 AM", actor: "Drainage Admin" }
    ]
  }
];
