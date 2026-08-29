import { Routes, Route, Navigate } from 'react-router-dom';
import WorkerLayout from '../layouts/WorkerLayout';
import WorkerDashboard from '../pages/worker/WorkerDashboard';
import AssignedTasks from '../pages/worker/AssignedTasks';
import TaskDetails from '../pages/worker/TaskDetails';
import TaskMap from '../pages/worker/TaskMap';
import WorkerNotifications from '../pages/worker/WorkerNotifications';
import WorkerProfile from '../pages/worker/WorkerProfile';

const WorkerRoutes = () => {
  return (
    <Routes>
      <Route element={<WorkerLayout />}>
        <Route path="dashboard" element={<WorkerDashboard />} />
        <Route path="tasks" element={<AssignedTasks />} />
        <Route path="tasks/:id" element={<TaskDetails />} />
        <Route path="map" element={<TaskMap />} />
        <Route path="notifications" element={<WorkerNotifications />} />
        <Route path="profile" element={<WorkerProfile />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default WorkerRoutes;
