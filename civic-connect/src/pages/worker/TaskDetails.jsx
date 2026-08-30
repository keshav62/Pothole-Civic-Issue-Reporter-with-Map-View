import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorker } from '../../context/WorkerContext';
import { useCivic } from '../../context/CivicContext';
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

  const { tasks, updateTaskStatus } = useWorker();
  const { issues, updateIssueStatus } = useCivic();
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
      <div className="py-24 flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="mt-4 text-slate-500 font-medium">Loading task details...</span>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="py-20 px-4 flex justify-center">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md text-center shadow-xs space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900">Task Details Unavailable</h3>
          <p className="text-slate-500 text-sm">We couldn't locate details for task <span className="font-mono font-bold text-slate-700">{cleanId}</span>.</p>
          <Button variant="primary" onClick={() => navigate('/worker/tasks')} fullWidth icon={ArrowLeft}>
            Return to Task List
          </Button>
        </div>
      </div>
    );
  }

  // Null-safe extracted variables
  const displayId = task.issueId || task.id || (task._id ? String(task._id) : 'ISS-000');
  const currentStatus = localStatus || task.status || 'ASSIGNED';
  const taskAddress = typeof task.location === 'string'
    ? task.location
    : (task.address || task.location?.address || task.ward || 'Municipal Field Zone');

  let lat = task.latitude ?? task.lat ?? task.location?.lat;
  let lng = task.longitude ?? task.lng ?? task.location?.lng;
  if (task.location?.coordinates && Array.isArray(task.location.coordinates) && task.location.coordinates.length >= 2) {
    lng = task.location.coordinates[0];
    lat = task.location.coordinates[1];
  }

  const beforeImg = task.beforeImage || task.images?.[0];
  const afterImg = task.afterImage || task.images?.[1];

  const handleAccept = async () => {
    const targetId = task._id || task.id || task.issueId || cleanId;
    setLocalStatus('IN_PROGRESS');
    if (setFetchedTask) setFetchedTask(prev => prev ? { ...prev, status: 'IN_PROGRESS' } : prev);
    await updateTaskStatus(targetId, 'IN_PROGRESS');
    if (updateIssueStatus) await updateIssueStatus(targetId, 'IN_PROGRESS');
    if (showToast) showToast("Task accepted & started! Proceed to upload resolution proof.", "success");
    navigate(`/worker/tasks/${targetId}/upload`);
  };

  const handleStart = async () => {
    const targetId = task._id || task.id || task.issueId || cleanId;
    setLocalStatus('IN_PROGRESS');
    if (setFetchedTask) setFetchedTask(prev => prev ? { ...prev, status: 'IN_PROGRESS' } : prev);
    await updateTaskStatus(targetId, 'IN_PROGRESS');
    if (updateIssueStatus) await updateIssueStatus(targetId, 'IN_PROGRESS');
    if (showToast) showToast("Task started! Proceed to upload resolution proof.", "success");
    navigate(`/worker/tasks/${targetId}/upload`);
  };

  const handleUploadProof = () => {
    const targetId = task._id || task.id || task.issueId || cleanId;
    navigate(`/worker/tasks/${targetId}/upload`);
  };

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
              {displayId}
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

          <ResolutionVerification task={{ ...task, status: currentStatus }} />
        </div>

        {/* Right Column: Info Cards & Actions */}
        <div className="space-y-6">
          <AIAnalysisCard
            analysis={{
              detectedCategory: task.category || 'POTHOLE',
              confidence: 94,
              severity: task.priority || 'MEDIUM',
              recommendedDepartment: typeof task.department === 'string' ? task.department : task.department?.name || 'Roads & Infrastructure',
              recommendation: `Immediate repair recommended based on standard municipal field guidelines.`
            }}
          />

          <LocationCard
            address={taskAddress}
            latitude={lat}
            longitude={lng}
            distance="Nearby Field Location"
          />

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" /> Citizen Contact
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-[10px] text-slate-500 font-semibold">Reporter Name</p>
                <p className="text-xs font-bold text-slate-900">{typeof task.reportedBy === 'string' ? task.reportedBy : task.reportedBy?.name || task.citizenName || 'Public Resident'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold">Assigned Date</p>
                <p className="text-xs font-semibold text-slate-700">
                  {task.assignedDate ? new Date(task.assignedDate).toLocaleDateString() : task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Today'}
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

            {(currentStatus === 'IN_PROGRESS' || currentStatus === 'OVERDUE' || currentStatus === 'REOPENED') && (
              <Button variant="success" icon={UploadCloud} onClick={handleUploadProof} fullWidth className="sm:w-auto px-6">
                Upload Proof & Complete Task
              </Button>
            )}

            {(currentStatus === 'COMPLETED' || currentStatus === 'RESOLVED' || currentStatus === 'PENDING_CITIZEN_VERIFICATION' || currentStatus === 'CITIZEN_VERIFIED') && (
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
