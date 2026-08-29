import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_ISSUES } from '../data/mockIssues';
import { MOCK_USERS } from '../data/mockUsers';
import { MOCK_DEPARTMENTS } from '../data/mockDepartments';
import { MOCK_WORKERS } from '../data/mockWorkers';
import { MOCK_NOTIFICATIONS } from '../data/mockNotifications';
import { fetchIssuesApi } from '../services/issueService';

const CivicContext = createContext(null);

export const CivicProvider = ({ children }) => {
  const [issues, setIssues] = useState(MOCK_ISSUES);
  const [users, setUsers] = useState(MOCK_USERS);
  const [departments, setDepartments] = useState(MOCK_DEPARTMENTS);
  const [workers, setWorkers] = useState(MOCK_WORKERS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  // Fetch real issues from MongoDB on load and merge with mock state
  useEffect(() => {
    const loadRealIssues = async () => {
      try {
        const data = await fetchIssuesApi();
        if (data?.issues && Array.isArray(data.issues)) {
          const normalized = data.issues.map((issue) => ({
            ...issue,
            id: issue.issueId || issue._id,
            timeline: issue.timeline && issue.timeline.length > 0 ? issue.timeline : [
              { status: issue.status || 'REPORTED', title: 'Issue Reported', date: new Date(issue.createdAt).toLocaleString(), actor: 'Citizen' }
            ]
          }));
          setIssues((prev) => {
            const existingIds = new Set(prev.map((i) => i.id || i._id));
            const newOnes = normalized.filter((i) => !existingIds.has(i.id) && !existingIds.has(i._id));
            return [...newOnes, ...prev];
          });
        }
      } catch {
        // Fall back gracefully to mock state if unauthenticated or offline
      }
    };
    loadRealIssues();
  }, []);

  const addIssue = (newIssue) => {
    if (!newIssue) return;
    const formatted = {
      ...newIssue,
      id: newIssue.issueId || newIssue._id || `ISS-${Date.now()}`,
      ward: newIssue.ward || 'Ward 15',
      address: newIssue.address || 'Sector 15',
      timeline: newIssue.timeline && newIssue.timeline.length > 0 ? newIssue.timeline : [
        { status: newIssue.status || 'REPORTED', title: 'Issue Submitted to HQ', date: new Date().toLocaleString(), actor: 'Citizen' }
      ]
    };
    setIssues((prev) => [formatted, ...prev]);
  };

  const showToast = (message, type = 'info') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: '', type: 'info' });
    }, 4000);
  };

  const addNotification = (notif) => {
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      time: 'Just now',
      read: false,
      ...notif
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const verifyIssue = (issueId) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        const newTimeline = [
          ...issue.timeline,
          { status: 'VERIFIED', title: 'Issue Verified by Admin', date: new Date().toLocaleString(), actor: 'Admin' }
        ];
        return { ...issue, status: 'VERIFIED', timeline: newTimeline };
      }
      return issue;
    }));
    showToast(`Issue ${issueId} verified successfully!`, 'success');
  };

  const rejectIssue = (issueId, reason = 'Duplicate or Invalid') => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        const newTimeline = [
          ...issue.timeline,
          { status: 'REJECTED', title: `Rejected: ${reason}`, date: new Date().toLocaleString(), actor: 'Admin' }
        ];
        return { ...issue, status: 'REJECTED', timeline: newTimeline };
      }
      return issue;
    }));
    showToast(`Issue ${issueId} rejected`, 'warning');
  };

  const assignIssue = (issueId, departmentName, workerId) => {
    const worker = workers.find(w => w.id === workerId);
    const workerName = worker ? worker.name : 'Unassigned';

    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        const newTimeline = [
          ...issue.timeline,
          { status: 'ASSIGNED', title: `Assigned to ${workerName}`, date: new Date().toLocaleString(), actor: 'Dept Admin' }
        ];
        return {
          ...issue,
          department: departmentName || issue.department,
          assignedWorker: workerName,
          workerId: workerId || issue.workerId,
          status: 'ASSIGNED',
          timeline: newTimeline
        };
      }
      return issue;
    }));

    if (workerId) {
      setWorkers(prev => prev.map(w => {
        if (w.id === workerId) {
          return { ...w, activeTasks: w.activeTasks + 1, status: 'BUSY' };
        }
        return w;
      }));

      addNotification({
        title: `New Task Assigned: ${issueId}`,
        message: `Task has been assigned to you.`,
        type: 'ASSIGNMENT',
        role: 'FIELD_WORKER',
        userId: workerId,
        link: `/worker/tasks/${issueId}`
      });
    }

    showToast(`Issue ${issueId} assigned to ${workerName}`, 'success');
  };

  const updateIssuePriority = (issueId, newPriority) => {
    setIssues(prev => prev.map(i => i.id === issueId ? { ...i, priority: newPriority } : i));
    showToast(`Issue ${issueId} priority set to ${newPriority}`, 'info');
  };

  const updateIssueStatus = (issueId, newStatus) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        const newTimeline = [
          ...issue.timeline,
          { status: newStatus, title: `Status changed to ${newStatus}`, date: new Date().toLocaleString(), actor: 'System' }
        ];
        return { ...issue, status: newStatus, timeline: newTimeline };
      }
      return issue;
    }));
    showToast(`Issue ${issueId} status updated to ${newStatus}`, 'info');
  };

  const updateIssueImages = (issueId, beforeImage, afterImage) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          images: {
            before: beforeImage !== undefined ? beforeImage : issue.images.before,
            after: afterImage !== undefined ? afterImage : issue.images.after
          }
        };
      }
      return issue;
    }));
  };

  const startTask = (issueId) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        const newTimeline = [
          ...issue.timeline,
          { status: 'IN_PROGRESS', title: 'Work Started by Worker', date: new Date().toLocaleString(), actor: issue.assignedWorker || 'Worker' }
        ];
        return { ...issue, status: 'IN_PROGRESS', timeline: newTimeline };
      }
      return issue;
    }));
    showToast(`Started work on ${issueId}`, 'success');
  };

  const completeTask = (issueId, beforeImage, afterImage, workNotes) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        const newTimeline = [
          ...issue.timeline,
          { status: 'RESOLVED', title: 'Work Completed & Verified', date: new Date().toLocaleString(), actor: issue.assignedWorker || 'Worker' }
        ];
        return {
          ...issue,
          status: 'RESOLVED',
          slaStatus: 'RESOLVED_ON_TIME',
          images: {
            before: beforeImage !== undefined ? beforeImage : issue.images.before,
            after: afterImage !== undefined ? afterImage : issue.images.after
          },
          workNotes: workNotes || 'Task completed as per standard municipal operating guidelines.',
          timeline: newTimeline
        };
      }
      return issue;
    }));

    const targetIssue = issues.find(i => i.id === issueId);
    if (targetIssue && targetIssue.workerId) {
      setWorkers(prev => prev.map(w => {
        if (w.id === targetIssue.workerId) {
          return {
            ...w,
            activeTasks: Math.max(0, w.activeTasks - 1),
            completedTasks: w.completedTasks + 1,
            status: w.activeTasks - 1 === 0 ? 'AVAILABLE' : 'BUSY'
          };
        }
        return w;
      }));
    }

    showToast(`Task ${issueId} successfully marked as RESOLVED!`, 'success');
  };

  const escalateIssue = (issueId) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        return { ...issue, priority: 'CRITICAL', slaStatus: 'BREACHED' };
      }
      return issue;
    }));

    addNotification({
      title: `ESCALATED: ${issueId}`,
      message: `Issue ${issueId} escalated to Headquarters Super Admin.`,
      type: 'SLA_WARNING',
      role: 'SUPER_ADMIN',
      link: `/admin/escalations`
    });

    showToast(`Issue ${issueId} ESCALATED to Headquarters!`, 'warning');
  };

  const addUser = (newUser) => {
    const userWithId = {
      ...newUser,
      id: `USR-${100 + users.length + 1}`,
      lastActive: 'Just now'
    };
    setUsers(prev => [userWithId, ...prev]);
    showToast(`User ${userWithId.name} created successfully`, 'success');
  };

  const updateUserStatus = (userId, newStatus) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    showToast(`User status updated to ${newStatus}`, 'info');
  };

  const addDepartment = (newDept) => {
    const deptWithId = {
      ...newDept,
      id: `DEP-${100 + departments.length + 1}`,
      workersCount: 0,
      totalIssues: 0,
      openIssues: 0,
      inProgress: 0,
      resolved: 0,
      resolutionRate: '100%',
      slaCompliance: '100%',
      status: 'ACTIVE'
    };
    setDepartments(prev => [...prev, deptWithId]);
    showToast(`Department ${newDept.name} added`, 'success');
  };

  const updateWorkerStatus = (workerId, newStatus) => {
    setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, status: newStatus } : w));
    showToast(`Worker status updated to ${newStatus}`, 'info');
  };

  const markNotificationAsRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  return (
    <CivicContext.Provider value={{
      issues,
      addIssue,
      users,
      departments,
      workers,
      notifications,
      toast,
      showToast,
      verifyIssue,
      rejectIssue,
      assignIssue,
      updateIssuePriority,
      updateIssueStatus,
      updateIssueImages,
      startTask,
      completeTask,
      escalateIssue,
      addUser,
      updateUserStatus,
      addDepartment,
      updateWorkerStatus,
      markNotificationAsRead
    }}>
      {children}
    </CivicContext.Provider>
  );
};

export const useCivic = () => {
  const context = useContext(CivicContext);
  if (!context) {
    throw new Error('useCivic must be used within a CivicProvider');
  }
  return context;
};
