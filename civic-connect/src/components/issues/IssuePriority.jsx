import React from 'react';
import { Badge } from '../common/Badge';
import { Flame, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const IssuePriority = ({ priority }) => {
  const priorityConfig = {
    CRITICAL: { label: 'CRITICAL', icon: Flame, variant: 'CRITICAL' },
    HIGH: { label: 'HIGH', icon: AlertTriangle, variant: 'HIGH' },
    MEDIUM: { label: 'MEDIUM', icon: ArrowUpRight, variant: 'MEDIUM' },
    LOW: { label: 'LOW', icon: ArrowDownRight, variant: 'LOW' }
  };

  const config = priorityConfig[priority] || { label: priority, icon: ArrowUpRight, variant: 'LOW' };

  return <Badge variant={config.variant} icon={config.icon}>{config.label}</Badge>;
};
