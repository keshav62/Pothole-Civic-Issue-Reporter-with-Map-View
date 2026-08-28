import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { APP_ROUTES, USER_ROLES, ROLE_LABELS } from '../../utils/constants';
import { MOCK_USERS } from '../../data/mockUsers';

export const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || APP_ROUTES.DASHBOARD;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = await login({ email, password });
      showToast(`Welcome back, ${user.name}!`, 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      showToast('Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (mockUser) => {
    setLoading(true);
    setError(null);
    try {
      const user = await login({ email: mockUser.email, role: mockUser.role });
      showToast(`Signed in as ${user.name} (${ROLE_LABELS[user.role]})`, 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setError('Failed to log in with demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 mb-3">
          <Layers className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          CivicConnect Portal
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Sign in to report or resolve civic infrastructure issues
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Main Login Card */}
        <Card className="shadow-lg border-slate-200">
          <CardHeader>
            <div>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Enter your civic credentials to access your account</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <ErrorMessage
                message={error}
                dismissible
                onDismiss={() => setError(null)}
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember me</span>
                </label>

                <Link
                  to={APP_ROUTES.FORGOT_PASSWORD}
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={loading}
                leftIcon={<LogIn className="w-4 h-4" />}
              >
                Sign In
              </Button>
            </form>

            {/* Quick Demo Selector for Development / Testing */}
            <div className="pt-4 mt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-semibold text-slate-700">
                  Quick Demo Role Login (Hackathon Mode)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Click any role below to instantly log in as that persona:
              </p>

              <div className="grid grid-cols-1 gap-2">
                {MOCK_USERS.map((mockUser) => (
                  <button
                    key={mockUser.role}
                    type="button"
                    onClick={() => handleQuickDemoLogin(mockUser)}
                    disabled={loading}
                    className="flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition-all text-xs text-slate-700 disabled:opacity-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-600">
                        {mockUser.role[0]}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 block">
                          {mockUser.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {mockUser.email}
                        </span>
                      </div>
                    </div>
                    <Badge role={mockUser.role} size="sm" />
                  </button>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="justify-center text-xs text-slate-500">
            <span>Don't have an account?</span>
            <Link
              to={APP_ROUTES.REGISTER}
              className="font-semibold text-blue-600 hover:text-blue-700 ml-1 inline-flex items-center gap-1"
            >
              Register here <ArrowRight className="w-3 h-3" />
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
