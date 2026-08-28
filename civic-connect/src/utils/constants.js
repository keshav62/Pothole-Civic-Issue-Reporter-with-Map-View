export const USER_ROLES = {
  CITIZEN: 'CITIZEN',
  ADMIN: 'ADMIN',
  DEPARTMENT_ADMIN: 'DEPARTMENT_ADMIN',
  OFFICER: 'OFFICER',
  WORKER: 'WORKER',
};

export const ROLE_LABELS = {
  [USER_ROLES.CITIZEN]: 'Citizen',
  [USER_ROLES.ADMIN]: 'Administrator',
  [USER_ROLES.DEPARTMENT_ADMIN]: 'Department Admin',
  [USER_ROLES.OFFICER]: 'Field Officer',
  [USER_ROLES.WORKER]: 'Maintenance Worker',
};

export const ROLE_BADGE_VARIANTS = {
  [USER_ROLES.CITIZEN]: 'info',
  [USER_ROLES.ADMIN]: 'danger',
  [USER_ROLES.DEPARTMENT_ADMIN]: 'primary',
  [USER_ROLES.OFFICER]: 'warning',
  [USER_ROLES.WORKER]: 'success',
};

export const STORAGE_KEYS = {
  AUTH_USER: 'civic_connect_user',
  AUTH_TOKEN: 'civic_connect_token',
};

export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  REPORTS: '/reports',
  MAP: '/map',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  UNAUTHORIZED: '/unauthorized',
};

export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: APP_ROUTES.DASHBOARD,
    icon: 'LayoutDashboard',
    roles: Object.values(USER_ROLES),
  },
  {
    label: 'Reports & Issues',
    path: APP_ROUTES.REPORTS,
    icon: 'FileText',
    roles: Object.values(USER_ROLES),
  },
  {
    label: 'Issue Map',
    path: APP_ROUTES.MAP,
    icon: 'MapPin',
    roles: Object.values(USER_ROLES),
  },
  {
    label: 'Profile',
    path: APP_ROUTES.PROFILE,
    icon: 'User',
    roles: Object.values(USER_ROLES),
  },
  {
    label: 'Settings',
    path: APP_ROUTES.SETTINGS,
    icon: 'Settings',
    roles: Object.values(USER_ROLES),
  },
];
