import { USER_ROLES } from '../utils/constants';

export const MOCK_USERS = [
  {
    id: 'user-cit-001',
    name: 'Demo Citizen',
    email: 'citizen@example.com',
    role: USER_ROLES.CITIZEN,
    department: null,
    phone: '+1 (555) 019-2834',
    avatar: null,
    address: '142 Maplewood Avenue, Ward 4',
  },
  {
    id: 'user-adm-001',
    name: 'Demo Admin',
    email: 'admin@example.com',
    role: USER_ROLES.ADMIN,
    department: 'Central Administration',
    phone: '+1 (555) 019-5521',
    avatar: null,
    address: 'Civic Center, Suite 500',
  },
  {
    id: 'user-dep-001',
    name: 'Demo Department Admin',
    email: 'department@example.com',
    role: USER_ROLES.DEPARTMENT_ADMIN,
    department: 'Roads & Infrastructure',
    phone: '+1 (555) 019-7733',
    avatar: null,
    address: 'Public Works HQ, Ward 2',
  },
  {
    id: 'user-off-001',
    name: 'Demo Officer',
    email: 'officer@example.com',
    role: USER_ROLES.OFFICER,
    department: 'Roads & Infrastructure',
    phone: '+1 (555) 019-8844',
    avatar: null,
    address: 'Field Unit Station 3, Ward 4',
  },
  {
    id: 'user-wrk-001',
    name: 'Demo Worker',
    email: 'worker@example.com',
    role: USER_ROLES.WORKER,
    department: 'Roads & Infrastructure - Maintenance Crew',
    phone: '+1 (555) 019-9955',
    avatar: null,
    address: 'Maintenance Depot A, Sector 9',
  },
];

export const getMockUserByRole = (role) => {
  return MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[0];
};

export const getMockUserByEmail = (email) => {
  return MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
};
