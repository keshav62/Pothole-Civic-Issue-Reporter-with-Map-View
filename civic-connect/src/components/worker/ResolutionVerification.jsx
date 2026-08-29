import React, { useState } from 'react';
import { CheckCircle2, Clock, XCircle, User, Calendar, FileText, Camera } from 'lucide-react';
import { Button } from '../common/Button';

export const ResolutionVerification = ({ task }) => {
  // Mock states for citizen verification
  // Options: 'PENDING', 'CONFIRMED', 'REJECTED'
  const [verificationStatus, setVerificationStatus] = useState('PENDING');

  if (task.status !== 'COMPLETED') return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
      <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div>
          <h3 className="text-lg font-black text-slate-900">Resolution Submitted</h3>
          <p className="text-sm text-slate-500 mt-1">Review the provided repair evidence.</p>
        </div>

        {/* Verification Status Badge */}
        {verificationStatus === 'PENDING' && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold animate-pulse">
            <Clock className="w-4 h-4" /> Pending Citizen Verification
          </div>
        )}
        {verificationStatus === 'CONFIRMED' && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" /> Citizen Confirmed
          </div>
        )}
        {verificationStatus === 'REJECTED' && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-bold">
            <XCircle className="w-4 h-4" /> Citizen Rejected
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
            <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
              <img
                src={task.beforeImage || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"}
                alt="Before"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase">
              <CheckCircle2 className="w-4 h-4" /> After Repair
            </div>
            <div className="aspect-video bg-emerald-50 rounded-xl overflow-hidden border border-emerald-200">
              <img
                src={task.afterImage || "https://images.unsplash.com/photo-1595168058299-dcbcc461cb28?auto=format&fit=crop&w=800&q=80"}
                alt="After"
                className="w-full h-full object-cover"
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
              <p className="text-sm text-red-600 mt-1">Citizen reported that the issue still exists. Please revisit the site and provide further updates.</p>
            </div>
          </div>
        )}

        {/* Mock Action Buttons (For Demonstration) */}
        {verificationStatus === 'PENDING' && (
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <p className="text-xs text-slate-400 mr-auto flex items-center">
              (Mock actions to simulate citizen response)
            </p>
            <Button variant="danger" size="sm" onClick={() => setVerificationStatus('REJECTED')}>Simulate Reject</Button>
            <Button variant="success" size="sm" onClick={() => setVerificationStatus('CONFIRMED')}>Simulate Confirm</Button>
          </div>
        )}
      </div>
    </div>
  );
};
