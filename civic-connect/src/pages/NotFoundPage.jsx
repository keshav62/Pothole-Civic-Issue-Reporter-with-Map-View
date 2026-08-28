import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

import { Card, CardContent } from '../components/common/Card';
import { APP_ROUTES } from '../utils/constants';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center shadow-lg border-slate-200">
        <CardContent className="p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
            <Compass className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
              404 • Page Not Found
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Destination Uncharted
            </h1>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              The page or resource you requested could not be located in the CivicConnect directory.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Link to={APP_ROUTES.DASHBOARD} className="w-full">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Home className="w-4 h-4" />}
                fullWidth
              >
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;
