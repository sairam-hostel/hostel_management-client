import React, { useState } from 'react';
import { CheckCircle, XCircle, FileText } from 'lucide-react';
import ApiTableManager from '../../../component/ApiTableManager';
import api from '../../../utils/api';
import { useToast } from '../../../context/ToastContext';
import ApprovalModal from './ApprovalModal';
import RejectionModal from './RejectionModal';

const LeaveManagement = () => {
  const { showToast } = useToast();
  const [approvalModal, setApprovalModal] = useState({ isOpen: false, request: null });
  const [rejectionModal, setRejectionModal] = useState({ isOpen: false, request: null });
  const [refreshKey, setRefreshKey] = useState(0); // Trigger for table refresh
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
      // Prioritize student_request_id as per API spec
      const id = request.student_request_id || request.request_id || request._id || request.id;
      
      // PATCH endpoint for approval with dates
      await api.patch(`/bf1/leave-outpass/${id}/approve`, formData);
      
      showToast('Request approved successfully', 'success');
      setApprovalModal({ isOpen: false, request: null });
      setRefreshKey(prev => prev + 1); // Refresh table
    } catch (err) {
        console.error('Error approving request:', err);
        const msg = err.response?.data?.message || 'Failed to approve request';
        showToast(msg, 'error');
    }
  };

  const handleRejectConfirm = async (reason) => {
    try {
      const request = rejectionModal.request;
      // Prioritize request_id as per API spec
      const id = request.request_id || request._id || request.id;
      
      // PATCH endpoint for rejection with note
      await api.patch(`/bf1/leave-outpass/${id}/reject`, { admin_note: reason });
      
      showToast('Request rejected successfully', 'success');
      setRejectionModal({ isOpen: false, request: null });
      setRefreshKey(prev => prev + 1); // Refresh table
    } catch (err) {
        console.error('Error rejecting request:', err);
        const msg = err.response?.data?.message || 'Failed to reject request';
        showToast(msg, 'error');
    }
  };



  const columns = [
    {
      header: 'Student Name',
      accessor: 'student_name',
      render: (request) => (
        <span className="font-medium text-gray-900">{request.student_name || 'Loading...'}</span>
      )
    },
    {
      header: 'ID',
      accessor: 'roll_number',
      render: (request) => (
        <span className="text-gray-500 font-mono text-xs">{request.roll_number || request.student_id || '-'}</span>
      )
    },
    {
      header: 'Nature',
      accessor: 'type',
      render: (request) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
          ${request.type === 'outpass' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
          {request.type || 'N/A'}
        </span>
      )
    },
    {
      header: 'From',
      render: (request) => (
        <div className="flex flex-col text-sm text-gray-600">
           <span className="font-medium">{new Date(request.from_date).toLocaleDateString()}</span>
           {/* <span className="text-xs text-gray-400">{new Date(request.from_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span> */}
        </div>
      )
    },
    {
      header: 'To',
      render: (request) => (
         <div className="flex flex-col text-sm text-gray-600">
           <span className="font-medium">{new Date(request.to_date).toLocaleDateString()}</span>
           {/* <span className="text-xs text-gray-400">{new Date(request.to_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span> */}
        </div>
      )
    },
    {
       header: 'Reason',
       render: (request) => (
         <div className="max-w-xs">
            <p className="text-sm text-gray-900 truncate" title={request.request_reason}>{request.request_reason || 'No reason'}</p>
            {request.place_to_visit && (
               <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <FileText size={10} /> {request.place_to_visit}
               </p>
            )}
         </div>
       )
    },
    {
      header: 'Current Level',
      accessor: 'current_level',
      render: (request) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
          ${request.current_level === 'admin' ? 'bg-purple-100 text-purple-700' :
            request.current_level === 'hod' ? 'bg-blue-100 text-blue-700' : 
            'bg-yellow-100 text-yellow-700'}`}>
           {request.current_level || 'Pending'}
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
        key={refreshKey} // Force re-render/fetch on update
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
