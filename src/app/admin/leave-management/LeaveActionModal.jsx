import React, { useState, useEffect } from 'react';
import { X, Calendar, CheckCircle, AlertCircle, Eye } from 'lucide-react';

const LeaveActionModal = ({ isOpen, onClose, onApprove, onReject, request }) => {
  const [mode, setMode] = useState('view'); // 'view', 'approve', 'reject'
  const [approveData, setApproveData] = useState({
    from_date: '',
    to_date: '',
    return_date: '',
    admin_note: ''
  });
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (request && isOpen) {
        setMode('view');
        setRejectReason('');
        
        // Pre-fill dates from request for approval form
        const formatDate = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return !isNaN(date) ? date.toISOString().split('T')[0] : '';
        };

        setApproveData({
            from_date: formatDate(request.from_date),
            to_date: formatDate(request.to_date),
            return_date: formatDate(request.return_date || request.to_date), 
            admin_note: ''
        });
    }
  }, [request, isOpen]);

  const handleApproveChange = (e) => {
    const { name, value } = e.target;
    setApproveData(prev => ({ ...prev, [name]: value }));
  };

  const handleApproveSubmit = (e) => {
    e.preventDefault();
    onApprove(approveData);
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    onReject(rejectReason);
  };

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Eye className="text-purple-600" size={20} />
            Review Request
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1">
             <div className="space-y-4 mb-6">
                {/* Student Key Details */}
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h4 className="font-bold text-gray-900 text-lg">{request.student?.name || 'Unknown Student'}</h4>
                            <p className="text-sm text-purple-700 font-medium">
                                {request.student?.roll_number} • {request.student?.department} • Year {request.student?.year}
                            </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                            ${request.student?.hostel_block ? 'bg-white text-purple-700 shadow-sm' : 'hidden'}
                        `}>
                            {request.student?.hostel_block} - {request.student?.room_number}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600">
                        <div>
                            <span className="text-xs text-purple-400 uppercase font-semibold block">Mobile</span>
                            {request.student?.phone || 'N/A'}
                        </div>
                        <div>
                            <span className="text-xs text-purple-400 uppercase font-semibold block">Email</span>
                            {request.student?.email || 'N/A'}
                        </div>
                    </div>
                </div>

                {/* Academic & Performance Stats */}
                <div className="grid grid-cols-4 gap-2 text-center mb-4">
                    <div className="bg-orange-50 p-2 rounded-lg border border-orange-100">
                        <span className="block text-xs text-orange-600 font-bold uppercase">Attendance</span>
                        <span className="text-sm font-bold text-gray-800">{request.student?.attendance_percentage ?? '-'}%</span>
                    </div>
                    <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
                        <span className="block text-xs text-blue-600 font-bold uppercase">CGPA</span>
                        <span className="text-sm font-bold text-gray-800">{request.student?.cgpa ?? '-'}</span>
                    </div>
                    <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
                        <span className="block text-xs text-blue-600 font-bold uppercase">GPA</span>
                        <span className="text-sm font-bold text-gray-800">{request.student?.gpa ?? '-'}</span>
                    </div>
                    <div className="bg-green-50 p-2 rounded-lg border border-green-100">
                        <span className="block text-xs text-green-600 font-bold uppercase">Marks %</span>
                        <span className="text-sm font-bold text-gray-800">{request.student?.percentage ?? '-'}%</span>
                    </div>
                </div>
                
                {/* Scholarships */}
                {request.student?.scholarships?.length > 0 && (
                    <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100 mb-4">
                            <h5 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <span>Scholarships</span>
                            <span className="bg-yellow-200 text-yellow-800 text-[10px] px-1.5 py-0.5 rounded-full">{request.student.scholarships.length}</span>
                            </h5>
                            <div className="space-y-2">
                            {request.student.scholarships.map((sch) => (
                                <div key={sch._id} className="flex justify-between items-center text-sm bg-white p-2 rounded-lg border border-yellow-100 shadow-sm">
                                    <span className="font-medium text-gray-800">{sch.name}</span>
                                    <span className="text-xs text-gray-500">{sch.amount?.toLocaleString()} ({sch.status})</span>
                                </div>
                            ))}
                            </div>
                    </div>
                )}

                {/* Parents Info */}
                {(request.student?.father_name || request.student?.mother_name) && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Parent / Guardian Contact</h5>
                        <div className="grid grid-cols-2 gap-4">
                            {request.student?.father_name && (
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{request.student.father_name}</p>
                                    <p className="text-xs text-gray-500">Father • {request.student.father_phone}</p>
                                </div>
                            )}
                            {request.student?.mother_name && (
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{request.student.mother_name}</p>
                                    <p className="text-xs text-gray-500">Mother • {request.student.mother_phone}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {/* Request Details Check */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-900 mt-4">
                        <span className="font-semibold block text-blue-500 text-xs uppercase mb-1">Reason for Leave/Outpass</span>
                        {request.request_reason}
                        {request.place_to_visit && <span className="block mt-1 text-blue-700 font-medium">Visiting: {request.place_to_visit}</span>}
                </div>
            </div>

            {/* ACTION AREA */}
            <div className="border-t border-gray-100 pt-6">
                {mode === 'view' && (
                    <div className="flex gap-4">
                         <button 
                            onClick={() => setMode('reject')}
                            className="flex-1 py-3 px-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <AlertCircle size={18} />
                            Reject Request
                        </button>
                        <button 
                            onClick={() => setMode('approve')}
                            className="flex-1 py-3 px-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={18} />
                            Approve Request
                        </button>
                    </div>
                )}

                {mode === 'approve' && (
                    <form onSubmit={handleApproveSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-600"/> Approval Details
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">From Date</label>
                                <input 
                                    type="date"
                                    name="from_date"
                                    value={approveData.from_date}
                                    onChange={handleApproveChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">To Date</label>
                                <input 
                                    type="date"
                                    name="to_date"
                                    value={approveData.to_date}
                                    onChange={handleApproveChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600">Actual Return Date</label>
                            <input 
                                type="date"
                                name="return_date"
                                value={approveData.return_date}
                                onChange={handleApproveChange}
                                required
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600">Admin Note</label>
                            <textarea 
                                name="admin_note"
                                value={approveData.admin_note}
                                onChange={handleApproveChange}
                                placeholder="Add comments..."
                                rows="2"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                            ></textarea>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setMode('view')}
                                className="flex-1 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="flex-[2] py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors"
                            >
                                Confirm Approval
                            </button>
                        </div>
                    </form>
                )}

                {mode === 'reject' && (
                    <form onSubmit={handleRejectSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                         <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <AlertCircle size={16} className="text-red-500"/> Rejection Details
                        </h4>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600">Rejection Reason</label>
                            <textarea 
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                required
                                placeholder="Please provide a reason..."
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                            ></textarea>
                        </div>
                        <div className="flex gap-3 pt-2">
                             <button
                                type="button"
                                onClick={() => setMode('view')}
                                className="flex-1 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="flex-[2] py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveActionModal;
