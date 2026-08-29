import React, { useState } from 'react';
import { Upload, X, Camera } from 'lucide-react';

export const ImageUploader = ({
  value,
  onChange,
  label = 'Upload Photo Evidence',
  helperText = 'JPG, PNG, or HEIC up to 10MB'
}) => {
  const [preview, setPreview] = useState(value || '');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result;
      setPreview(dataUrl);
      onChange?.(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview('');
    onChange?.(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
        {label}
      </label>

      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 h-52">
          <img src={preview} alt="Uploaded preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="block w-full border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/20 transition-all">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Camera className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-700 mb-0.5">Click or drag image to upload</p>
          <p className="text-xs text-slate-400">{helperText}</p>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
      )}
    </div>
  );
};

export default ImageUploader;
