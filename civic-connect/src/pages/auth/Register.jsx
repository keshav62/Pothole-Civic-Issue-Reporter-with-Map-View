import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserCheck, Layers, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/common/Card';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { APP_ROUTES, USER_ROLES, ROLE_LABELS } from '../../utils/constants';

const ROLE_OPTIONS = [
  { value: USER_ROLES.CITIZEN, label: 'Citizen (Public Reporter)' },
  { value: USER_ROLES.OFFICER, label: 'Field Officer (Ward Inspector)' },
  { value: USER_ROLES.WORKER, label: 'Maintenance Worker (Repair Crew)' },
  { value: USER_ROLES.DEPARTMENT_ADMIN, label: 'Department Admin (Public Works)' },
  { value: USER_ROLES.ADMIN, label: 'Municipal Administrator (System Admin)' },
];

export const Register = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: USER_ROLES.CITIZEN,
    department: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
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
    setError(null);

    try {
      const user = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        department: formData.department || null,
      });

      showToast(`Account created! Welcome, ${user.name}`, 'success');
      navigate(APP_ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      showToast('Registration failed', 'error');
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
          Create CivicConnect Account
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Join the community to report issues and improve city infrastructure
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="shadow-lg border-slate-200">
          <CardHeader>
            <div>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Enter your details and select your community role</CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            {error && (
              <ErrorMessage
                message={error}
                dismissible
                onDismiss={() => setError(null)}
                className="mb-4"
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <Input
                label="Full Name"
                name="name"
                required
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange}
                leftIcon={<User className="w-4 h-4" />}
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                required
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <Select
                label="Account Role"
                name="role"
                required
                options={ROLE_OPTIONS}
                value={formData.role}
                onChange={handleChange}
                helperText="Select your official capacity or citizen reporter status"
              />

              {formData.role !== USER_ROLES.CITIZEN && (
                <Input
                  label="Department / Unit Name"
                  name="department"
                  placeholder="e.g. Roads & Transport Dept"
                  value={formData.department}
                  onChange={handleChange}
                />
              )}

              <Input
                label="Password"
                name="password"
                type="password"
                required
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                leftIcon={<Lock className="w-4 h-4" />}
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                required
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                leftIcon={<Lock className="w-4 h-4" />}
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={loading}
                leftIcon={<UserCheck className="w-4 h-4" />}
                className="mt-2"
              >
                Create Account
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center text-xs text-slate-500">
            <span>Already have an account?</span>
            <Link
              to={APP_ROUTES.LOGIN}
              className="font-semibold text-blue-600 hover:text-blue-700 ml-1 inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
