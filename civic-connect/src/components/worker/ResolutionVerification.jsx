import React, { useState } from 'react';
import { CheckCircle2, Clock, XCircle, User, Calendar, FileText, Camera } from 'lucide-react';
import { Button } from '../common/Button';
import { SafeImage } from '../common/SafeImage';

export const ResolutionVerification = ({ task }) => {
  // Mock states for citizen verification
  // Options: 'PENDING', 'CONFIRMED', 'REJECTED'
  const [verificationStatus, setVerificationStatus] = useState('PENDING');

  if (task.status !== 'COMPLETED') return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden mt-6">
      <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div>
          <h3 className="text-base font-black text-slate-900">Resolution Submitted</h3>
          <p className="text-xs text-slate-500 mt-0.5">Review the provided repair evidence.</p>
        </div>

        {/* Verification Status Badge */}
        {verificationStatus === 'PENDING' && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold animate-pulse">
            <Clock className="w-3.5 h-3.5" /> Pending Citizen Verification
          </div>
        )}
        {verificationStatus === 'CONFIRMED' && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Citizen Confirmed
          </div>
        )}
        {verificationStatus === 'REJECTED' && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-bold">
            <XCircle className="w-3.5 h-3.5" /> Citizen Rejected
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Before / After Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase">
              <Camera className="w-4 h-4 text-slate-400" /> Before Repair
            </div>
            <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-200/80">
              <SafeImage
                src={task.beforeImage}
                alt="Before"
                fallbackText="Before Repair Evidence"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase">
              <CheckCircle2 className="w-4 h-4" /> After Repair
            </div>
            <div className="aspect-video bg-emerald-950 rounded-xl overflow-hidden border border-emerald-200">
              <SafeImage
                src={task.afterImage}
                alt="After"
                fallbackText="After Repair Verification"
              />
            </div>
          </div>
        </div>

        {/* Resolution Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resolved By</p>
                <p className="text-sm font-semibold text-slate-900">{task.workerName || 'Rahul Sharma'}</p>
                <p className="text-xs text-slate-500">Field Worker, {task.department}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completion Date</p>
                <p className="text-sm font-semibold text-slate-900">{new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2 text-slate-700">
              <FileText className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Repair Notes</h4>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {task.repairNotes || "Issue has been resolved successfully using standard department procedures. Area cleaned and secured."}
            </p>
          </div>
        </div>

        {/* Rejection Alert */}
        {verificationStatus === 'REJECTED' && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-800">Resolution Rejected</h4>
              <p className="text-xs text-red-600 mt-1">Citizen reported that the issue still exists. Please revisit the site and provide further updates.</p>
            </div>
          </div>
        )}

        {/* Mock Action Buttons (For Demonstration) */}
        {verificationStatus === 'PENDING' && (
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              Simulate citizen verification response for testing:
            </p>
            <div className="flex items-center gap-2">
              <Button variant="danger" size="sm" onClick={() => setVerificationStatus('REJECTED')}>Simulate Reject</Button>
              <Button variant="success" size="sm" onClick={() => setVerificationStatus('CONFIRMED')}>Simulate Confirm</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResolutionVerification;
