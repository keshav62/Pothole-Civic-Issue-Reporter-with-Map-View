import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCivic } from '../../context/CivicContext';
import { IssueStatus } from '../../components/issues/IssueStatus';
import { IssuePriority } from '../../components/issues/IssuePriority';
import { IssueTimeline } from '../../components/issues/IssueTimeline';
import { IssueMap } from '../../components/map/IssueMap';
import { AssignWorkerModal } from '../../components/issues/AssignWorkerModal';
import { ImageUploader } from '../../components/common/ImageUploader';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import {
  ShieldCheck,
  XCircle,
  UserPlus,
  Flame,
  MapPin,
  Calendar,
  User,
  Building2,
  Clock,
  ArrowLeft,
  Image as ImageIcon
} from 'lucide-react';

export const AdminIssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { issues, verifyIssue, rejectIssue, escalateIssue, updateIssuePriority, updateIssueStatus, updateIssueImages } = useCivic();
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const issue = issues.find(i => i.id === id) || issues[0];

  const [beforeImage, setBeforeImage] = useState(issue?.images?.before || '');
  const [afterImage, setAfterImage] = useState(issue?.images?.after || '');

  if (!issue) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Issue Not Found</h2>
        <Button className="mt-4" onClick={() => navigate('/admin/issues')}>Back to Issues</Button>
      </div>
    );
  }

  const handleImageUpdate = (type, newUrl) => {
    if (type === 'before') {
      setBeforeImage(newUrl);
      updateIssueImages(issue.id, newUrl, afterImage);
    }
    if (type === 'after') {
      setAfterImage(newUrl);
      updateIssueImages(issue.id, beforeImage, newUrl);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-semibold mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-mono font-black text-blue-600">{issue.id}</h1>
            <IssuePriority priority={issue.priority} />
            <IssueStatus status={issue.status} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">{issue.title}</h2>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          {issue.status === 'REPORTED' && (
            <Button variant="success" size="sm" icon={ShieldCheck} onClick={() => verifyIssue(issue.id)}>
              Verify Issue
            </Button>
          )}

          <Button variant="primary" size="sm" icon={UserPlus} onClick={() => setAssignModalOpen(true)}>
            Assign Worker
          </Button>

          <Button variant="danger" size="sm" icon={Flame} onClick={() => escalateIssue(issue.id)}>
            Escalate
          </Button>

          {issue.status !== 'REJECTED' && issue.status !== 'RESOLVED' && (
            <Button variant="outline" size="sm" icon={XCircle} onClick={() => rejectIssue(issue.id)}>
              Reject
            </Button>
          )}
        </div>
      </div>

      {/* Main Split Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLS: Metadata & Evidence */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Overview Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Issue Specifications</h3>
            
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
              {issue.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs pt-2">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{issue.category}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Department</span>
                <span className="font-bold text-slate-800 mt-0.5 block flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  {issue.department}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Ward Jurisdiction</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{issue.ward}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Worker</span>
                <span className="font-bold text-slate-800 mt-0.5 block flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  {issue.assignedWorker || 'Unassigned'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Reported Date</span>
                <span className="font-bold text-slate-800 mt-0.5 block flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {issue.reportedDate}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">SLA Target</span>
                <span className="font-bold text-slate-800 mt-0.5 block flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {issue.slaHours} hours
                </span>
              </div>
            </div>
          </div>

          {/* Evidence Photos Gallery */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-600" /> Photo Evidence Gallery
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ImageUploader
                image={beforeImage || issue.images.before}
                onImageChange={(img) => handleImageUpdate('before', img)}
                label="BEFORE REPAIR EVIDENCE"
                placeholderText="Select or drag & drop before photo"
              />

              <ImageUploader
                image={afterImage || issue.images.after}
                onImageChange={(img) => handleImageUpdate('after', img)}
                label="AFTER REPAIR EVIDENCE PROOF"
                placeholderText="Select or drag & drop after repair photo"
              />
            </div>

            {issue.workNotes && (
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 mt-2">
                <strong className="block mb-1">Field Worker Resolution Notes:</strong>
                <p>{issue.workNotes}</p>
              </div>
            )}
          </div>

          {/* Interactive Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <IssueTimeline timeline={issue.timeline} />
          </div>
        </div>

        {/* RIGHT COL: Map Location */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" /> Geographic Location
              </h3>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
              </span>
            </div>

            <p className="text-xs font-medium text-slate-800 bg-slate-50 p-2.5 rounded border border-slate-100">
              {issue.address}
            </p>

            <IssueMap
              issues={[issue]}
              center={[issue.latitude, issue.longitude]}
              zoom={15}
              height="350px"
              rolePrefix="/admin"
            />
          </div>

          {/* Inline Status Override */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quick Overrides</h3>
            <Select
              label="Update Priority"
              value={issue.priority}
              onChange={(e) => updateIssuePriority(issue.id, e.target.value)}
              options={['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']}
            />

            <Select
              label="Update Status"
              value={issue.status}
              onChange={(e) => updateIssueStatus(issue.id, e.target.value)}
              options={['REPORTED', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']}
            />
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      <AssignWorkerModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        issue={issue}
      />
    </div>
  );
};
