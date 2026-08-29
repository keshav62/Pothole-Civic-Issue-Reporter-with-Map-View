import React, { createContext, useContext, useState } from 'react';
import {
  workerTasks as initialTasks,
  workerNotifications as initialNotifications,
  recentActivity as initialActivity,
  workerProfile as initialProfile
} from '../data/workerMockData';

const WorkerContext = createContext();

export const useWorker = () => {
  const context = useContext(WorkerContext);
  if (!context) {
    throw new Error('useWorker must be used within a WorkerProvider');
  }
  return context;
};

export const WorkerProvider = ({ children }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [recentActivity, setRecentActivity] = useState(initialActivity);
  const [profile, setProfile] = useState(initialProfile);

  // Helper to add activity
  const addActivity = (type, taskId, taskTitle, action) => {
    const newActivity = {
      id: `ACT-${Date.now()}`,
      type,
      taskId,
      taskTitle,
      action,
      timeAgo: 'Just now',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setRecentActivity(prev => [newActivity, ...prev].slice(0, 10)); // Keep last 10
  };

  // Helper to add notification
  const addNotification = (type, title, message, taskId) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      isRead: false,
      taskId
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {

        // Triggers for specific statuses
        if (newStatus === 'ACCEPTED') {
          addActivity('assigned', taskId, task.title, 'You accepted this task');
        } else if (newStatus === 'IN_PROGRESS') {
          addActivity('started', taskId, task.title, 'You started working on this task');
        }

        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  const submitProof = (taskId, afterImage, repairNotes) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {

        // Update stats
        setProfile(prev => ({
          ...prev,
          completedTasksCount: (prev.completedTasksCount || 0) + 1,
          activeTasksCount: Math.max(0, (prev.activeTasksCount || 1) - 1)
        }));

        // Log activities and notifications
        addActivity('proof_uploaded', taskId, task.title, 'You uploaded completion photo');
        addActivity('completed', taskId, task.title, 'Task marked as resolved');

        addNotification(
          'STATUS_UPDATED',
          'Resolution Submitted',
          `Your proof for ${taskId} is pending citizen verification.`,
          taskId
        );

        return {
          ...task,
          status: 'COMPLETED',
          afterImage,
          repairNotes
        };
      }
      return task;
    }));
  };

  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n =>
      n.id === notifId ? { ...n, isRead: true } : n
    ));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <WorkerContext.Provider value={{
      tasks,
      notifications,
      recentActivity,
      profile,
      updateTaskStatus,
      submitProof,
      markNotificationRead,
      markAllNotificationsRead
    }}>
      {children}
    </WorkerContext.Provider>
  );
};
