import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorker } from '../../context/WorkerContext';
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
  FileText
} from 'lucide-react';

export const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { tasks, updateTaskStatus } = useWorker();
  const { showToast } = React.useContext(ToastContext);

  // Find task from context
  const task = tasks.find(t => t.id === id) || tasks[0];

  if (!task) return null;

  const handleAccept = () => {
    updateTaskStatus(task.id, 'ACCEPTED');
    showToast("Task accepted successfully!", "success");
  };

  const handleStart = () => {
    updateTaskStatus(task.id, 'IN_PROGRESS');
    showToast("Task started. Timeline updated.", "success");
  };

  const handleUploadProof = () => {
    navigate(`/worker/tasks/${task.id}/upload`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in duration-200">
      {/* Topbar navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Task List
      </button>

      {/* 1. Issue Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              {task.id}
            </span>
            <Badge variant="neutral" className="uppercase tracking-wider text-[10px]">
              {task.category}
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight">
            {task.title}
          </h1>
        </div>
        <div className="flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <IssuePriority priority={task.priority} />
            <IssueStatus status={task.status} />
          </div>
          <SLAIndicator dueDate={task.dueDate} status={task.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Image, Desc, Timeline */}
        <div className="md:col-span-2 space-y-6">
          {/* 2. Issue Image Showcase */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className={`aspect-video sm:h-56 w-full bg-slate-900 relative ${task.afterImage ? 'border-b sm:border-b-0 sm:border-r border-slate-200' : 'sm:col-span-2'}`}>
                <SafeImage
                  src={task.beforeImage}
                  alt="Before Repair"
                  fallbackText="Reported Photo Evidence"
                />
                <div className="absolute top-3 left-3 bg-slate-950/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-md border border-slate-700 z-10">
                  <FileText className="w-3 h-3 text-blue-400" /> Reported Photo Evidence
                </div>
              </div>

              {task.afterImage && (
                <div className="aspect-video sm:h-56 w-full bg-emerald-950 relative">
                  <SafeImage
                    src={task.afterImage}
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
                {task.description}
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

          <ResolutionVerification task={task} />
        </div>

        {/* Right Column: Info Cards & Actions */}
        <div className="space-y-6">
          <AIAnalysisCard
            analysis={{
              detectedCategory: task.category,
              confidence: 94,
              severity: task.priority,
              recommendedDepartment: task.department,
              recommendation: `Immediate repair recommended based on standard municipal field guidelines.`
            }}
          />

          <LocationCard
            address={task.location}
            latitude={task.latitude}
            longitude={task.longitude}
            distance="2.4 km away"
          />

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" /> Citizen Contact
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-[10px] text-slate-500 font-semibold">Reporter Name</p>
                <p className="text-xs font-bold text-slate-900">{task.citizenName}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold">Assigned Date</p>
                <p className="text-xs font-semibold text-slate-700">{new Date(task.assignedDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white/95 backdrop-blur border-t border-slate-200/80 p-4 shadow-xl z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-slate-900">Task Status: <span className="text-blue-600">{task.status.replace('_', ' ')}</span></p>
            <p className="text-[11px] text-slate-500">Perform the action to update division records.</p>
          </div>

          <div className="flex-1 sm:flex-none flex justify-end">
            {task.status === 'ASSIGNED' && (
              <Button variant="primary" icon={CheckCircle2} onClick={handleAccept} fullWidth className="sm:w-auto px-6">
                Accept Task
              </Button>
            )}

            {task.status === 'ACCEPTED' && (
              <Button variant="primary" icon={Clock} onClick={handleStart} fullWidth className="sm:w-auto px-6">
                Start Task
              </Button>
            )}

            {(task.status === 'IN_PROGRESS' || task.status === 'OVERDUE') && (
              <Button variant="success" icon={UploadCloud} onClick={handleUploadProof} fullWidth className="sm:w-auto px-6">
                Upload Proof & Complete Task
              </Button>
            )}

            {task.status === 'COMPLETED' && (
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
