import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { FileQuestion } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 text-center">
      <FileQuestion className="w-16 h-16 text-blue-500 mb-4" />
      <h1 className="text-2xl font-black mb-2">404 — Page Not Found</h1>
      <p className="text-sm text-slate-400 max-w-md mb-6">
        The requested authority route does not exist or has been relocated.
      </p>
      <Button variant="primary" onClick={() => navigate('/')}>
        Go to Home
      </Button>
    </div>
  );
};
