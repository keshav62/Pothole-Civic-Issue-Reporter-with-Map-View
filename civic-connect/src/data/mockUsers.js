export const mockUsers = [
  {
    id: "U-001",
    name: "John Doe",
    role: "citizen",
    email: "john@example.com",
    phone: "+1 234 567 8900",
  },
  {
    id: "U-002",
    name: "Jane Smith",
    role: "citizen",
    email: "jane@example.com",
    phone: "+1 234 567 8901",
  },
  {
    id: "FW-101",
    name: "Rajesh Kumar",
    role: "worker",
    email: "rajesh.worker@civicconnect.com",
    phone: "+91 98765 43210",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
    department: "Road Maintenance",
    assignedWard: "Ward A",
    completedTasksCount: 42,
    activeTasksCount: 3,
  }
];

export const currentWorker = mockUsers.find(u => u.id === "FW-101");
