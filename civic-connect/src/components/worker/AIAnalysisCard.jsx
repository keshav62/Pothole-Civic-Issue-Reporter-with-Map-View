import React from 'react';
import { Sparkles, Activity, AlertTriangle, ShieldCheck, FileSearch, Info } from 'lucide-react';

export const AIAnalysisCard = ({
  analysis = {
    detectedCategory: 'Pothole',
    confidence: 94,
    severity: 'HIGH',
    recommendedDepartment: 'Road Maintenance',
    recommendation: 'Immediate repair recommended due to traffic density in the reported area.'
  }
}) => {
  if (!analysis) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-2xl border border-blue-100 p-5 sm:p-6 shadow-sm">

      {/* Header */}
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-blue-200/50">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-black text-blue-900 tracking-wide uppercase">AI Issue Analysis</h3>
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Automated Assessment</p>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <FileSearch className="w-3 h-3 text-blue-400" /> Detected Category
          </p>
          <p className="text-sm font-bold text-slate-900">{analysis.detectedCategory}</p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Activity className="w-3 h-3 text-blue-400" /> Confidence
          </p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-black text-blue-600">{analysis.confidence}%</p>
            <div className="flex-1 h-1.5 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${analysis.confidence}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-blue-400" /> Severity
          </p>
          <p className={`text-sm font-bold ${
            analysis.severity === 'CRITICAL' || analysis.severity === 'HIGH'
              ? 'text-red-600'
              : 'text-amber-600'
          }`}>
            {analysis.severity}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-blue-400" /> Dept. Match
          </p>
          <p className="text-sm font-bold text-slate-900 line-clamp-1">{analysis.recommendedDepartment}</p>
        </div>
      </div>

      {/* Recommendation Block */}
      <div className="bg-white/60 p-4 rounded-xl border border-blue-100/50 mb-4">
        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">
          AI Recommendation
        </p>
        <p className="text-sm text-slate-700 font-medium leading-relaxed">
          {analysis.recommendation}
        </p>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 text-[10px] text-slate-400 font-medium">
        <Info className="w-3 h-3 shrink-0 mt-0.5" />
        <p>AI analysis is an assistive recommendation based on uploaded evidence and may require human verification.</p>
      </div>

    </div>
  );
};
