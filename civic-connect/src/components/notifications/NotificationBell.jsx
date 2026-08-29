import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useCivic } from '../../context/CivicContext';
import { useAuth } from '../../context/AuthContext';
import { useRealtimeAlerts } from '../../context/AlertContext';
import { NotificationItem } from './NotificationItem';
import {
  Bell,
  CheckCheck,
  Radio,
  AlertOctagon,
  ArrowRight,
  MapPin,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationBell = () => {
  const { notifications, markNotificationAsRead, issues } = useCivic();
  const { role } = useAuth();
  const { alerts, unreadCount: alertUnreadCount, markAllAsRead, hasNewCriticalAlert } = useRealtimeAlerts();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('NEARBY'); // 'NEARBY' | 'REPORTS'
  const bellRef = useRef(null);

  const isCitizen = role === 'CITIZEN';

  // Compute Report Progress Notifications for Citizen
  const reportProgressNotifs = useMemo(() => {
    if (!issues || !Array.isArray(issues)) return [];
    
    const items = [];
    issues.forEach(issue => {
      if (issue.timeline && Array.isArray(issue.timeline)) {
        // Take latest timeline event
        const latestStep = issue.timeline[issue.timeline.length - 1];
        if (latestStep) {
          items.push({
            id: `PROG-${issue.id}-${latestStep.status}`,
            issueId: issue.id,
            title: `Issue ${issue.id}: ${latestStep.title}`,
            issueTitle: issue.title,
            status: issue.status,
            priority: issue.priority,
            date: latestStep.date,
            actor: latestStep.actor || 'System Admin',
            read: false
          });
        }
      }
    });

    return items;
  }, [issues]);

  const filteredNotifs = notifications.filter(n => !n.role || n.role === role);
  
  const totalUnreadCount = isCitizen 
    ? alertUnreadCount + reportProgressNotifs.filter(n => !n.read).length 
    : filteredNotifs.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSeverityBadgeClass = (priority) => {
    const p = (priority || '').toUpperCase();
    if (p === 'CRITICAL') return 'bg-red-500/10 text-red-600 border-red-200';
    if (p === 'HIGH') return 'bg-amber-500/10 text-amber-700 border-amber-200';
    if (p === 'MEDIUM') return 'bg-amber-500/10 text-amber-600 border-amber-100';
    return 'bg-blue-500/10 text-blue-600 border-blue-200';
  };

  const getSeverityDot = (priority) => {
    const p = (priority || '').toUpperCase();
    if (p === 'CRITICAL') return '🔴';
    if (p === 'HIGH') return '🟠';
    if (p === 'MEDIUM') return '🟡';
    return '🔵';
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'RESOLVED') return { label: 'RESOLVED', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (s === 'IN_PROGRESS') return { label: 'IN PROGRESS', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (s === 'ASSIGNED') return { label: 'ASSIGNED', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: s || 'REPORTED', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
  };

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        title="Notifications & Alerts"
      >
        <Bell className={`w-5 h-5 ${hasNewCriticalAlert ? 'text-red-600 animate-bounce' : 'text-slate-600'}`} />
        {totalUnreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse shadow-xs">
            {totalUnreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black tracking-tight text-slate-900 uppercase">
                {isCitizen ? 'NOTIFICATIONS & ALERTS' : 'NOTIFICATIONS'}
              </h3>
              {isCitizen ? (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Radio className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
                  LIVE
                </span>
              ) : (
                totalUnreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-red-700 font-bold">
                    {totalUnreadCount} new
                  </span>
                )
              )}
            </div>

            <button
              onClick={() => {
                if (isCitizen) markAllAsRead();
                else filteredNotifs.forEach(n => markNotificationAsRead(n.id));
              }}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          </div>

          {/* Citizen Dual Navigation Tabs */}
          {isCitizen && (
            <div className="flex items-center border-b border-slate-100 bg-slate-50/60 p-1">
              <button
                onClick={() => setActiveTab('NEARBY')}
                className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'NEARBY'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                🚨 Nearby Alerts ({alerts.length})
              </button>

              <button
                onClick={() => setActiveTab('REPORTS')}
                className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'REPORTS'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                📋 Report Progress ({reportProgressNotifs.length})
              </button>
            </div>
          )}

          {/* Citizen Notification Feeds */}
          {isCitizen ? (
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {activeTab === 'NEARBY' ? (
                /* Tab 1: Proximity Live Location Alerts */
                alerts.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <span className="text-2xl block mb-2">✓</span>
                    <p className="text-xs font-bold text-slate-700">No active civic issues detected nearby</p>
                    <p className="text-[11px] text-slate-400 mt-1">Your neighborhood currently looks clear.</p>
                  </div>
                ) : (
                  alerts.slice(0, 5).map(alert => (
                    <div
                      key={alert.alertId}
                      onClick={() => {
                        setIsOpen(false);
                        navigate(`/citizen/alerts`);
                      }}
                      className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${
                        !alert.isRead ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <span className="text-base shrink-0 mt-0.5">{getSeverityDot(alert.priority)}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${getSeverityBadgeClass(alert.priority)}`}>
                            {alert.priority}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">{alert.category}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 truncate leading-snug">{alert.title}</h4>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 font-medium">
                          <span className="flex items-center gap-1 font-bold text-blue-600">
                            <MapPin className="w-3 h-3 text-blue-500" />
                            {alert.formattedDistance} away
                          </span>
                          <span>{alert.formattedTimeAgo}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : (
                /* Tab 2: Report Progress Updates */
                reportProgressNotifs.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">No report updates yet</p>
                    <p className="text-[11px] text-slate-400 mt-1">Submit a report to track its progress here.</p>
                  </div>
                ) : (
                  reportProgressNotifs.map(item => {
                    const st = getStatusBadge(item.status);
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setIsOpen(false);
                          navigate('/citizen/reports');
                        }}
                        className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${st.bg}`}>
                              {st.label}
                            </span>
                            <span className="font-mono font-bold text-[10px] text-blue-600">{item.issueId}</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.title}</h4>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.issueTitle}</p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-medium">
                            <span>Actor: <strong className="text-slate-700">{item.actor}</strong></span>
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )
              )}
            </div>
          ) : (
            /* Admin & Worker Standard Notifications */
            <div className="max-h-80 overflow-y-auto px-3 py-2 space-y-2">
              {filteredNotifs.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No notifications</p>
              ) : (
                filteredNotifs.map((notif) => (
                  <NotificationItem
                    key={notif.id}
                    notif={notif}
                    onMarkRead={markNotificationAsRead}
                  />
                ))
              )}
            </div>
          )}

          {/* Footer Navigation */}
          {isCitizen && (
            <div className="px-4 pt-3 border-t border-slate-100 text-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (activeTab === 'NEARBY') navigate('/citizen/alerts');
                  else navigate('/citizen/reports');
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1.5 w-full py-1 cursor-pointer"
              >
                {activeTab === 'NEARBY' ? `View All Alerts (${alerts.length})` : 'View All My Reports'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
