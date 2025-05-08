import React from 'react';
import { Modal } from '@components/common/Modal';

interface ErrorModalProps {
  error: string | null;
  onClose: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <Modal
        open={!!error}
        onClose={onClose}
        title="Error"
      >
        <div className="pointer-events-auto">
          <div className="text-red-600 p-4">
            {error}
          </div>
          <div className="flex justify-end p-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Dismiss
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};