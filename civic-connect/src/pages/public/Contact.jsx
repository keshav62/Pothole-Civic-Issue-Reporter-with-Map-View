import React from 'react';
import { Mail, Phone, MapPin, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Card, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

import { Button } from '../../components/common/Button';
import { ROLE_LABELS } from '../../utils/constants';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account credentials and personal civic information
        </p>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white font-bold text-3xl flex items-center justify-center shadow-md shadow-blue-500/20">
              {user?.name?.charAt(0) || 'U'}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{user?.name || 'Civic User'}</h2>
                  <p className="text-xs text-slate-500">{user?.email || 'user@example.com'}</p>
                </div>
                <Badge role={user?.role} size="md" dot />
              </div>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Role: <strong>{ROLE_LABELS[user?.role] || user?.role}</strong></span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{user?.phone || '+1 (555) 019-2834'}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{user?.address || 'Ward 4 Infrastructure Zone'}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showToast('Profile edit modal triggered', 'info')}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
