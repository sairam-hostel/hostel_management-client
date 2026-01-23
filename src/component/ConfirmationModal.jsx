import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * ConfirmationModal Component
 * 
 * A reusable modal component for confirming user actions.
 * 
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is currently open.
 * @param {Function} props.onClose - Callback function to close the modal.
 * @param {Function} props.onConfirm - Callback function when the confirm button is clicked.
 * @param {string} [props.title] - Title of the modal.
 * @param {string} [props.message] - Message body of the modal.
 * @param {boolean} [props.isLoading] - Whether a loading state should be shown on the confirm button.
 * @returns {JSX.Element|null} The rendered ConfirmationModal or null if not open.
 */
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading, confirmText, confirmColor }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={20} />
            {title || 'Confirm Action'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-gray-600 text-sm leading-relaxed">
            {message || 'Are you sure you want to proceed? This action cannot be undone.'}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2 ${confirmColor || 'bg-red-600 hover:bg-red-700'}`}
          >
            {isLoading ? 'Processing...' : (confirmText || 'Confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
