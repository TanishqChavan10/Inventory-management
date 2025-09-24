import React from 'react';
import { Button } from './button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'default';
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Cancel',
  variant = 'default'
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
          {message}
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-full border-gray-300 hover:bg-gray-50"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            className="flex-1 rounded-full bg-red-500 hover:bg-red-600 text-white"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}