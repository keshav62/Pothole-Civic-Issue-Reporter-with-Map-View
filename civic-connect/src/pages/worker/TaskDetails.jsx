import React, { useState } from 'react';
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

  // Timeline definition
  const timelineSteps = [
    { label: 'Reported', status: 'REPORTED', date: task.assignedDate },
    { label: 'Verified', status: 'VERIFIED', date: task.assignedDate },
    { label: 'Assigned', status: 'ASSIGNED', date: task.assignedDate },
    { label: 'Accepted', status: 'ACCEPTED', date: task.status === 'ACCEPTED' || task.status === 'IN_PROGRESS' || task.status === 'COMPLETED' ? new Date().toISOString() : null },
    { label: 'In Progress', status: 'IN_PROGRESS', date: task.status === 'IN_PROGRESS' || task.status === 'COMPLETED' ? new Date().toISOString() : null },
    { label: 'Completed', status: 'COMPLETED', date: task.status === 'COMPLETED' ? new Date().toISOString() : null }
  ];

  // Determine active step index
  let activeStepIndex = 2; // ASSIGNED
  if (task.status === 'ACCEPTED') activeStepIndex = 3;
  if (task.status === 'IN_PROGRESS') activeStepIndex = 4;
  if (task.status === 'COMPLETED') activeStepIndex = 5;

  // Handlers for action buttons
  const handleAccept = () => {
    if (window.confirm("Are you sure you want to accept this task?")) {
      updateTaskStatus(task.id, 'ACCEPTED');
      showToast("Task accepted successfully!", "success");
    }
  };

  const handleStart = () => {
    if (window.confirm("Are you at the location and ready to start the task?")) {
      updateTaskStatus(task.id, 'IN_PROGRESS');
      showToast("Task started. Timeline updated.", "success");
    }
  };

  const handleUploadProof = () => {
    navigate(`/worker/tasks/${task.id}/upload`);
  };

  const handleViewResolution = () => {
    showToast("Viewing resolution details...", "info");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 pb-20">

      {/* Topbar navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Tasks
      </button>

      {/* 1. Issue Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-slate-100 text-slate-800 text-xs font-black px-2.5 py-1 rounded-md">
              {task.id}
            </span>
            <Badge variant="neutral" className="uppercase tracking-wider text-[10px]">
              {task.category}
            </Badge>
          </div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight">
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

          {/* 2. Issue Image (Show Before & After if completed) */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className={`aspect-video sm:aspect-auto sm:h-full w-full bg-slate-100 relative ${task.afterImage ? 'border-b sm:border-b-0 sm:border-r border-slate-200' : 'sm:col-span-2 aspect-video'}`}>
                <img
                  src={task.beforeImage || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"}
                  alt="Before"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                  <FileText className="w-3 h-3" /> Before Repair
                </div>
              </div>
              {task.afterImage && (
                <div className="aspect-video sm:aspect-auto sm:h-full w-full bg-emerald-50 relative">
                  <img
                    src={task.afterImage}
                    alt="After"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-3 h-3" /> After Repair
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Description & Notes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Description</h3>
              <p className="text-slate-700 leading-relaxed text-sm">
                {task.description}
              </p>
            </div>
            {task.repairNotes && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Resolution Notes
                </h3>
                <p className="text-slate-700 leading-relaxed text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {task.repairNotes}
                </p>
              </div>
            )}
          </div>

              {/* 7. Issue Timeline */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Issue Timeline</h3>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {timelineSteps.map((step, index) => {
                    const isActive = index === activeStepIndex;
                    const isCompleted = index < activeStepIndex;
                    const isPending = index > activeStepIndex;

                    return (
                      <div key={step.label} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                        {/* Icon */}
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 transition-colors ${
                          isActive ? 'bg-blue-500 text-white' :
                          isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> :
                           isActive ? <Clock className="w-4 h-4 animate-pulse" /> :
                           <div className="w-2 h-2 rounded-full bg-slate-400" />}
                        </div>

                        {/* Content */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-3 rounded-xl border border-slate-100 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-bold ${isActive ? 'text-blue-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                              {step.label}
                            </span>
                            {isActive && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">You are here</span>}
                          </div>
                          {step.date && (
                            <div className="text-[10px] text-slate-500 font-medium mt-1">
                              {new Date(step.date).toLocaleDateString()} at {new Date(step.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

          <ResolutionVerification task={task} />

        </div>

        {/* Right Column: Info Cards & Actions */}
        <div className="space-y-6">

          {/* AI Analysis (Mock) */}
          <AIAnalysisCard
            analysis={{
              detectedCategory: task.category,
              confidence: 94,
              severity: task.priority,
              recommendedDepartment: task.department,
              recommendation: `Immediate attention recommended based on the visual assessment of the ${task.category.toLowerCase()} report.`
            }}
          />

          {/* 4. Location Card */}
          <LocationCard
            address={task.location}
            latitude={task.latitude}
            longitude={task.longitude}
            distance="2.4 km away"
          />

          {/* 5. Citizen Information */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4" /> Reporter Info
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-[10px] text-slate-500 font-semibold">Name</p>
                <p className="text-sm font-bold text-slate-900">{task.citizenName}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold">Reported Date</p>
                <p className="text-sm font-semibold text-slate-700">{new Date(task.assignedDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* 6. Department Information */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-4 h-4" /> Department Info
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-[10px] text-slate-500 font-semibold">Responsible Dept.</p>
                <p className="text-sm font-bold text-slate-900">{task.department}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold">Assigned</p>
                  <p className="text-xs font-semibold text-slate-700">{new Date(task.assignedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold">Due By</p>
                  <p className={`text-xs font-bold ${task.status === 'OVERDUE' ? 'text-red-600' : 'text-slate-700'}`}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 8. Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-slate-900">Current Status: <span className="text-blue-600">{task.status.replace('_', ' ')}</span></p>
            <p className="text-xs text-slate-500">Perform the next required action to progress the task.</p>
          </div>

          <div className="flex-1 sm:flex-none flex justify-end">
            {task.status === 'ASSIGNED' && (
              <Button variant="primary" icon={CheckCircle2} onClick={handleAccept} fullWidth className="sm:w-auto px-8">
                Accept Task
              </Button>
            )}

            {task.status === 'ACCEPTED' && (
              <Button variant="primary" icon={Clock} onClick={handleStart} fullWidth className="sm:w-auto px-8">
                Start Task
              </Button>
            )}

            {task.status === 'IN_PROGRESS' && (
              <Button variant="success" icon={UploadCloud} onClick={handleUploadProof} fullWidth className="sm:w-auto px-8">
                Upload Proof & Resolve
              </Button>
            )}

            {task.status === 'COMPLETED' && (
              <Button variant="outline" icon={FileText} onClick={handleViewResolution} fullWidth className="sm:w-auto px-8">
                View Resolution
              </Button>
            )}

            {task.status === 'OVERDUE' && (
              <Button variant="danger" icon={UploadCloud} onClick={handleUploadProof} fullWidth className="sm:w-auto px-8">
                Upload Proof & Resolve (Overdue)
              </Button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default TaskDetails;
