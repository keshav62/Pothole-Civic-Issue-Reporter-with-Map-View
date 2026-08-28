import { cn } from '../../utils/cn';

const statusConfig = {
  'assigned': {
    label: 'Assigned',
    styles: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  'in-progress': {
    label: 'In Progress',
    styles: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  'resolved': {
    label: 'Resolved',
    styles: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  }
};

const IssueStatus = ({ status, className }) => {
  const config = statusConfig[status] || {
    label: status,
    styles: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      config.styles,
      className
    )}>
      {config.label}
    </span>
  );
};

export default IssueStatus;
