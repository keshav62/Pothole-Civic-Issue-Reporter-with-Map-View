import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card, CardContent } from '../components/common/Card';
import { APP_ROUTES, ROLE_LABELS } from '../utils/constants';

export const UnauthorizedPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center shadow-lg border-slate-200">
        <CardContent className="p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold text-red-600 tracking-wider uppercase">
              403 • Access Restricted
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Permission Denied
            </h1>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              You do not have the required administrative clearance to access this module.
            </p>
          </div>

          {isAuthenticated && user && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-600 text-left flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">{user.name}</span>
                <span className="text-[10px] text-slate-400">Current Role: {ROLE_LABELS[user.role] || user.role}</span>
              </div>
              <Badge role={user.role} size="sm" dot />
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate(-1)}
              fullWidth
            >
              Go Back
            </Button>
            <Link to={APP_ROUTES.DASHBOARD} className="w-full">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Home className="w-4 h-4" />}
                fullWidth
              >
                Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;
