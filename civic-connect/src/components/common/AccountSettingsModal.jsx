import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { useAuth } from '../../context/AuthContext';
import { useCivic } from '../../context/CivicContext';
import { User, Lock, Bell, ShieldCheck, Save, KeyRound } from 'lucide-react';

export const AccountSettingsModal = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { showToast } = useCivic();
  const [activeTab, setActiveTab] = useState('PROFILE');

  // Form State
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  
  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast('Account profile updated successfully', 'success');
    onClose();
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'warning');
      return;
    }
    showToast('Security credentials updated successfully', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Account Settings & Security"
      subtitle="Manage profile credentials, password security, and notification preferences"
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        {/* Tab Selection */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('PROFILE')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'PROFILE' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile Details</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SECURITY')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'SECURITY' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Security & Password</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('NOTIFICATIONS')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'NOTIFICATIONS' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notifications</span>
          </button>
        </div>

        {/* Tab 1: Profile Details */}
        {activeTab === 'PROFILE' && (
          <form onSubmit={handleSaveProfile} className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'}
                alt={currentUser?.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/30 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 truncate">{currentUser?.name}</p>
                <p className="text-xs text-slate-500 truncate">{currentUser?.roleLabel || 'Official Account'}</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Verified Official Account</span>
                </div>
              </div>
            </div>

            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
              />
              <Input
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="primary" icon={Save}>Save Profile</Button>
            </div>
          </form>
        )}

        {/* Tab 2: Security & Password */}
        {activeTab === 'SECURITY' && (
          <form onSubmit={handleSaveSecurity} className="space-y-4 animate-in fade-in duration-150">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Passwords must be at least 8 characters long and contain numbers and symbols.</span>
            </div>

            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="primary" icon={Lock}>Update Password</Button>
            </div>
          </form>
        )}

        {/* Tab 3: Notification Preferences */}
        {activeTab === 'NOTIFICATIONS' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Email Alerts & SLA Reminders</span>
                  <span className="text-[11px] text-slate-500">Receive email status updates when assigned civic complaints change state</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">SMS Emergency Dispatch Notifications</span>
                  <span className="text-[11px] text-slate-500">Receive SMS text notifications for critical priority escalations</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="outline" onClick={onClose}>Close</Button>
              <Button
                variant="primary"
                icon={Save}
                onClick={() => {
                  showToast('Notification preferences saved', 'success');
                  onClose();
                }}
              >
                Save Preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AccountSettingsModal;
