import React, { useState } from 'react';
import { Bell, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

import { useToast } from '../../hooks/useToast';

export const SettingsPage = () => {
  const { showToast } = useToast();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);

  const handleSave = () => {
    showToast('Preferences updated successfully', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Application Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Customize your civic notification alerts and interface preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-blue-600" />
            <div>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive updates on reported potholes</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-800">Email Notifications</p>
              <p className="text-xs text-slate-500">Receive status update emails when civic issues change state</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-800">In-App Live Alerts</p>
              <p className="text-xs text-slate-500">Show real-time toast banners when new escalations occur</p>
            </div>
            <input
              type="checkbox"
              checked={pushAlerts}
              onChange={(e) => setPushAlerts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Save className="w-4 h-4" />}
              onClick={handleSave}
            >
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
