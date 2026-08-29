<<<<<<< HEAD
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorker } from '../../context/WorkerContext';
import { useCivic } from '../../context/CivicContext';
=======
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/api';
>>>>>>> 8ac4962db56f74d0175fdd10612f3967b108d442
import { IssueStatus } from '../../components/issues/IssueStatus';
import { IssuePriority } from '../../components/issues/IssuePriority';
import { LocationCard } from '../../components/worker/LocationCard';
import { SLAIndicator } from '../../components/worker/SLAIndicator';
import { AIAnalysisCard } from '../../components/worker/AIAnalysisCard';
import { ResolutionVerification } from '../../components/worker/ResolutionVerification';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { SafeImage } from '../../components/common/SafeImage';
import { ToastContext } from '../../context/ToastContext';
import * as issueService from '../../services/issueService';
import {
  MapPin,
  Navigation,
  ArrowLeft,
  Calendar,
  User,
  Building,
  CheckCircle2,
  Clock,
  UploadCloud,
  FileText,
  AlertTriangle
} from 'lucide-react';

export const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

<<<<<<< HEAD
  const { tasks, updateTaskStatus } = useWorker();
  const { issues } = useCivic();
  const { showToast } = React.useContext(ToastContext);

  const [fetchedTask, setFetchedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState(null);

  const cleanId = decodeURIComponent(id || '').trim();

  // Find task from context (check both worker tasks and civic issues)
  const contextTask = useMemo(() => {
    const all = [...(tasks || []), ...(issues || [])];
    return all.find(t => {
      const tId = String(t.issueId || t.id || t._id || '').trim().toLowerCase();
      const searchId = cleanId.toLowerCase();
      return tId === searchId || tId.replaceAll('-', ' ') === searchId.replaceAll('-', ' ');
    }) || null;
  }, [tasks, issues, cleanId]);

  // If not found in context, fetch from backend API
  useEffect(() => {
    if (contextTask) {
      setFetchedTask(contextTask);
      setLocalStatus(contextTask.status);
      return;
    }

    let isMounted = true;
    const loadSingleTask = async () => {
      if (!cleanId) return;
      try {
        setLoading(true);
        const data = await issueService.fetchIssueById(cleanId);
        const issueDoc = data?.issue || data;
        if (issueDoc && isMounted) {
          setFetchedTask(issueDoc);
          setLocalStatus(issueDoc.status);
        }
      } catch (err) {
        console.warn('Could not fetch task by ID:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSingleTask();

    return () => {
      isMounted = false;
    };
  }, [cleanId, contextTask]);

  const task = fetchedTask || contextTask;

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold text-slate-600">Loading Task Details...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-black text-slate-900">Task Not Found</h2>
        <p className="text-xs text-slate-500">
          We couldn't locate task <span className="font-mono font-bold text-slate-700">{cleanId}</span>. It may have been reassigned or deleted.
        </p>
        <Button variant="primary" icon={ArrowLeft} onClick={() => navigate('/worker/tasks')}>
          Return to Assigned Tasks
        </Button>
      </div>
    );
  }

  const currentStatus = localStatus || task.status || 'REPORTED';
  const displayId = task.issueId || task.id || (task._id ? String(task._id) : cleanId);

  // Extract address safely
  const taskAddress = task.address ||
    (typeof task.location === 'string' ? task.location : task.location?.address) ||
    task.ward ||
    'Municipal Field Zone';

  // Extract coordinates safely
  let lat = task.latitude ?? task.lat ?? task.location?.lat;
  let lng = task.longitude ?? task.lng ?? task.location?.lng;
  if (task.location?.coordinates && Array.isArray(task.location.coordinates) && task.location.coordinates.length >= 2) {
    lng = task.location.coordinates[0];
    lat = task.location.coordinates[1];
  }

  const beforeImg = task.beforeImage || task.images?.[0];
  const afterImg = task.afterImage || task.images?.[1];

  const handleAccept = async () => {
    setLocalStatus('ACCEPTED');
    await updateTaskStatus(task._id || task.id || task.issueId, 'ACCEPTED');
    if (showToast) showToast("Task accepted successfully!", "success");
  };

  const handleStart = async () => {
    setLocalStatus('IN_PROGRESS');
    await updateTaskStatus(task._id || task.id || task.issueId, 'IN_PROGRESS');
    if (showToast) showToast("Task started. Timeline updated.", "success");
  };

  const handleUploadProof = () => {
    navigate(`/worker/tasks/${task._id || task.id || task.issueId}/upload`);
=======
  const [task, setTask] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`/api/workers/me/tasks/${id}`);
      const issue = response.data.task;
      
      setTask({
        id: issue._id,
        displayId: issue.issueId || issue._id.substring(0, 8).toUpperCase(),
        title: issue.title,
        category: issue.category,
        status: issue.status,
        priority: issue.priority,
        description: issue.description,
        location: issue.address || 'Location not specified',
        latitude: issue.location?.coordinates?.[1],
        longitude: issue.location?.coordinates?.[0],
        dueDate: issue.dueDate,
        assignedDate: issue.createdAt,
        beforeImage: issue.beforeImages?.[0] || issue.images?.[0] || null,
        afterImage: issue.afterImages?.[0] || null,
        citizenName: issue.reportedBy?.name || 'Citizen',
        department: issue.department?.name || 'Department'
      });
      setTimeline(response.data.timeline || []);
    } catch (err) {
      if (err.status === 404) setError('Task not found or not assigned to you.');
      else if (err.status === 401 || err.status === 403) setError('Unauthorized to view this task.');
      else setError(err.message || 'Server error loading task.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const handleAccept = async () => {
    if (isUpdating) return;
    try {
      setIsUpdating(true);
      await apiFetch(`/api/workers/tasks/${id}/accept`, { method: 'PATCH' });
      showToast("Task accepted successfully!", "success");
      await fetchTaskDetails(); // Refresh all data including timeline without browser refresh
    } catch (err) {
      showToast(err.message || "Failed to accept task", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStart = async () => {
    if (isUpdating) return;
    try {
      setIsUpdating(true);
      await apiFetch(`/api/workers/tasks/${id}/start`, { method: 'PATCH' });
      showToast("Task started. Timeline updated.", "success");
      await fetchTaskDetails(); // Refresh all data including timeline without browser refresh
    } catch (err) {
      showToast(err.message || "Failed to start task", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUploadProof = () => {
    navigate(`/worker/tasks/${id}/upload`);
>>>>>>> 8ac4962db56f74d0175fdd10612f3967b108d442
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="mt-4 text-slate-500 font-medium">Loading task details...</span>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="py-24 px-4 flex justify-center">
        <div className="bg-red-50/50 rounded-2xl border border-red-100 p-8 max-w-md text-center">
          <h3 className="text-xl font-bold text-red-700 mb-2">Access Denied</h3>
          <p className="text-red-500 mb-6">{error || 'Task not found.'}</p>
          <Button variant="outline" onClick={() => navigate('/worker/tasks')} fullWidth>
            Return to Task List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in duration-200">
      {/* Topbar navigation */}
      <button
        onClick={() => navigate('/worker/tasks')}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Task List
      </button>

      {/* 1. Issue Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
<<<<<<< HEAD
              {displayId}
=======
              {task.displayId}
>>>>>>> 8ac4962db56f74d0175fdd10612f3967b108d442
            </span>
            <Badge variant="neutral" className="uppercase tracking-wider text-[10px]">
              {task.category || 'General'}
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight">
            {task.title || 'Civic Issue Details'}
          </h1>
        </div>
        <div className="flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <IssuePriority priority={task.priority} />
            <IssueStatus status={currentStatus} />
          </div>
          <SLAIndicator dueDate={task.dueDate} status={currentStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Image, Desc, Timeline */}
        <div className="md:col-span-2 space-y-6">
          {/* 2. Issue Image Showcase */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className={`aspect-video sm:h-56 w-full bg-slate-900 relative ${afterImg ? 'border-b sm:border-b-0 sm:border-r border-slate-200' : 'sm:col-span-2'}`}>
                <SafeImage
                  src={beforeImg}
                  alt="Before Repair"
                  fallbackText="Reported Photo Evidence"
                />
                <div className="absolute top-3 left-3 bg-slate-950/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-md border border-slate-700 z-10">
                  <FileText className="w-3 h-3 text-blue-400" /> Reported Photo Evidence
                </div>
              </div>

              {afterImg && (
                <div className="aspect-video sm:h-56 w-full bg-emerald-950 relative">
                  <SafeImage
                    src={afterImg}
                    alt="After Repair"
                    fallbackText="Verified Work Proof"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-md border border-emerald-600 z-10">
                    <CheckCircle2 className="w-3 h-3 text-emerald-300" /> Verified Work Proof
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Description & Context */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description & Context</h3>
              <p className="text-slate-800 leading-relaxed text-xs sm:text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                {task.description || 'No additional description provided.'}
              </p>
            </div>
            {task.repairNotes && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Worker Resolution Notes
                </h3>
                <p className="text-slate-800 leading-relaxed text-xs bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                  {task.repairNotes}
                </p>
              </div>
            )}
          </div>

          {/* 4. Chronological Timeline */}
          {timeline.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4 mt-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" /> Task History Timeline
              </h3>
              <div className="space-y-0">
                {timeline.map((item, idx) => {
                  const isLast = idx === timeline.length - 1;
                  // Map raw actions to the requested display labels
                  const actionMap = {
                    'WORKER_ASSIGNED': 'Assigned',
                    'TASK_ACCEPTED': 'Accepted',
                    'TASK_STARTED': 'Work Started',
                    'PROOF_UPLOADED': 'Proof Uploaded',
                    'TASK_COMPLETED': 'Proof Submitted',
                    'CITIZEN_VERIFIED': 'Citizen Verified',
                  };
                  const displayAction = actionMap[item.action] || item.action.replace(/_/g, ' ');

                  return (
                    <div key={item._id || idx} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm z-10 group-hover:bg-blue-100 group-hover:scale-110 transition-transform">
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        </div>
                        {!isLast && <div className="w-0.5 flex-1 bg-slate-100 my-1 min-h-[24px]"></div>}
                      </div>
                      <div className={`pb-6 pt-1 ${isLast ? '' : ''}`}>
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                          <p className="text-sm font-bold text-slate-900">{displayAction}</p>
                          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">•</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {item.oldStatus ? `${item.oldStatus} ➔ ${item.newStatus}` : item.newStatus}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(item.createdAt).toLocaleString()}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400 mt-0.5 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          By: {item.performedBy?.name || 'System User'}
                        </p>
                        {item.note && (
                          <div className="mt-2 text-xs bg-slate-50 p-2 rounded-lg border border-slate-100 text-slate-600">
                            {item.note}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {/* Pending State for Citizen Verification */}
                {task.status === 'PENDING_CITIZEN_VERIFICATION' && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 shadow-sm z-10 animate-pulse">
                        <Clock className="w-4 h-4 text-amber-600" />
                      </div>
                    </div>
                    <div className="pb-2 pt-1">
                      <p className="text-sm font-bold text-amber-700">Waiting for Citizen Verification</p>
                      <p className="text-[10px] text-amber-600/70 mt-1">
                        The citizen has been notified to review the proof.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <ResolutionVerification task={task} />
        </div>

        {/* Right Column: Info Cards & Actions */}
        <div className="space-y-6">
          <AIAnalysisCard
            analysis={{
              detectedCategory: task.category || 'Pothole / Road Repair',
              confidence: 94,
              severity: task.priority || 'HIGH',
              recommendedDepartment: task.department?.name || 'Road Infrastructure',
              recommendation: `Immediate repair recommended based on standard municipal field guidelines.`
            }}
          />

          <LocationCard
            address={taskAddress}
            latitude={lat || 28.6280}
            longitude={lng || 77.2160}
            distance="2.4 km away"
          />

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" /> Citizen Contact
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-[10px] text-slate-500 font-semibold">Reporter Name</p>
                <p className="text-xs font-bold text-slate-900">{task.reportedBy?.name || task.citizenName || 'Verified Resident'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold">Reported Date</p>
                <p className="text-xs font-semibold text-slate-700">
                  {task.createdAt || task.assignedDate ? new Date(task.createdAt || task.assignedDate).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white/95 backdrop-blur border-t border-slate-200/80 p-4 shadow-xl z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-slate-900">
              Task Status: <span className="text-blue-600">{String(currentStatus || '').replace('_', ' ')}</span>
            </p>
            <p className="text-[11px] text-slate-500">Perform the action to update division records.</p>
          </div>

          <div className="flex-1 sm:flex-none flex justify-end">
<<<<<<< HEAD
            {(currentStatus === 'ASSIGNED' || currentStatus === 'REPORTED') && (
              <Button variant="primary" icon={CheckCircle2} onClick={handleAccept} fullWidth className="sm:w-auto px-6">
                Accept Task
              </Button>
            )}

            {currentStatus === 'ACCEPTED' && (
              <Button variant="primary" icon={Clock} onClick={handleStart} fullWidth className="sm:w-auto px-6">
                Start Task
              </Button>
            )}

            {(currentStatus === 'IN_PROGRESS' || currentStatus === 'OVERDUE') && (
              <Button variant="success" icon={UploadCloud} onClick={handleUploadProof} fullWidth className="sm:w-auto px-6">
=======
            {task.status === 'ASSIGNED' && (
              <Button variant="primary" icon={CheckCircle2} onClick={handleAccept} disabled={isUpdating} fullWidth className="sm:w-auto px-6">
                {isUpdating ? 'Accepting...' : 'Accept Task'}
              </Button>
            )}

            {task.status === 'ACCEPTED' && (
              <Button variant="primary" icon={Clock} onClick={handleStart} disabled={isUpdating} fullWidth className="sm:w-auto px-6">
                {isUpdating ? 'Starting...' : 'Start Task'}
              </Button>
            )}

            {(task.status === 'IN_PROGRESS' || task.status === 'REOPENED') && (
              <Button variant="success" icon={UploadCloud} onClick={handleUploadProof} disabled={isUpdating} fullWidth className="sm:w-auto px-6">
>>>>>>> 8ac4962db56f74d0175fdd10612f3967b108d442
                Upload Proof & Complete Task
              </Button>
            )}

<<<<<<< HEAD
            {(currentStatus === 'COMPLETED' || currentStatus === 'RESOLVED' || currentStatus === 'PENDING_CITIZEN_VERIFICATION') && (
=======
            {(task.status === 'PENDING_CITIZEN_VERIFICATION' || task.status === 'CITIZEN_VERIFIED' || task.status === 'RESOLVED') && (
>>>>>>> 8ac4962db56f74d0175fdd10612f3967b108d442
              <Button variant="outline" icon={FileText} onClick={() => navigate('/worker/tasks')} fullWidth className="sm:w-auto px-6">
                Return to Task List
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
