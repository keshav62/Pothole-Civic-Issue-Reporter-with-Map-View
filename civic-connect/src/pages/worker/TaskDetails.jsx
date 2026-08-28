import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCivic } from '../../context/CivicContext';
import { IssueStatus } from '../../components/issues/IssueStatus';
import { IssuePriority } from '../../components/issues/IssuePriority';
import { IssueMap } from '../../components/map/IssueMap';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  Clock,
  MapPin,
  Navigation,
  Play,
  CheckCircle2,
  Upload,
  ArrowLeft,
  Camera,
  FileText,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { issues, startTask, completeTask, showToast } = useCivic();

  const issue = issues.find(i => i.id === id) || issues[0];

  // Work Completion Form State
  const [beforeImage, setBeforeImage] = useState(issue?.images?.before || '');
  const [afterImage, setAfterImage] = useState(issue?.images?.after || '');
  const [workNotes, setWorkNotes] = useState(
    issue?.workNotes || 'Pothole filled with cold asphalt mix, leveled using heavy roller, and road surface sealed.'
  );

  // Countdown timer simulation (05:42:12)
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!issue) return null;

  const isResolved = issue.status === 'RESOLVED';
  const isInProgress = issue.status === 'IN_PROGRESS';

  const handleStartWork = () => {
    startTask(issue.id);
  };

  const handleCompleteWork = (e) => {
    e.preventDefault();
    if (!afterImage) {
      // Set realistic default after image if none provided
      const defaultAfter = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80";
      setAfterImage(defaultAfter);
      completeTask(issue.id, beforeImage, defaultAfter, workNotes);
    } else {
      completeTask(issue.id, beforeImage, afterImage, workNotes);
    }
  };

  return (
    <div className="space-y-4">
      {/* Navigation Topbar */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-xs text-slate-600 font-bold hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tasks
        </button>

        <span className="font-mono font-bold text-xs text-blue-600">{issue.id}</span>
      </div>

      {/* SLA Countdown Timer Card */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-md border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">SLA Countdown Timer</span>
          <div className="flex items-center gap-1 font-mono text-2xl font-black text-amber-400 mt-0.5">
            <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
            <span>
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="text-right">
          <IssuePriority priority={issue.priority} />
          <div className="mt-1">
            <IssueStatus status={issue.status} />
          </div>
        </div>
      </div>

      {/* Main Task Information */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-base font-black text-slate-900">{issue.title}</h2>
        <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">{issue.description}</p>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-medium">{issue.address}</span>
        </div>

        <div className="pt-2 flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={Navigation}
            className="flex-1"
            onClick={() => window.open(`https://maps.google.com/?q=${issue.latitude},${issue.longitude}`, '_blank')}
          >
            Google Maps Navigate
          </Button>

          {!isInProgress && !isResolved && (
            <Button size="sm" variant="success" icon={Play} className="flex-1" onClick={handleStartWork}>
              Start Task
            </Button>
          )}
        </div>
      </div>

      {/* Map Preview */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden p-2">
        <IssueMap issues={[issue]} center={[issue.latitude, issue.longitude]} zoom={15} height="220px" rolePrefix="/worker" />
      </div>

      {/* WORK COMPLETION WORKFLOW FORM */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> Work Completion Verification
          </h3>
          {isResolved && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              ✓ RESOLVED & VERIFIED
            </span>
          )}
        </div>

        <form onSubmit={handleCompleteWork} className="space-y-4">
          {/* Step 1 & 3: Before / After Photo Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Before Photo */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-slate-600">Step 1: Before Repair Photo</label>
              <div className="aspect-video rounded-lg overflow-hidden border border-slate-300 relative bg-slate-100">
                <img src={beforeImage || issue.images.before} alt="Before" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  BEFORE
                </span>
              </div>
            </div>

            {/* After Photo Upload/Preview */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-slate-600">Step 2: After Repair Evidence Photo</label>
              <div className="aspect-video rounded-lg overflow-hidden border-2 border-dashed border-blue-400 relative bg-blue-50/30 flex flex-col items-center justify-center text-center p-3">
                {afterImage || issue.images.after ? (
                  <>
                    <img src={afterImage || issue.images.after} alt="After" className="w-full h-full object-cover rounded" />
                    <span className="absolute bottom-2 left-2 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      AFTER REPAIR PROOF
                    </span>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Camera className="w-8 h-8 text-blue-500 mx-auto animate-bounce" />
                    <p className="text-xs text-slate-600 font-bold">Snap or Upload Proof Photo</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const sampleAfter = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80";
                        setAfterImage(sampleAfter);
                        showToast('Work completion photo captured!', 'success');
                      }}
                    >
                      Use Camera / Upload Sample
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 3: Work Notes Entry */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase text-slate-600">Step 3: Field Operations Log & Work Notes</label>
            <textarea
              rows={3}
              value={workNotes}
              onChange={(e) => setWorkNotes(e.target.value)}
              placeholder="Describe materials used, machinery deployed, and resolution status..."
              className="w-full p-3 rounded-lg border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Submit Completion Button */}
          {!isResolved ? (
            <Button
              type="submit"
              variant="success"
              className="w-full py-3 text-sm font-bold shadow-md"
              icon={CheckCircle2}
            >
              Submit Completion & Mark as Resolved
            </Button>
          ) : (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-xs text-emerald-900 font-bold">
              🎉 Task completed successfully! Resolution logged in HQ database.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
