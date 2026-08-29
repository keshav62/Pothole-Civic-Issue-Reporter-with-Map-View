import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Info,
  HardHat,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { ROLE_LABELS, APP_ROUTES } from '../../utils/constants';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const handleConfirmAction = () => {
    setIsConfirmLoading(true);
    setTimeout(() => {
      setIsConfirmLoading(false);
      setIsConfirmOpen(false);
      showToast('Action confirmed and processed successfully', 'success');
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>CivicConnect Shared Frontend Foundation Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.name || 'Civic User'}!
          </h1>
          <p className="mt-2 text-blue-100 text-sm sm:text-base leading-relaxed">
            Logged in as <span className="font-semibold text-white">{ROLE_LABELS[user?.role] || user?.role}</span>.
            This foundation provides authentication, responsive navigation, role routing, and standard UI components.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link to={APP_ROUTES.WORKER_PORTAL}>
              <Button
                variant="primary"
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold border-none shadow-md flex items-center gap-2"
              >
                <HardHat className="w-4 h-4" />
                Open Field Worker Portal
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={() => setIsDemoModalOpen(true)}
            >
              Preview Modal Component
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={() => setIsConfirmOpen(true)}
            >
              Test Confirm Dialog
            </Button>
          </div>
        </div>

        {/* Decorative Background Icon */}
        <Layers className="absolute -right-8 -bottom-8 w-64 h-64 text-white/5 pointer-events-none" />
      </div>

      {/* Quick Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Active Issues</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">24</h3>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <Activity className="w-3 h-3" />
                <span>8 resolved this week</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">In Progress</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">11</h3>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                <Clock className="w-3 h-3" />
                <span>Assigned to field crews</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Fixed & Closed</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">142</h3>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                <span>94% verification rate</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Active Role</p>
              <h3 className="text-base font-bold text-slate-900 mt-1 truncate">
                {ROLE_LABELS[user?.role] || user?.role}
              </h3>
              <div className="mt-1.5">
                <Badge role={user?.role} size="sm" dot />
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              {user?.role ? user.role.slice(0, 3) : 'USR'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Common UI Components Interactive Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buttons & Toast Tester Card */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Common UI Components</CardTitle>
              <CardDescription>
                Reusable buttons, badges, and toast triggers for all team members
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Button Variants</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" size="sm">Primary</Button>
                <Button variant="secondary" size="sm">Secondary</Button>
                <Button variant="outline" size="sm">Outline</Button>
                <Button variant="danger" size="sm">Danger</Button>
                <Button variant="success" size="sm">Success</Button>
                <Button variant="warning" size="sm">Warning</Button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Trigger Toasts</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showToast('Pothole report #104 submitted successfully!', 'success')}
                >
                  Success Toast
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showToast('Failed to fetch GPS coordinates', 'error')}
                >
                  Error Toast
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showToast('Severe issue reported near Sector 4', 'warning')}
                >
                  Warning Toast
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showToast('Department shift change at 18:00', 'info')}
                >
                  Info Toast
                </Button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Role Badges</p>
              <div className="flex flex-wrap gap-2">
                <Badge role="CITIZEN" dot />
                <Badge role="ADMIN" dot />
                <Badge role="DEPARTMENT_ADMIN" dot />
                <Badge role="OFFICER" dot />
                <Badge role="WORKER" dot />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empty State Component Showcase */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>EmptyState & Placeholder Demo</CardTitle>
              <CardDescription>Used across tables, lists, and empty queries</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="No Pending Escalations"
              description="All civic reports in your jurisdiction are currently up to date."
              actionText="Submit New Test Report"
              onAction={() => showToast('Action button triggered inside EmptyState', 'info')}
            />
          </CardContent>
        </Card>
      </div>

      {/* Demo Modal */}
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title="Reusable CivicConnect Modal"
        description="Standard modal dialog ready for report details, image previews, or worker assignments."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDemoModalOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setIsDemoModalOpen(false);
                showToast('Modal changes saved', 'success');
              }}
            >
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-sm text-slate-600">
          <p>
            This modal component handles ESC key dismissal, body scroll locks, outside click handling, responsive screen sizing, and compound slots.
          </p>
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>Fully accessible and reusable by all team members.</span>
          </div>
        </div>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmAction}
        isLoading={isConfirmLoading}
        title="Confirm Status Change?"
        message="Are you sure you want to mark this infrastructure ticket as resolved? This will notify the citizen reporter."
        confirmText="Yes, Resolve Ticket"
        variant="primary"
      />
    </div>
  );
};

export default DashboardPage;
