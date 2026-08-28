import React from 'react';
import { AlertTriangle, Info, CheckCircle2, Trash2 } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const ICONS = {
  danger: <Trash2 className="w-6 h-6 text-red-600" />,
  warning: <AlertTriangle className="w-6 h-6 text-amber-600" />,
  primary: <Info className="w-6 h-6 text-blue-600" />,
  success: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
};

const ICON_BG = {
  danger: 'bg-red-100',
  warning: 'bg-amber-100',
  primary: 'bg-blue-100',
  success: 'bg-emerald-100',
};

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone. Please confirm to proceed.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  const icon = ICONS[variant] || ICONS.primary;
  const iconBg = ICON_BG[variant] || ICON_BG.primary;

  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? undefined : onClose}
      size="sm"
      showCloseButton={!isLoading}
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full shrink-0 ${iconBg}`}>
          {icon}
        </div>
        <div className="mt-0.5">
          <h4 className="text-base font-semibold text-slate-900 mb-1.5">{title}</h4>
          <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
