import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorker } from '../../context/WorkerContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { IssuePriority } from '../../components/issues/IssuePriority';
import { Camera, Image as ImageIcon, CheckCircle2, X, ArrowLeft, UploadCloud, FileText, Clock } from 'lucide-react';
import { ToastContext } from '../../context/ToastContext';

export const UploadProof = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, submitProof } = useWorker();

  // Find task from mock data
  const task = tasks.find(t => t.id === id) || tasks[0];
  const { showToast } = React.useContext(ToastContext);

  const [afterImagePreview, setAfterImagePreview] = useState(null);
  const [repairNotes, setRepairNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const fileInputRef = useRef(null);

  // Update clock every second for completion timestamp
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!task) return null;

  const handleImageChange = (e) => {
    setError('');
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAfterImagePreview(imageUrl);
    }
  };

  const handleRemoveImage = () => {
    setAfterImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!afterImagePreview) {
      setError('Please select or capture an After Repair image to proceed.');
      return;
    }

    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      submitProof(task.id, afterImagePreview, repairNotes);
      showToast("Resolution proof submitted successfully!", "success");
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  // SUCCESS STATE
  if (isSuccess) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto min-h-[80vh] flex flex-col justify-center">
        <div className="bg-emerald-50 rounded-3xl border border-emerald-200 p-8 sm:p-12 text-center flex flex-col items-center shadow-lg shadow-emerald-100">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-emerald-900 mb-2">Resolution Submitted</h2>
          <p className="text-emerald-700 font-medium mb-8">
            Task {task.id} has been marked as Completed. Your proof and notes have been securely saved to the department database.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Button variant="outline" onClick={() => navigate(`/worker/tasks/${task.id}`)} className="bg-white hover:bg-emerald-50 border-emerald-200 text-emerald-800">
              View Task Details
            </Button>
            <Button variant="success" icon={CheckCircle2} onClick={() => navigate('/worker/tasks')}>
              Return to Tasks
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // UPLOAD FORM STATE
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6 pb-20">

      {/* Topbar navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Task Details
      </button>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Upload Resolution Proof</h1>
        <p className="text-sm text-slate-500 mt-1">Provide evidence that the issue has been completely resolved.</p>
      </div>

      {/* 1. Issue Summary */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="bg-slate-100 text-slate-800 text-xs font-black px-2.5 py-1 rounded-md">
              {task.id}
            </span>
            <Badge variant="neutral" className="uppercase tracking-wider text-[10px]">
              {task.category}
            </Badge>
          </div>
          <h3 className="text-base font-bold text-slate-900 leading-tight">
            {task.title}
          </h3>
        </div>
        <div className="shrink-0">
          <IssuePriority priority={task.priority} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* 2 & 3 & 4. Before/After Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Before Image */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Before Repair</label>
              <div className="aspect-square sm:aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200">
                <img
                  src={task.beforeImage || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"}
                  alt="Before repair"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-slate-900/70 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1.5">
                  <FileText className="w-3 h-3" /> ORIGINAL
                </div>
              </div>
            </div>

            {/* After Image Upload / Preview */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                <span>After Repair <span className="text-red-500">*</span></span>
                {afterImagePreview && <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => fileInputRef.current?.click()}>Change</span>}
              </label>

              {!afterImagePreview ? (
                <div
                  className={`aspect-square sm:aspect-[4/3] bg-slate-50 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-slate-100 ${error ? 'border-red-300' : 'border-slate-300'}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                    <Camera className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Take Photo or Upload</span>
                  <span className="text-[10px] text-slate-400 mt-1 max-w-[200px] text-center">Please ensure the repair is clearly visible</span>
                </div>
              ) : (
                <div className="aspect-square sm:aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden relative border border-blue-200 ring-2 ring-blue-500/20">
                  <img
                    src={afterImagePreview}
                    alt="After repair"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> READY TO SUBMIT
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 text-slate-700 hover:text-red-600 rounded-full flex items-center justify-center shadow-sm backdrop-blur"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              {error && <p className="text-xs font-semibold text-red-500 mt-1">{error}</p>}
            </div>
          </div>

          {/* Repair Notes */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Repair Notes (Optional)</label>
            <textarea
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              rows="3"
              placeholder="Describe the materials used, challenges faced, or any follow-up required by the department..."
              value={repairNotes}
              onChange={(e) => setRepairNotes(e.target.value)}
            ></textarea>
          </div>

          {/* Completion Timestamp */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <Clock className="w-4 h-4 text-slate-400" />
            Completion Timestamp: <span className="text-slate-800">{currentTime.toLocaleString()}</span>
          </div>

        </div>

        {/* Submit Button - Mobile Friendly Fixed Bottom or inline on desktop */}
        <div className="fixed bottom-0 left-0 right-0 md:static md:bg-transparent bg-white border-t border-slate-200 md:border-t-0 p-4 md:p-0 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] md:shadow-none z-40">
          <Button
            type="submit"
            variant="success"
            icon={UploadCloud}
            fullWidth
            disabled={isSubmitting}
            className="py-3.5 shadow-md text-base"
          >
            {isSubmitting ? 'Uploading Proof...' : 'Submit Resolution'}
          </Button>
        </div>

      </form>
    </div>
  );
};

export default UploadProof;
