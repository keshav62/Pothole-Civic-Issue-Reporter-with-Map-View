import React from 'react';
import { Badge } from '../common/Badge';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck, XCircle, Play } from 'lucide-react';

export const IssueStatus = ({ status }) => {
  const statusConfig = {
    REPORTED: { label: 'Reported', icon: Clock, variant: 'REPORTED' },
    VERIFIED: { label: 'Verified', icon: ShieldCheck, variant: 'VERIFIED' },
    ASSIGNED: { label: 'Assigned', icon: Clock, variant: 'ASSIGNED' },
    IN_PROGRESS: { label: 'In Progress', icon: Play, variant: 'IN_PROGRESS' },
    RESOLVED: { label: 'Resolved', icon: CheckCircle2, variant: 'RESOLVED' },
    REJECTED: { label: 'Rejected', icon: XCircle, variant: 'REJECTED' }
  };

  const config = statusConfig[status] || { label: status, icon: Clock, variant: 'LOW' };

  return <Badge variant={config.variant} icon={config.icon}>{config.label}</Badge>;
};
