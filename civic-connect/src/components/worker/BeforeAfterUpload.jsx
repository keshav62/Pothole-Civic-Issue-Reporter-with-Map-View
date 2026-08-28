import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, CheckCircle2, UploadCloud, X } from 'lucide-react';
import { Button } from '../common/Button';

export const BeforeAfterUpload = ({ beforeImage, onSubmit, onSuccess }) => {
  const [afterImagePreview, setAfterImagePreview] = useState(null);
  const [repairNotes, setRepairNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    setError('');
    const file = e.target.files?.[0];
    if (file) {
      // Create a fake local object URL for preview purposes (frontend only)
      const imageUrl = URL.createObjectURL(file);
      setAfterImagePreview(imageUrl);
    }
  };

  const handleRemoveImage = () => {
    setAfterImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Call parent handler to update global/parent state
      if (onSubmit) {
        onSubmit({
          afterImage: afterImagePreview,
          repairNotes
        });
      }
      
      if (onSuccess) {
        onSuccess();
      }
    }, 800);
  };

  if (isSuccess) {
    return (
      <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-emerald-900 mb-2">Proof Uploaded Successfully!</h3>
        <p className="text-emerald-700 text-sm max-w-md">
          Your before/after proof and notes have been securely saved. The task is now marked as Completed.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
      <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
        <UploadCloud className="w-5 h-5 text-blue-600" />
        Upload Completion Proof
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Before & After Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Before Image */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Before Repair</label>
            <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200">
              <img 
                src={beforeImage || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"} 
                alt="Before repair" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-slate-900/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                ORIGINAL
              </div>
            </div>
          </div>

          {/* After Image Upload / Preview */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">After Repair <span className="text-red-500">*</span></label>
            
            {!afterImagePreview ? (
              <div 
                className={`aspect-video bg-slate-50 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-slate-100 ${error ? 'border-red-300' : 'border-slate-300'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2">
                  <Camera className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-sm font-bold text-slate-700">Take Photo or Upload</span>
                <span className="text-[10px] text-slate-400 mt-1">Tap to select image</span>
              </div>
            ) : (
              <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden relative border border-blue-200 ring-2 ring-blue-500/20">
                <img 
                  src={afterImagePreview} 
                  alt="After repair" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/90 text-slate-700 hover:text-red-600 rounded-full flex items-center justify-center shadow-sm backdrop-blur"
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
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Repair Notes (Optional)</label>
          <textarea
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            rows="3"
            placeholder="Describe the materials used, challenges faced, or any follow-up required..."
            value={repairNotes}
            onChange={(e) => setRepairNotes(e.target.value)}
          ></textarea>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          variant="success" 
          icon={CheckCircle2} 
          fullWidth 
          disabled={isSubmitting}
          className="py-3 shadow-md"
        >
          {isSubmitting ? 'Uploading Proof...' : 'Submit Proof & Resolve Task'}
        </Button>

      </form>
    </div>
  );
};
