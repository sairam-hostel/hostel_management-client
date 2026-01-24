import React, { useState, useEffect } from 'react';
import { X, Calendar, CheckCircle } from 'lucide-react';

const ApprovalModal = ({ isOpen, onClose, onConfirm, request }) => {
  const [formData, setFormData] = useState({
    from_date: '',
    to_date: '',
    return_date: '', // Often same as to_date depending on logic, or specific field
    admin_note: ''
  });

  useEffect(() => {
    if (request && isOpen) {
        // Pre-fill dates from request, formatting to YYYY-MM-DD for input type="date"
        const formatDate = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return !isNaN(date) ? date.toISOString().split('T')[0] : '';
        };

        setFormData({
            from_date: formatDate(request.from_date),
            to_date: formatDate(request.to_date),
            // Default return_date to to_date if not explicitly available, 
            // usually return date is the end of the trip/leave.
            return_date: formatDate(request.return_date || request.to_date), 
            admin_note: ''
        });
    }
  }, [request, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(formData);
  };

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <CheckCircle className="text-green-600" size={20} />
            Approve Request
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
                <div className="text-sm text-gray-600 bg-purple-50 p-3 rounded-lg border border-purple-100 mb-4">
                    <p><strong>Student:</strong> {request.student_name || 'N/A'}</p>
                    <p><strong>Reason:</strong> {request.request_reason}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-600">From Date</label>
                        <div className="relative">
                            <input 
                                type="date"
                                name="from_date"
                                value={formData.from_date}
                                onChange={handleChange}
                                required
                                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-600">To Date</label>
                        <div className="relative">
                            <input 
                                type="date"
                                name="to_date"
                                value={formData.to_date}
                                onChange={handleChange}
                                required
                                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Actual Return Date</label>
                    <div className="relative">
                        <input 
                            type="date"
                            name="return_date"
                            value={formData.return_date}
                            onChange={handleChange}
                            required
                            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <p className="text-[10px] text-gray-400">Date when student is expected back in hostel.</p>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Admin Note</label>
                    <textarea 
                        name="admin_note"
                        value={formData.admin_note}
                        onChange={handleChange}
                        placeholder="Add comments or approval notes..."
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
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
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                >
                    Confirm Approval
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ApprovalModal;
