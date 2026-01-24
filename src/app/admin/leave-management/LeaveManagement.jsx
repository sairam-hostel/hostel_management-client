import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Calendar, FileText } from 'lucide-react';

const MOCK_LEAVE_REQUESTS = [
  {
    id: 1,
    studentName: 'Priya Sharma',
    rollNo: '21CS045',
    type: 'Medical Leave',
    fromDate: '2023-11-15',
    toDate: '2023-11-18',
    reason: 'Suffering from viral fever. Doctor advised rest.',
    status: 'Pending',
    appliedOn: '2023-11-14',
  },
  {
    id: 2,
    studentName: 'Arjun Kumar',
    rollNo: '21IT001',
    type: 'Outpass',
    fromDate: '2023-11-20',
    toDate: '2023-11-20',
    reason: 'Going to buy project components.',
    status: 'Pending',
    appliedOn: '2023-11-19',
  },
  {
    id: 3,
    studentName: 'Sneha Gupta',
    rollNo: '20EC089',
    type: 'Home Visit',
    fromDate: '2023-11-25',
    toDate: '2023-11-27',
    reason: 'Family function at home.',
    status: 'Approved',
    appliedOn: '2023-11-10',
  },
  {
    id: 4,
    studentName: 'Rahul Verma',
    rollNo: '22ME012',
    type: 'Medical Leave',
    fromDate: '2023-11-10',
    toDate: '2023-11-12',
    reason: 'Dental appointment.',
    status: 'Rejected',
    appliedOn: '2023-11-09',
  },
];

const LeaveManagement = () => {
  const [requests, setRequests] = useState(MOCK_LEAVE_REQUESTS);
  const [filter, setFilter] = useState('Pending');

  const handleAction = (id, action) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: action === 'approve' ? 'Approved' : 'Rejected' } : req
    ));
  };

  const filteredRequests = requests.filter(req => 
    filter === 'All' ? true : req.status === filter
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-50 text-green-700 border-green-100';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-yellow-50 text-yellow-700 border-yellow-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Leave Requests</h2>
        
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-100">
          {['Pending', 'Approved', 'Rejected', 'All'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${filter === status 
                  ? 'bg-purple-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                  {request.studentName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{request.studentName}</h3>
                  <p className="text-xs text-gray-500">{request.rollNo}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText size={16} className="text-purple-500" />
                <span className="font-medium text-gray-900">{request.type}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} className="text-purple-500" />
                <span>{request.fromDate} <span className="text-gray-400">to</span> {request.toDate}</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 italic">
                "{request.reason}"
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock size={14} />
                Applied on {request.appliedOn}
              </div>
            </div>

            {request.status === 'Pending' && (
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleAction(request.id, 'approve')}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <CheckCircle size={16} /> Approve
                </button>
                <button 
                  onClick={() => handleAction(request.id, 'reject')}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-medium transition-colors border border-red-200"
                >
                  <XCircle size={16} /> Reject
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
            <FileText size={48} className="mb-4 opacity-20" />
            <p>No {filter.toLowerCase()} requests found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveManagement;
