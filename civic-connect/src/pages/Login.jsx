import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCivic } from '../context/CivicContext';
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
  const { login } = useAuth();
  const { showToast } = useCivic();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  // Form State - Default role is CITIZEN
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const rolePaths = {
    CITIZEN: '/citizen/dashboard',
    SUPER_ADMIN: '/admin/dashboard',
    DEPARTMENT_ADMIN: '/department/dashboard',
    FIELD_WORKER: '/worker/dashboard'
  };

  const handleFormLogin = async (e) => {
    e.preventDefault();
    const inputEmail = emailOrUsername.trim().toLowerCase();

    if (!inputEmail || !password) {
      setError('Please enter your email address and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await login({ email: inputEmail, password });
      showToast(`Authenticated: Welcome back, ${user.name}! (${user.role})`, 'success');
      
      const targetPath = rolePaths[user.role] || '/citizen/dashboard';
      navigate(targetPath);
    } catch (err) {
      console.warn("Login lookup error:", err);
      setError(err.message || 'Invalid email or password.');
      showToast('Login failed', 'error');
    } finally {
      setLoading(false);
    }
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
              <span>SECURE AUTHENTICATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-slate-400">
              Sign in with your account credentials to access your municipal portal
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleFormLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="citizen@gmail.com"
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
