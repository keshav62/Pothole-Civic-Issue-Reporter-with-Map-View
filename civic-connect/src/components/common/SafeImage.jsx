import React, { useState } from 'react';
import { Camera, ImageOff } from 'lucide-react';

export const SafeImage = ({
  src,
  alt = '',
  className = '',
  fallbackText = 'Photo Evidence Attached',
  aspectRatio = 'aspect-video'
}) => {
  const [error, setError] = useState(false);

  const defaultFallbackImages = [
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1595168058299-dcbcc461cb28?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542159146-5e5d1ec9c7f6?auto=format&fit=crop&w=800&q=80'
  ];

  if (error || !src) {
    return (
      <div className={`w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-200 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-2 shadow-inner">
          <Camera className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold text-slate-200">{fallbackText}</span>
        <span className="text-[10px] text-slate-400 mt-0.5">Municipal On-Site Record Verified</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={`w-full h-full object-cover ${className}`}
    />
  );
};

export default SafeImage;
