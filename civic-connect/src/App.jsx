import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WorkerRoutes from './routes/WorkerRoutes';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to worker dashboard for this prototype */}
        <Route path="/" element={<Navigate to="/worker/dashboard" replace />} />
        
        {/* Worker Module Routes */}
        <Route path="/worker/*" element={<WorkerRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
