import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCivic } from '../../context/CivicContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ImageUploader } from '../../components/common/ImageUploader';
import { ReportLocationMap } from '../../components/map/ReportLocationMap';
import { useLocation } from '../../hooks/useLocation';
import {
  MapPin,
  Camera,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  AlertOctagon,
  Navigation,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from 'lucide-react';

// ─── Nominatim reverse geocoding ─────────────────────────────────────────────
const reverseGeocode = async (lat, lng) => {
  const url =
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
  if (!res.ok) throw new Error(`Nominatim HTTP ${res.status}`);
  const data = await res.json();
  return data.display_name ?? null;
};

// ─── Small coordinate readout ─────────────────────────────────────────────────
const CoordDisplay = ({ coords, accuracy }) => (
  <div className="mt-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px] font-mono text-slate-500">
    <div className="flex gap-4">
      <div>
        <span className="text-slate-400">Latitude  </span>
        <span className="text-slate-700 font-semibold">{coords.lat.toFixed(6)}</span>
      </div>
      <div>
        <span className="text-slate-400">Longitude  </span>
        <span className="text-slate-700 font-semibold">{coords.lng.toFixed(6)}</span>
      </div>
    </div>
    {accuracy != null && (
      <div className="mt-0.5 text-slate-400">GPS accuracy: ±{accuracy} m</div>
    )}
  </div>
);

// ─── Main page component ──────────────────────────────────────────────────────
export const ReportIssue = () => {
  const navigate = useNavigate();
  const { showToast } = useCivic();

  // ── Multi-step form state ──────────────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Road Maintenance');
  const [ward, setWard] = useState('Ward 15');
  const [priority, setPriority] = useState('MEDIUM');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  // ── Location state ─────────────────────────────────────────────────────────
  // coords: { lat, lng } | null — never populated with fake values
  const [coords, setCoords] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [address, setAddress] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [locationError, setLocationError] = useState(null);
  // flyTo: true only when GPS fires — causes map to animate to new position
  const [flyTo, setFlyTo] = useState(false);

  // ── GPS hook (exposes loading state) ──────────────────────────────────────
  const { loading: gpsLoading } = useLocation();

  // ── Reverse geocoding (debounced) ─────────────────────────────────────────
  const geocodeTimer = useRef(null);

  const requestGeocode = useCallback((lat, lng) => {
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    geocodeTimer.current = setTimeout(async () => {
      setIsGeocoding(true);
      setAddress('Looking up address…');
      try {
        const resolved = await reverseGeocode(lat, lng);
        setAddress(resolved ?? 'Location captured, but address lookup failed.');
      } catch {
        setAddress('Location captured, but address lookup failed.');
      } finally {
        setIsGeocoding(false);
      }
    }, 500);
  }, []);

  // ── Position change handler shared by map click and drag ──────────────────
  const handlePositionChange = useCallback(
    (newPos) => {
      setFlyTo(false); // user-initiated move — do not fight their panning
      setCoords(newPos);
      setLocationError(null);
      requestGeocode(newPos.lat, newPos.lng);
    },
    [requestGeocode]
  );

  // ── GPS button handler ────────────────────────────────────────────────────
  const handleAutoLocate = useCallback(() => {
    if (!navigator.geolocation) {
      const msg = 'Geolocation is not supported by this browser.';
      setLocationError(msg);
      showToast(msg, 'error');
      return;
    }

    setLocationError(null);
    // gpsLoading from the hook is unused here because we call the API directly
    // in the component so we can update all state atomically.
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const acc =
          position.coords.accuracy != null
            ? Math.round(position.coords.accuracy)
            : null;

        setCoords(newCoords);
        setAccuracy(acc);
        setFlyTo(true); // animate map to GPS result
        setLocationError(null);
        showToast('GPS location captured successfully.', 'success');
        requestGeocode(newCoords.lat, newCoords.lng);
      },
      (err) => {
        let msg;
        switch (err.code) {
          case 1:
            msg =
              'Location permission was denied. Please allow location access in your browser settings.';
            break;
          case 2:
            msg = 'Your current location could not be determined.';
            break;
          case 3:
            msg = 'Location request timed out. Please try again.';
            break;
          default:
            msg = 'An unknown error occurred while retrieving your location.';
        }
        setLocationError(msg);
        showToast(msg, 'error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [showToast, requestGeocode]);

  // ── Step 1 → Step 2 transition with validation ────────────────────────────
  const handleContinueToStep2 = useCallback(() => {
    if (!coords) {
      const msg =
        'Please select the incident location on the map or use Auto-Locate GPS.';
      setLocationError(msg);
      showToast(msg, 'warning');
      return;
    }
    setStep(2);
  }, [coords, showToast]);

  // ── Final submit ──────────────────────────────────────────────────────────
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) {
      showToast('Please provide a title and detailed description.', 'warning');
      return;
    }

    // Data contract for future backend integration:
    // const reportLocation = {
    //   address,
    //   latitude: coords?.lat ?? null,
    //   longitude: coords?.lng ?? null,
    //   accuracy: accuracy ?? null,
    // };

    const complaintId = `CC-${Math.floor(1000 + Math.random() * 9000)}`;
    showToast(`Complaint ${complaintId} submitted to Municipal HQ!`, 'success');
    navigate('/citizen/dashboard');
  };

  // ──────────────────────────────────────────────────────────────────────────
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
          <span>2. Category &amp; Details</span>
          <span>3. Photo Evidence</span>
          <span>4. Review &amp; Submit</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* ── STEP 1: Incident Location ──────────────────────────────────────── */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">

          {/* Section header */}
          <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold">Step 1: Incident Location</h2>
          </div>

          <div className="space-y-4">

            {/* GPS auto-locate banner */}
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-blue-900">
                  Auto-Detect Current GPS Coordinates
                </p>
                <p className="text-[11px] text-blue-700 mt-0.5">
                  Use phone / browser location services
                </p>
              </div>
              <button
                type="button"
                disabled={gpsLoading}
                onClick={handleAutoLocate}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-colors shrink-0"
              >
                {gpsLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Locating…
                  </>
                ) : (
                  <>
                    <Navigation className="w-3.5 h-3.5" />
                    Auto-Locate GPS
                  </>
                )}
              </button>
            </div>

            {/* Location error */}
            {locationError && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{locationError}</p>
              </div>
            )}

            {/* Live map */}
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">
                Tap the map or drag the pin to mark the exact incident location
              </p>
              <ReportLocationMap
                position={coords}
                onPositionChange={handlePositionChange}
                flyTo={flyTo}
              />

              {/* Coordinate display */}
              {coords ? (
                <CoordDisplay coords={coords} accuracy={accuracy} />
              ) : (
                <p className="mt-2 text-[11px] text-center text-slate-400">
                  No location selected yet — tap the map or use Auto-Locate GPS
                </p>
              )}
            </div>

            {/* Resolved address display */}
            {coords && (
              <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wide mb-0.5">
                    Selected incident location
                  </p>
                  {isGeocoding ? (
                    <span className="flex items-center gap-1.5 text-xs text-slate-400 italic">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Looking up address…
                    </span>
                  ) : (
                    <p className="text-xs text-slate-700 leading-relaxed break-words">
                      {address || 'Address not yet resolved.'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Ward selector */}
            <Select
              label="Municipal Ward Jurisdiction"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              options={['Ward 15', 'Ward 8', 'Ward 12', 'Ward 4', 'Ward 22', 'Ward 7']}
            />

            {/* Editable address input */}
            <Input
              label="Full Address / Landmark"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. MG Road, Near Bus Stand, Ward 15"
            />

          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button variant="primary" icon={ArrowRight} onClick={handleContinueToStep2}>
              Continue to Category
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Category & Severity ───────────────────────────────────── */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
            <AlertOctagon className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold">Step 2: Issue Category &amp; Priority</h2>
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
                { value: 'Traffic', label: 'Traffic & Signals (Damaged Signs)' },
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
                { value: 'LOW', label: 'Low (Minor Concern)' },
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

      {/* ── STEP 3: Photo Evidence Upload ─────────────────────────────────── */}
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

      {/* ── STEP 4: Review & Submit ────────────────────────────────────────── */}
      {step === 4 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold">Step 4: Detailed Description &amp; Submission</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-slate-600">
                Detailed Description
              </label>
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
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Report Summary Review
              </span>
              <p><strong>Title:</strong> {title || 'Pothole Report'}</p>
              <p><strong>Category:</strong> {category} ({priority} Priority)</p>
              <p><strong>Location:</strong> {address || 'Not specified'} ({ward})</p>
              {coords && (
                <p className="font-mono text-[10px] text-slate-500">
                  Coordinates: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                </p>
              )}
              {image && (
                <p className="text-emerald-600 font-bold">✓ Photo evidence attached</p>
              )}
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
