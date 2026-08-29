import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCivic } from '../context/CivicContext';
import { signInWithGooglePopup } from '../config/firebase';
import {
  Shield,
  Mail,
  Lock,
  LogIn,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const Login = () => {
  const { loginAs, loginWithGmail } = useAuth();
  const { showToast } = useCivic();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  // Form State - Default role is CITIZEN
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('CITIZEN');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const rolePaths = {
    CITIZEN: '/citizen/dashboard',
    SUPER_ADMIN: '/admin/dashboard',
    DEPARTMENT_ADMIN: '/department/dashboard',
    FIELD_WORKER: '/worker/dashboard'
  };

  // Google Single Sign-On Handler
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    showToast('Connecting to Google Single Sign-On...', 'info');

    const result = await signInWithGooglePopup();

    if (result.success && result.user) {
      const fbUser = result.user;
      const user = loginWithGmail(fbUser.email, selectedRole, fbUser.displayName, fbUser.photoURL);
      showToast(`Google SSO Authenticated: Welcome, ${user.name}!`, 'success');
      const targetPath = rolePaths[selectedRole] || '/citizen/dashboard';
      navigate(targetPath);
    } else {
      const errMsg = result.error || 'Google Sign-In was cancelled or failed';
      setError(`Google Auth Error: ${errMsg}`);
      showToast(`Google authentication failed: ${errMsg}`, 'error');
    }
    setLoading(false);
  };

  const handleFormLogin = (e) => {
    e.preventDefault();
    if (!emailOrUsername.trim() || !password) {
      setError('Please enter your email/username and password');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      loginAs(selectedRole);
      showToast(`Welcome back! Authenticated as ${selectedRole.replace('_', ' ')}`, 'success');
      const targetPath = rolePaths[selectedRole] || '/citizen/dashboard';
      navigate(targetPath);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Ambient Glow & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,.24),transparent_35rem)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-indigo-600" />

      {/* Top Glass Header */}
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
          to="/signup"
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
        >
          Create Account &rarr;
        </Link>
      </header>

      {/* Main Login Card */}
      <div className="relative z-10 max-w-md w-full mt-12 mb-8">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Header Title */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>SINGLE SIGN-ON & AUTHENTICATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-slate-400">
              Sign in with your Gmail or account credentials to access your municipal portal
            </p>
          </div>

          {/* 1. Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-bold px-4 py-3 rounded-xl shadow-md transition-all text-xs cursor-pointer border border-slate-200 disabled:opacity-50"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{loading ? 'Authenticating with Google...' : 'Continue with Gmail / Google'}</span>
          </button>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              OR SIGN IN WITH USERNAME & PASSWORD
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* 2. Username / Email & Password Login Form */}
          <form onSubmit={handleFormLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Email Address or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="citizen@gmail.com or username"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => showToast('Password reset link has been dispatched to your email', 'info')}
                  className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Access Persona Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none transition-all cursor-pointer font-medium"
              >
                <option value="CITIZEN">Citizen (Public Resident Portal)</option>
                <option value="SUPER_ADMIN">Super Admin (Headquarters Control)</option>
                <option value="DEPARTMENT_ADMIN">Department Admin (Division Operations)</option>
                <option value="FIELD_WORKER">Field Worker (Mobile Workstation)</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-800 text-blue-600 focus:ring-blue-500 bg-slate-950 cursor-pointer"
                />
                <span>Keep me signed in</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Signup */}
          <div className="pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>Don't have an official account? </span>
            <Link to="/signup" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
              Sign Up here
            </Link>
          </div>
        </div>
      </div>

      {/* Security Footer */}
      <div className="relative text-center text-slate-500 text-xs flex items-center justify-center gap-2 pb-6">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>Official Government Grade Enterprise System • Municipal Administration Authority Portal</span>
      </div>
    </div>
  );
};

export default Login;
