import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye } from 'lucide-react';
import ApiTableManager from '../../../../component/ApiTableManager';
import api from '../../../../utils/api';

const Outpass = () => {
  const navigate = useNavigate();

  const renderStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'pending';
    let colorClass = 'bg-gray-100 text-gray-700';

    if (s === 'approved') colorClass = 'bg-green-100 text-green-700';
    else if (s === 'rejected') colorClass = 'bg-red-100 text-red-700';
    else if (s === 'pending') colorClass = 'bg-yellow-100 text-yellow-700';

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass} capitalize`}>
        {status || 'Pending'}
      </span>
    );
  };

  const columns = [
    { header: 'Type', accessor: 'type', className: 'font-medium text-gray-900' },
    {
      header: 'From',
      accessor: 'from_date',
      render: (row) => row.from_date ? new Date(row.from_date).toLocaleDateString() : '-'
    },
    {
      header: 'To',
      accessor: 'to_date',
      render: (row) => row.to_date ? new Date(row.to_date).toLocaleDateString() : '-'
    },
    {
      header: 'Mentor',
      accessor: 'mentor_status',
      render: (row) => renderStatusBadge(row.mentor_status)
    },
    {
      header: 'HOD',
      accessor: 'hod_status',
      render: (row) => renderStatusBadge(row.hod_status)
    },
    {
      header: 'Admin',
      accessor: 'admin_status',
      render: (row) => renderStatusBadge(row.admin_status)
    },
    {
      header: 'Applied On',
      accessor: 'created_at',
      render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString() : '-'
    }
  ];

  const actions = (row) => (
    <button
      onClick={() => navigate(`/student/outpass/${row._id}`, { state: { request: row } })}
      className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-purple-600 transition-colors"
      title="View Details"
    >
      <Eye size={18} />
    </button>
  );

  const HeaderActions = () => (
    <button
      onClick={() => navigate('/student/outpass/apply')}
      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium"
    >
      <Plus size={18} />
      <span>Apply New</span>
    </button>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Outpass</h1>
          <p className="text-gray-500 mt-1">Manage your leave requests</p>
        </div>
        <HeaderActions />
      </div>



      {/* History */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Request History</h2>
        <ApiTableManager
          fetchUrl="/bs1/leave-outpass"
          columns={columns}
          actions={actions}
          title="All Requests"
          searchPlaceholder="Search by type or status..."
          noDataComponent={
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-purple-50 p-4 rounded-full mb-4">
                <Plus size={32} className="text-purple-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No requests found</h3>
              <p className="text-gray-500 mb-6 max-w-sm">
                You haven't submitted any outpass requests yet.
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default Outpass;
