import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

const RejectionModal = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(reason);
    setReason('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <AlertCircle className="text-red-500" size={20} />
            Reject Request
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600">
                    Are you sure you want to reject this request? Please provide a reason.
                </p>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Rejection Reason</label>
                    <textarea 
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        placeholder="e.g. Incomplete details..."
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    ></textarea>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
                >
                    Confirm Rejection
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default RejectionModal;
