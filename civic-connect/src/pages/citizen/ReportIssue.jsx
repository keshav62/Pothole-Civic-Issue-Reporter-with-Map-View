import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCivic } from '../../context/CivicContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ImageUploader } from '../../components/common/ImageUploader';
import {
  MapPin,
  Camera,
  FileText,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  AlertOctagon,
  Navigation,
  ShieldCheck
} from 'lucide-react';

export const ReportIssue = () => {
  const navigate = useNavigate();
  const { showToast } = useCivic();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Road Maintenance');
  const [ward, setWard] = useState('Ward 15');
  const [address, setAddress] = useState('MG Road, Near Central Bus Stand, Ward 15');
  const [priority, setPriority] = useState('MEDIUM');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const handleAutoLocate = () => {
    setIsLocating(true);
    setTimeout(() => {
      setAddress('Current GPS: 28.6139° N, 77.2090° E (MG Road, Ward 15)');
      setIsLocating(false);
      showToast('GPS Location automatically captured!', 'success');
    }, 800);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) {
      showToast('Please provide a title and detailed description', 'warning');
      return;
    }

    const complaintId = `CC-${Math.floor(1000 + Math.random() * 9000)}`;
    showToast(`Complaint ${complaintId} submitted to Municipal HQ!`, 'success');
    navigate('/citizen/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pb-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-slate-600 font-bold hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Step {step} of 4
        </span>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>1. Location</span>
          <span>2. Category & Details</span>
          <span>3. Photo Evidence</span>
          <span>4. Review & Submit</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: Location */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold">Step 1: Incident Location</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-blue-900">Auto-Detect Current GPS Coordinates</p>
                <p className="text-[11px] text-blue-700 mt-0.5">Use phone / browser location services</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="primary"
                icon={Navigation}
                loading={isLocating}
                onClick={handleAutoLocate}
              >
                Auto-Locate GPS
              </Button>
            </div>

            <Select
              label="Municipal Ward Jurisdiction"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              options={['Ward 15', 'Ward 8', 'Ward 12', 'Ward 4', 'Ward 22', 'Ward 7']}
            />

            <Input
              label="Full Address / Landmark"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. MG Road, Near Bus Stand, Ward 15"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              variant="primary"
              icon={ArrowRight}
              onClick={() => setStep(2)}
            >
              Continue to Category
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Category & Severity */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
            <AlertOctagon className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold">Step 2: Issue Category & Priority</h2>
          </div>

          <div className="space-y-4">
            <Input
              label="Issue Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Large Deep Pothole Blocking Traffic"
            />

            <Select
              label="Select Issue Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'Road Maintenance', label: 'Road Maintenance (Potholes / Asphalt)' },
                { value: 'Sanitation', label: 'Sanitation (Garbage Overflow / Waste)' },
                { value: 'Electrical', label: 'Electrical (Streetlights / Cables)' },
                { value: 'Water Supply', label: 'Water Supply (Pipe Leaks / Contamination)' },
                { value: 'Drainage', label: 'Drainage (Clogged Drains / Waterlogging)' },
                { value: 'Parks', label: 'Parks & Trees (Fallen Branches)' },
                { value: 'Traffic', label: 'Traffic & Signals (Damaged Signs)' }
              ]}
            />

            <Select
              label="Perceived Severity"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={[
                { value: 'CRITICAL', label: 'Critical (Immediate Hazard / Blocking Traffic)' },
                { value: 'HIGH', label: 'High (Severe Damage / Urgent Repair)' },
                { value: 'MEDIUM', label: 'Medium (Standard Issue)' },
                { value: 'LOW', label: 'Low (Minor Concern)' }
              ]}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button variant="primary" icon={ArrowRight} onClick={() => setStep(3)}>
              Continue to Photo Upload
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Photo Evidence Upload */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
            <Camera className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold">Step 3: Upload Photo Evidence</h2>
          </div>

          <ImageUploader
            image={image}
            onImageChange={(img) => setImage(img)}
            label="SELECT OR CAPTURE INCIDENT PHOTO"
            placeholderText="Upload photo of the pothole or damaged area"
          />

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button variant="primary" icon={ArrowRight} onClick={() => setStep(4)}>
              Continue to Review
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Review & Submit */}
      {step === 4 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold">Step 4: Detailed Description & Submission</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-slate-600">Detailed Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about size of pothole, traffic hazard, exact landmark, etc."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Summary Review Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Report Summary Review</span>
              <p><strong>Title:</strong> {title || 'Pothole Report'}</p>
              <p><strong>Category:</strong> {category} ({priority} Priority)</p>
              <p><strong>Location:</strong> {address} ({ward})</p>
              {image && <p className="text-emerald-600 font-bold">✓ Photo evidence attached</p>}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
            <Button
              type="button"
              variant="success"
              icon={CheckCircle2}
              className="py-3 px-6 text-xs font-bold shadow-md"
              onClick={handleFinalSubmit}
            >
              Submit Report to Municipal HQ
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
