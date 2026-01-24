import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Calendar, FileText, AlertTriangle } from 'lucide-react';
import ApiTableManager from '../../../component/ApiTableManager';
import api from '../../../utils/api';
import { useToast } from '../../../context/ToastContext';
import ApprovalModal from './ApprovalModal';
import RejectionModal from './RejectionModal';

const LeaveManagement = () => {
  const { showToast } = useToast();
  const [approvalModal, setApprovalModal] = useState({ isOpen: false, request: null });
  const [rejectionModal, setRejectionModal] = useState({ isOpen: false, request: null });
  // We can filter by status in the API if supported, or use the response `status` field.
  // For now, let's just display the list.

  const handleAction = async (request, action) => {
    if (action === 'approved') {
        setApprovalModal({ isOpen: true, request });
        return;
    }
    
    if (action === 'rejected') {
        setRejectionModal({ isOpen: true, request });
        return;
    }
  };

  const handleApproveConfirm = async (formData) => {
    try {
      const request = approvalModal.request;
      const id = request.request_id || request._id || request.id;
      
      // PATCH endpoint for approval with dates
      await api.patch(`/bf1/leave-outpass/${id}/approve`, formData);
      
      showToast('Request approved successfully', 'success');
      setApprovalModal({ isOpen: false, request: null });
      window.location.reload();
    } catch (err) {
        console.error('Error approving request:', err);
        const msg = err.response?.data?.message || 'Failed to approve request';
        showToast(msg, 'error');
    }
  };

  const handleRejectConfirm = async (reason) => {
    try {
      const request = rejectionModal.request;
      const id = request.request_id || request._id || request.id;
      
      // PATCH endpoint for rejection with note
      await api.patch(`/bf1/leave-outpass/${id}/reject`, { admin_note: reason });
      
      showToast('Request rejected successfully', 'success');
      setRejectionModal({ isOpen: false, request: null });
      window.location.reload();
    } catch (err) {
        console.error('Error rejecting request:', err);
        const msg = err.response?.data?.message || 'Failed to reject request';
        showToast(msg, 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const columns = [
    {
      header: 'Type & Reason',
      render: (request) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${request.type === 'outpass' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
              {request.type}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-900">{request.request_reason || 'No reason'}</p>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <FileText size={10} />
            {request.place_to_visit || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      header: 'Duration',
      render: (request) => (
        <div className="text-sm text-gray-600 space-y-1">
           <div className="flex items-center gap-1">
             <Calendar size={12} className="text-gray-400"/>
             <span>From: {new Date(request.from_date).toLocaleDateString()} {new Date(request.from_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
           </div>
           <div className="flex items-center gap-1">
             <Calendar size={12} className="text-gray-400"/>
             <span>To: {new Date(request.to_date).toLocaleDateString()} {new Date(request.to_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
           </div>
        </div>
      ),
    },
    {
      header: 'Current Status',
      render: (request) => (
         <div className="space-y-1">
            <div className="flex justify-between items-center gap-2 text-xs">
               <span className="text-gray-500">Mentor:</span>
               <span className={`px-1.5 py-0.5 rounded capitalize ${getStatusColor(request.mentor_status || 'pending')}`}>
                 {request.mentor_status || 'Pending'}
               </span>
            </div>
            <div className="flex justify-between items-center gap-2 text-xs">
               <span className="text-gray-500">HOD:</span>
                <span className={`px-1.5 py-0.5 rounded capitalize ${getStatusColor(request.hod_status || 'pending')}`}>
                 {request.hod_status || 'Pending'}
               </span>
            </div>
            <div className="flex justify-between items-center gap-2 text-xs font-semibold">
               <span className="text-gray-700">Admin:</span>
                <span className={`px-1.5 py-0.5 rounded capitalize ${getStatusColor(request.admin_status || 'pending')}`}>
                 {request.admin_status || 'Pending'}
               </span>
            </div>
         </div>
      )
    },
    {
       header: 'Overall',
       accessor: 'status',
       render: (row) => (
         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(row.status)}`}>
           {row.status}
         </span>
       )
    }
  ];

  const actions = (request) => {
    // Only show actions if admin status is pending
    if (request.admin_status !== 'pending') return null;
    
    return (
      <div className="flex items-center justify-end gap-2">
        <button 
          onClick={() => handleAction(request, 'approved')}
          className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
          title="Approve"
        >
          <CheckCircle size={18} />
        </button>
        <button 
          onClick={() => handleAction(request, 'rejected')}
          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
          title="Reject"
        >
          <XCircle size={18} />
        </button>
      </div>
    );
  };

  return (
    <div className="p-6">
      <ApiTableManager
        title="Leave & Outpass Requests"
        fetchUrl="/bf1/leave-outpass"
        columns={columns}
        actions={actions}
        searchPlaceholder="Search by reason..."
      />
      
      <ApprovalModal 
        isOpen={approvalModal.isOpen}
        onClose={() => setApprovalModal({ isOpen: false, request: null })}
        onConfirm={handleApproveConfirm}
        request={approvalModal.request}
      />

      <RejectionModal 
        isOpen={rejectionModal.isOpen}
        onClose={() => setRejectionModal({ isOpen: false, request: null })}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
};

export default LeaveManagement;
