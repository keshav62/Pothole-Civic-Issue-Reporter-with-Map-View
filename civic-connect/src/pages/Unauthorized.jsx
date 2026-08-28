import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ShieldAlert } from 'lucide-react';

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 text-center">
      <ShieldAlert className="w-16 h-16 text-red-500 mb-4 animate-bounce" />
      <h1 className="text-2xl font-black mb-2">Access Restricted</h1>
      <p className="text-sm text-slate-400 max-w-md mb-6">
        You do not have the required administrative clearance to access this portal route. Please switch roles or contact Headquarters.
      </p>
      <Button variant="primary" onClick={() => navigate('/login')}>
        Return to Login / Role Switcher
      </Button>
    </div>
  );
};
