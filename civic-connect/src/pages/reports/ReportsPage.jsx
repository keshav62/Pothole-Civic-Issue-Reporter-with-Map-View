import React from 'react';
import { FileText, Plus, Search, Filter } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

import { Input } from '../../components/common/Input';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../hooks/useToast';

export const ReportsPage = () => {
  const { showToast } = useToast();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports & Civic Issues</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse, track, and manage reported potholes and civic hazards
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => showToast('Report creation form opens here', 'info')}
        >
          Report New Issue
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full sm:w-72">
              <Input
                placeholder="Search by title, address, ID..."
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Filter className="w-4 h-4" />}
              onClick={() => showToast('Filters drawer', 'info')}
            >
              Filter Issues
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<FileText className="w-8 h-8 text-blue-500" />}
            title="Reports Module Foundation Ready"
            description="This view is prepped for the Issue List & Report Form components (Member 2 & 3)."
            actionText="Simulate Adding Issue"
            onAction={() => showToast('Simulated issue event created', 'success')}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
