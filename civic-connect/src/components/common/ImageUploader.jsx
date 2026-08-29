import React, { useRef } from 'react';
import { Upload, Camera, Image as ImageIcon, X, Check, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const ImageUploader = ({
  image,
  onImageChange,
  label = "Upload Photo Evidence",
  placeholderText = "Click to select photo from device or drag & drop",
  aspectRatio = "aspect-video"
}) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onImageChange('', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTriggerSelect = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Sample municipal repair proof photos for quick testing fallback
  const samplePresets = [
    { label: 'Road Repair', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80' },
    { label: 'Sanitation Cleaned', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80' },
    { label: 'Lighting Fixed', url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80' }
  ];

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">{label}</label>}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      <div className={`${aspectRatio} rounded-xl overflow-hidden border-2 border-dashed ${
        image ? 'border-emerald-500 bg-slate-900' : 'border-blue-400 bg-blue-50/40 hover:bg-blue-50/70'
      } relative flex flex-col items-center justify-center text-center p-3 transition-all group`}>
        {image ? (
          <>
            <img src={image} alt="Selected Upload" className="w-full h-full object-cover rounded-lg" />
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3 z-10">
              <Button
                size="sm"
                variant="primary"
                icon={RefreshCw}
                type="button"
                onClick={handleTriggerSelect}
              >
                Change Photo
              </Button>
              <Button
                size="sm"
                variant="danger"
                icon={X}
                type="button"
                onClick={handleRemove}
              >
                Remove
              </Button>
            </div>
            <span className="absolute bottom-2 left-2 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-md z-0">
              <Check className="w-3 h-3" /> PHOTO UPLOADED
            </span>
          </>
        ) : (
          <div className="space-y-2">
            <div
              onClick={handleTriggerSelect}
              className="cursor-pointer space-y-1.5"
            >
              <Upload className="w-8 h-8 text-blue-600 mx-auto animate-bounce" />
              <p className="text-xs font-bold text-slate-800">Select Image File from Device</p>
              <p className="text-[10px] text-slate-500">{placeholderText}</p>
            </div>

            <div className="pt-2 border-t border-slate-200/80">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">Or use sample photo preset:</p>
              <div className="flex flex-wrap items-center justify-center gap-1">
                {samplePresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onImageChange(preset.url, null);
                    }}
                    className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[10px] font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
