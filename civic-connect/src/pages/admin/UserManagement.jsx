import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { UserPlus, Search, Edit2, ShieldAlert, CheckCircle, Sparkles } from 'lucide-react';

export const UserManagement = () => {
  const { users, addUser, updateUserStatus } = useCivic();
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'FIELD_WORKER',
    roleLabel: 'Field Worker',
    department: 'Road Maintenance',
    ward: 'Ward 15',
    status: 'ACTIVE'
  });

  const tabs = [
    { id: 'ALL', label: 'All Users' },
    { id: 'SUPER_ADMIN', label: 'Super Admins' },
    { id: 'DEPARTMENT_ADMIN', label: 'Department Admins' },
    { id: 'WARD_OFFICER', label: 'Ward Officers' },
    { id: 'FIELD_WORKER', label: 'Field Workers' }
  ];

  const filteredUsers = (users || []).filter(u => {
    if (!u) return false;
    const matchesTab = activeTab === 'ALL' || u.role === activeTab;
    const q = (searchQuery || '').toLowerCase();
    const name = (u.name || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const dept = (u.department || '').toLowerCase();
    const matchesSearch = !q || name.includes(q) || email.includes(q) || dept.includes(q);
    return matchesTab && matchesSearch;
  });

  const handleSubmitUser = (e) => {
    e.preventDefault();
    addUser(newUser);
    setIsModalOpen(false);
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: 'FIELD_WORKER',
      roleLabel: 'Field Worker',
      department: 'Road Maintenance',
      ward: 'Ward 15',
      status: 'ACTIVE'
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Refined Dark Hero Banner (Same as Citizen & Admin Portals) */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>SUPER ADMIN DIRECTORY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              User & Credential Management
            </h1>
            <p className="text-slate-400 font-medium text-xs sm:text-sm max-w-xl mt-1.5 leading-relaxed">
              Manage administrative personnel, division directors, ward officers, and field workers across city departments.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <Button
              size="lg"
              variant="primary"
              icon={UserPlus}
              className="py-3 px-5 font-bold text-xs shrink-0"
              onClick={() => setIsModalOpen(true)}
            >
              Add New User
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-72">
            <Input
              placeholder="Search user name or email..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Department / Ward</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.map((usr) => (
                <tr key={usr.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={usr.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'}
                        alt={usr.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{usr.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{usr.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {usr.roleLabel || usr.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800">{usr.department}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{usr.ward}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={usr.status}>{usr.status}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{usr.lastActive}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {usr.status === 'ACTIVE' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateUserStatus(usr.id, 'DISABLED')}
                        >
                          Disable
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => updateUserStatus(usr.id, 'ACTIVE')}
                        >
                          Enable
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Platform User"
        subtitle="Create administrator or field staff credential"
      >
        <form onSubmit={handleSubmitUser} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="e.g. Inspector Rajesh Kumar"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="rajesh.kumar@civicconnect.gov.in"
            />
            <Input
              label="Phone Number"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Assign Role"
              value={newUser.role}
              onChange={(e) => {
                const roleMap = {
                  SUPER_ADMIN: 'Super Admin',
                  DEPARTMENT_ADMIN: 'Department Admin',
                  WARD_OFFICER: 'Ward Officer',
                  FIELD_WORKER: 'Field Worker'
                };
                setNewUser({ ...newUser, role: e.target.value, roleLabel: roleMap[e.target.value] });
              }}
              options={[
                { value: 'SUPER_ADMIN', label: 'Super Admin' },
                { value: 'DEPARTMENT_ADMIN', label: 'Department Admin' },
                { value: 'WARD_OFFICER', label: 'Ward Officer' },
                { value: 'FIELD_WORKER', label: 'Field Worker' }
              ]}
            />

            <Select
              label="Department"
              value={newUser.department}
              onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
              options={['Road Maintenance', 'Sanitation', 'Electrical', 'Water Supply', 'Drainage', 'Parks', 'Traffic']}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" icon={UserPlus}>Create User</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;
