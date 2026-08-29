import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCivic } from '../context/CivicContext';
import { GoogleAuthModal } from '../components/auth/GoogleAuthModal';
import {
  Shield,
  User,
  Mail,
  Lock,
  Building2,
  HardHat,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export const Signup = () => {
  const { signupWithGmail } = useAuth();
  const { showToast } = useCivic();
  const navigate = useNavigate();

  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'CITIZEN',
    department: 'Road Maintenance',
    ward: 'Ward 12 - Andheri East',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        const newUser = signupWithGmail({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '+91 98765 43210',
          role: formData.role,
          department: formData.role === 'CITIZEN' ? 'Public Resident' : formData.department,
          ward: formData.ward
        });

        showToast(`Account created successfully! Welcome, ${newUser.name}`, 'success');

        if (newUser.role === 'SUPER_ADMIN') navigate('/admin/dashboard');
        else if (newUser.role === 'DEPARTMENT_ADMIN') navigate('/department/dashboard');
        else if (newUser.role === 'FIELD_WORKER') navigate('/worker/dashboard');
        else navigate('/citizen/dashboard');
      } catch (err) {
        setError('Failed to create account. Please try again.');
        showToast('Registration failed', 'error');
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Ambient Glow & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,.2),transparent_35rem)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-indigo-600" />

      {/* Top Glass Navigation */}
      <header className="absolute top-0 left-0 right-0 h-16 px-4 sm:px-8 flex items-center justify-between z-20">
        <Link to="/landing" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-blue-600 group-hover:bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0 transition-colors">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-base tracking-tight group-hover:text-blue-300 transition-colors">
            CivicConnect
          </span>
        </Link>

        <Link
          to="/login"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </header>

      {/* Main Form Container */}
      <div className="relative z-10 max-w-lg w-full mt-12 mb-8">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>MUNICIPAL NETWORK REGISTRATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Create Your Account
            </h1>
            <p className="text-xs text-slate-400">
              Join the municipal digital network to report and manage civic issues
            </p>
          </div>

          {/* 1. Gmail / Google Sign Up Button */}
          <button
            type="button"
            onClick={() => setGoogleModalOpen(true)}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-bold px-4 py-3 rounded-xl shadow-md transition-all text-xs cursor-pointer border border-slate-200"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sign up with Gmail / Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              OR COMPLETE FORM BELOW
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {/* 2. Registration Form */}
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Amit Patel"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="user@example.com"
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Account Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none transition-all cursor-pointer"
                >
                  <option value="CITIZEN">Citizen (Public Resident)</option>
                  <option value="DEPARTMENT_ADMIN">Department Admin (Division Control)</option>
                  <option value="FIELD_WORKER">Field Worker (Ground Operations)</option>
                  <option value="SUPER_ADMIN">Super Admin (Municipal HQ)</option>
                </select>
              </div>
            </div>

            {/* Department Division ONLY shown for Official Department Admin or Field Worker Roles */}
            {(formData.role === 'DEPARTMENT_ADMIN' || formData.role === 'FIELD_WORKER') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Department Division *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none transition-all cursor-pointer"
                  >
                    <option value="Road Maintenance">Road Maintenance</option>
                    <option value="Sanitation">Sanitation</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Water Supply">Water Supply</option>
                    <option value="Drainage">Drainage</option>
                    <option value="Parks & Recreation">Parks & Recreation</option>
                    <option value="Traffic Control">Traffic Control</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Assigned Ward Zone</label>
                  <input
                    type="text"
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    placeholder="e.g. Ward 12 - Andheri East"
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Residential Ward for Citizen */}
            {formData.role === 'CITIZEN' && (
              <div className="animate-in fade-in duration-150">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Residential Ward / Neighborhood (Optional)</label>
                <input
                  type="text"
                  name="ward"
                  value={formData.ward}
                  onChange={handleChange}
                  placeholder="e.g. Ward 12 - Andheri East"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Create Account & Access Platform</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>Already have an account? </span>
            <Link to="/login" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
              Log In here
            </Link>
          </div>
        </div>
      </div>

      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        defaultMode="SIGN_UP"
      />

      {/* Security Footer */}
      <div className="relative text-center text-slate-500 text-xs flex items-center justify-center gap-2 pb-6">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>Official Government Grade Enterprise System • Municipal Administration Authority Portal</span>
      </div>
    </div>
  );
};

export default Signup;
