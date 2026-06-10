import React, { useState } from 'react';
import { FileText, Gavel } from 'lucide-react';
import ApiTableManager from '../../../component/ApiTableManager';
import api from '../../../utils/api';
import { useToast } from '../../../context/ToastContext';
import LeaveActionModal from './LeaveActionModal';

const LeaveManagement = () => {
  const { showToast } = useToast();
  const [actionModal, setActionModal] = useState({ isOpen: false, request: null });
  const [refreshKey, setRefreshKey] = useState(0); // Trigger for table refresh

  const handleAction = (request) => {
    setActionModal({ isOpen: true, request });
  };

  const handleApproveConfirm = async (formData) => {
    try {
      const request = actionModal.request;
      // Prioritize student_request_id as per API spec
      const id = request.student_request_id || request.request_id || request._id || request.id;
      
      // PATCH endpoint for approval with dates
      await api.patch(`/bf1/leave-outpass/${id}/approve`, formData);
      
      showToast('Request approved successfully', 'success');
      setActionModal({ isOpen: false, request: null });
      setRefreshKey(prev => prev + 1); // Refresh table
    } catch (err) {
        console.error('Error approving request:', err);
        const msg = err.response?.data?.message || 'Failed to approve request';
        showToast(msg, 'error');
    }
  };

  const handleRejectConfirm = async (reason) => {
    try {
      const request = actionModal.request;
      // Prioritize request_id as per API spec
      const id = request.request_id || request._id || request.id;
      
      // PATCH endpoint for rejection with note
      await api.patch(`/bf1/leave-outpass/${id}/reject`, { admin_note: reason });
      
      showToast('Request rejected successfully', 'success');
      setActionModal({ isOpen: false, request: null });
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
      accessor: 'student.name',
      render: (request) => (
        <span className="font-medium text-gray-900">{request.student?.name || 'Loading...'}</span>
      )
    },
    {
      header: 'ID',
      accessor: 'student.roll_number',
      render: (request) => (
         <div className="flex flex-col">
            <span className="text-gray-500 font-mono text-xs">{request.student?.roll_number || '-'}</span>
         </div>
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
           <span className="font-medium">{request.from_date ? new Date(request.from_date).toLocaleDateString() : '-'}</span>
           <span className="text-xs text-gray-400">{request.from_date ? new Date(request.from_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
        </div>
      )
    },
    {
      header: 'To',
      render: (request) => (
         <div className="flex flex-col text-sm text-gray-600">
           <span className="font-medium">{request.to_date ? new Date(request.to_date).toLocaleDateString() : '-'}</span>
           <span className="text-xs text-gray-400">{request.to_date ? new Date(request.to_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
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
      <div className="flex items-center justify-center gap-2">
        <button 
          onClick={() => handleAction(request)}
          className="text-purple-600 hover:text-purple-800 p-1.5 rounded-full hover:bg-purple-50 transition-colors"
          title="Take Decision"
        >
          <Gavel size={18} />
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
      
      <LeaveActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ isOpen: false, request: null })}
        onApprove={handleApproveConfirm}
        onReject={handleRejectConfirm}
        request={actionModal.request}
      />
    </div>
  );
};

export default LeaveManagement;
