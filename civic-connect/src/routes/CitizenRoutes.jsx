import React from 'react';
import { Route } from 'react-router-dom';
import { CitizenDashboard } from '../pages/citizen/CitizenDashboard';
import { MyReports } from '../pages/citizen/MyReports';
import { ReportIssue } from '../pages/citizen/ReportIssue';
import { NearbyIssues } from '../pages/citizen/NearbyIssues';
import { CitizenNotifications } from '../pages/citizen/Notifications';
import { CitizenProfile } from '../pages/citizen/Profile';
import { CitizenIssueDetails } from '../pages/citizen/IssueDetails';

export const citizenRoutes = [
  { path: 'dashboard', element: <CitizenDashboard /> },
  { path: 'reports', element: <MyReports /> },
  { path: 'report', element: <ReportIssue /> },
  { path: 'nearby', element: <NearbyIssues /> },
  { path: 'notifications', element: <CitizenNotifications /> },
  { path: 'profile', element: <CitizenProfile /> },
  { path: 'issues/:id', element: <CitizenIssueDetails /> },
];

export default citizenRoutes;
