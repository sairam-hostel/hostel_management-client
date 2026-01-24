import React, { useState } from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ComplaintForm from './ComplaintForm';
import ApiTableManager from '../../../component/ApiTableManager';

const STATUS_COLORS = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Resolved': 'bg-green-100 text-green-800',
  'Rejected': 'bg-red-100 text-red-800',
};

const Complaints = () => {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const columns = [
    {
      header: 'Title',
      accessor: 'title',
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900">{row.title}</p>
          <p className="text-xs text-gray-500 line-clamp-1">{row.description || row.message}</p>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => (
         <span className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
            {row.category}
         </span>
      )
    },
    {
      header: 'Date',
      accessor: 'created_at',
      render: (row) => (
        <span className="text-sm text-gray-600">
           {row.created_at ? new Date(row.created_at).toLocaleDateString() : (row.date || 'N/A')}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[row.status] || 'bg-gray-100 text-gray-800'}`}>
          {row.status || 'Pending'}
        </span>
      )
    }
  ];

  const actions = (row) => (
    <button
      onClick={() => navigate(`/student/complaints/${row.id || row._id}`, { state: { complaint: row } })}
      className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-purple-600 transition-colors"
    >
      <ChevronRight size={20} />
    </button>
  );

  return (
    <div className="space-y-6">
      
      {/* Intro Section - Optional, ApiTableManager has a title, but we can keep a page header if needed. 
          The user typically likes a clean UI. ApiTableManager handles the 'List' title. 
          We can pass "Complaints" as title to ApiTableManager. */}
      
      <ApiTableManager
        key={refreshTrigger} // Force re-mount/refresh when trigger changes
        fetchUrl="/bs1/complaints"
        title="My Complaints"
        searchPlaceholder="Search by title or description..."
        columns={columns}
        actions={actions}
        headerActions={
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            New Complaint
          </button>
        }
      />

      {/* Complaint Form Modal */}
      {isFormOpen && (
        <ComplaintForm
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setRefreshTrigger(prev => prev + 1); // Trigger table refresh
            setIsFormOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Complaints;
