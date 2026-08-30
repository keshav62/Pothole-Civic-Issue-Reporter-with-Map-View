import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as issueService from '../services/issueService';
import * as userService from '../services/userService';
import * as notificationService from '../services/notificationService';
import { MOCK_ISSUES } from '../data/mockIssues';
import { MOCK_DEPARTMENTS } from '../data/mockDepartments';
import { MOCK_NOTIFICATIONS } from '../data/mockNotifications';
import { fetchIssuesApi } from '../services/issueService';

const CivicContext = createContext(null);

export const CivicProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState(MOCK_DEPARTMENTS);
  const [workers, setWorkers] = useState([]);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  const loadUsersAndWorkers = useCallback(async () => {
    try {
      const data = await userService.fetchUsers({ limit: 100 });
      if (data?.users) {
        setUsers(data.users);
        const workerList = data.users.filter(u => u.role === 'FIELD_WORKER');
        setWorkers(workerList);
      }
    } catch (err) {
      console.warn('Failed to load users from API:', err);
    }
  }, []);

  // Derive real-time notifications from live issues
  const generateLiveNotifications = useCallback((issueList) => {
    if (!issueList || !Array.isArray(issueList)) return [];

    const liveNotifs = [];

    issueList.forEach((issue) => {
      const issueId = issue.issueId || (issue._id ? String(issue._id) : 'ISS-000');
      const timeAgo = issue.createdAt ? new Date(issue.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently';

      if (issue.status === 'REPORTED' || issue.status === 'PENDING') {
        liveNotifs.push({
          id: `NOTIF-NEW-${issue._id || issue.id}`,
          title: `New Issue Reported: ${issue.title || 'Pothole Alert'}`,
          message: `Location: ${issue.address || 'Municipal Zone'} (${issue.priority || 'MEDIUM'} Priority)`,
          time: timeAgo,
          read: false,
          type: 'alert',
          priority: issue.priority || 'MEDIUM',
          role: 'CITIZEN',
          issueId: issueId
        });
      } else if (issue.status === 'ASSIGNED') {
        liveNotifs.push({
          id: `NOTIF-ASSIGN-${issue._id || issue.id}`,
          title: `Dispatch Assigned: ${issueId}`,
          message: `Assigned to field team for ${issue.title || 'Civic Issue'}`,
          time: timeAgo,
          read: false,
          type: 'info',
          priority: issue.priority || 'MEDIUM',
          role: 'FIELD_WORKER',
          issueId: issueId
        });
      } else if (issue.status === 'IN_PROGRESS') {
        liveNotifs.push({
          id: `NOTIF-PROGRESS-${issue._id || issue.id}`,
          title: `Repair In Progress: ${issueId}`,
          message: `Field team actively working on ${issue.title || 'Civic Issue'}`,
          time: timeAgo,
          read: false,
          type: 'status',
          priority: issue.priority || 'MEDIUM',
          issueId: issueId
        });
      } else if (issue.status === 'RESOLVED' || issue.status === 'COMPLETED' || issue.status === 'PENDING_CITIZEN_VERIFICATION') {
        liveNotifs.push({
          id: `NOTIF-RESOLVED-${issue._id || issue.id}`,
          title: `Resolution Completed: ${issueId}`,
          message: `Repair proof uploaded for ${issue.title || 'Civic Issue'}`,
          time: timeAgo,
          read: false,
          type: 'success',
          priority: issue.priority || 'MEDIUM',
          issueId: issueId
        });
      }
    });

    return liveNotifs;
  }, []);

  useEffect(() => {
    const loadIssues = async () => {
      if (!currentUser) return; // Only fetch if authenticated

      try {
        const data = await issueService.fetchIssues({ limit: 100 });
        if (data?.issues?.length) {
          const normalizedIssues = data.issues.map(iss => ({ ...iss, id: iss.id || iss._id }));
          setIssues(normalizedIssues);
          const liveNotifs = generateLiveNotifications(normalizedIssues);
          if (liveNotifs.length > 0) {
            setNotifications(liveNotifs);
          }
        } else {
          setIssues(MOCK_ISSUES); // fallback
        }
      } catch (err) {
        console.warn('Failed to fetch issues from API, using mock data:', err);
        setIssues(MOCK_ISSUES);
      }
    };
    if (currentUser) {
      loadIssues();
      loadUsersAndWorkers();
    }

    const interval = setInterval(loadIssues, 10000);
    return () => clearInterval(interval);
  }, [currentUser, loadUsersAndWorkers, generateLiveNotifications]);

  const refreshIssues = async () => {
    try {
      const data = await issueService.fetchIssues({ limit: 100 });
      if (data?.issues?.length) {
        const normalizedIssues = data.issues.map(iss => ({ ...iss, id: iss.id || iss._id }));
        setIssues(normalizedIssues);
      }
    } catch (err) {
      console.warn('Failed to refresh issues from API:', err);
    }
  };

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

  const verifyIssue = async (issueId) => {
    try {
      await issueService.updateIssue(issueId, { status: 'VERIFIED' });
    } catch (err) {
      console.warn('API call failed, updating locally:', err);
    }
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId || issue._id === issueId) {
        const newTimeline = [
          ...(issue.timeline || []),
          { status: 'VERIFIED', title: 'Issue Verified by Admin', date: new Date().toLocaleString(), actor: 'Admin' }
        ];
        return { ...issue, status: 'VERIFIED', timeline: newTimeline };
      }
      return issue;
    }));
    showToast(`Issue ${issueId} verified successfully!`, 'success');
  };

  const rejectIssue = async (issueId, reason = 'Duplicate or Invalid') => {
    try {
      await issueService.updateIssue(issueId, { status: 'REJECTED' });
    } catch (err) {
      console.warn('API call failed, updating locally:', err);
    }
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId || issue._id === issueId) {
        const newTimeline = [
          ...(issue.timeline || []),
          { status: 'REJECTED', title: `Rejected: ${reason}`, date: new Date().toLocaleString(), actor: 'Admin' }
        ];
        return { ...issue, status: 'REJECTED', timeline: newTimeline };
      }
      return issue;
    }));
    showToast(`Issue ${issueId} rejected`, 'warning');
  };

  const assignIssue = async (issueId, departmentName, workerId) => {
    try {
      await issueService.assignIssue(issueId, workerId, 'Assigned via system');
    } catch (err) {
      console.warn('API call failed, updating locally:', err);
    }

    const worker = workers.find(w => w.id === workerId);
    const workerName = worker ? worker.name : 'Unassigned';

    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId || issue._id === issueId) {
        const newTimeline = [
          ...(issue.timeline || []),
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
    setIssues(prev => prev.map(i => (i.id === issueId || i._id === issueId) ? { ...i, priority: newPriority } : i));
    showToast(`Issue ${issueId} priority set to ${newPriority}`, 'info');
  };

  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      await issueService.updateIssue(issueId, { status: newStatus });
    } catch (err) {
      console.warn('API call failed, updating locally:', err);
    }
    setIssues(prev => prev.map(issue => {
      const isMatch = issue.id === issueId || issue._id === issueId || issue.issueId === issueId || String(issue._id) === String(issueId);
      if (isMatch) {
        const newTimeline = [
          ...(issue.timeline || []),
          { status: newStatus, title: `Status changed to ${newStatus}`, date: new Date().toLocaleString(), actor: 'Field Worker' }
        ];
        return { ...issue, status: newStatus, timeline: newTimeline };
      }
      return issue;
    }));
    showToast(`Issue ${issueId} status updated to ${newStatus}`, 'info');
  };

  const updateIssueImages = (issueId, beforeImage, afterImage) => {
    setIssues(prev => prev.map(issue => {
      const isMatch = issue.id === issueId || issue._id === issueId || issue.issueId === issueId || String(issue._id) === String(issueId);
      if (isMatch) {
        return {
          ...issue,
          images: {
            before: beforeImage !== undefined ? beforeImage : (issue.images?.before || null),
            after: afterImage !== undefined ? afterImage : (issue.images?.after || null)
          }
        };
      }
      return issue;
    }));
  };

  const startTask = async (issueId) => {
    try {
      await issueService.updateIssue(issueId, { status: 'IN_PROGRESS' });
    } catch (err) {
      console.warn('API call failed, updating locally:', err);
    }
    setIssues(prev => prev.map(issue => {
      const isMatch = issue.id === issueId || issue._id === issueId || issue.issueId === issueId || String(issue._id) === String(issueId);
      if (isMatch) {
        const newTimeline = [
          ...(issue.timeline || []),
          { status: 'IN_PROGRESS', title: 'Work Started by Field Worker', date: new Date().toLocaleString(), actor: 'Field Worker' }
        ];
        return { ...issue, status: 'IN_PROGRESS', timeline: newTimeline };
      }
      return issue;
    }));
    showToast(`Started work on ${issueId}`, 'success');
  };

  const completeTask = async (issueId, beforeImage, afterImage, workNotes) => {
    try {
      await issueService.updateIssue(issueId, { status: 'RESOLVED', workNotes });
    } catch (err) {
      console.warn('API call failed, updating locally:', err);
    }
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId || issue._id === issueId) {
        const newTimeline = [
          ...(issue.timeline || []),
          { status: 'RESOLVED', title: 'Work Completed & Verified', date: new Date().toLocaleString(), actor: issue.assignedWorker || 'Worker' }
        ];
        return {
          ...issue,
          status: 'RESOLVED',
          slaStatus: 'RESOLVED_ON_TIME',
          images: {
            before: beforeImage !== undefined ? beforeImage : (issue.images?.before || null),
            after: afterImage !== undefined ? afterImage : (issue.images?.after || null)
          },
          workNotes: workNotes || 'Task completed as per standard municipal operating guidelines.',
          timeline: newTimeline
        };
      }
      return issue;
    }));

    const targetIssue = issues.find(i => i.id === issueId || i._id === issueId);
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
      if (issue.id === issueId || issue._id === issueId) {
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

  const addUser = async (newUser) => {
    try {
      const data = await userService.createUser(newUser);
      if (data?.user) {
        setUsers(prev => [data.user, ...prev]);
        showToast(`User ${data.user.name} created in MongoDB Atlas`, 'success');
        loadUsersAndWorkers();
        return;
      }
    } catch (err) {
      console.warn('Failed to create user via API, adding to state:', err);
    }
    const userWithId = {
      ...newUser,
      id: `USR-${Date.now()}`,
      lastActive: 'Just now'
    };
    setUsers(prev => [userWithId, ...prev]);
    showToast(`User ${userWithId.name} created`, 'success');
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      await userService.updateUser(userId, { status: newStatus });
    } catch (err) {
      console.warn('Failed to update user status via API:', err);
    }
    setUsers(prev => prev.map(u => (u.id === userId || u._id === userId) ? { ...u, status: newStatus } : u));
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
      markNotificationAsRead,
      refreshIssues
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
