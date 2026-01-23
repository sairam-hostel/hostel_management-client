import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import ApiTableManager from '../../component/ApiTableManager';

const STATUS_CONFIG = {
  'pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  'in_progress': { color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
  'resolved': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'rejected': { color: 'bg-red-100 text-red-800', icon: XCircle },
};

const ComplaintList = () => {
  const navigate = useNavigate();

  const columns = [
    {
      header: 'Student Info',
      render: (complaint) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{complaint.student_name || 'Unknown Student'}</span>
          <span className="text-xs text-gray-500">{complaint.student_roll || 'N/A'}</span>
        </div>
      ),
    },
    {
      header: 'Complaint',
      render: (complaint) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{complaint.title}</span>
          <span className="text-xs text-gray-500 capitalize">{complaint.category}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (complaint) => {
        const normalizedStatus = (complaint.status || 'pending').toLowerCase();
        const statusConfig = STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG['pending'];
        const Icon = statusConfig.icon;
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1 ${statusConfig.color}`}>
            <Icon size={12} />
            <span className="capitalize">{normalizedStatus.replace('_', ' ')}</span>
          </span>
        );
      },
    },
    {
      header: 'Date',
      render: (complaint) => (
        <span className="text-sm text-gray-600">
          {new Date(complaint.created_at || complaint.date).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const actions = (complaint) => (
    <button
      onClick={() => navigate(`/admin/complaints/${complaint._id || complaint.id}`)}
      className="text-purple-600 hover:text-purple-900 p-1 rounded-full hover:bg-purple-50 transition-colors"
      title="View Details"
    >
      <Eye size={18} />
    </button>
  );

  return (
    <div className="p-6">
      <ApiTableManager
        title="Student Complaints"
        fetchUrl="/bf1/complaints"
        columns={columns}
        actions={actions}
        searchPlaceholder="Search Complaints..."
      />
    </div>
  );
};

export default ComplaintList;
