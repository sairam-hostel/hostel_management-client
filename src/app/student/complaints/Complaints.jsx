import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ComplaintForm from './ComplaintForm';
import api from '../../../utils/api';

const STATUS_COLORS = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Resolved': 'bg-green-100 text-green-800',
  'Rejected': 'bg-red-100 text-red-800',
};

const Complaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bs1/complaints');
      // Handle potentially different response structures
      const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setComplaints(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
      setError("Failed to load complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = (complaint.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (complaint.description || complaint.message || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? complaint.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  if (loading && complaints.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-500">Loading complaints...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Complaints</h1>
          <p className="text-gray-500 text-sm">Manage and track your complaints here</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          <Plus size={18} />
          New Complaint
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="relative w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
          >
            <option value="">All Categories</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Food">Food</option>
            <option value="Cleanliness">Cleanliness</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Complaints List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredComplaints.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint.id || complaint._id}
                onClick={() => navigate(`/student/complaints/${complaint.id || complaint._id}`, { state: { complaint } })}
                className="p-4 hover:bg-gray-50 transition cursor-pointer group"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[complaint.status] || 'bg-gray-100 text-gray-800'}`}>
                        {complaint.status || 'Pending'}
                      </span>
                      <span className="text-xs text-gray-500 font-medium px-2 py-0.5 bg-gray-100 rounded-full">
                        {complaint.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                      {complaint.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-1">{complaint.description || complaint.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString() : (complaint.date || 'unknown date')}
                    </p>
                  </div>
                  <ChevronRight className="text-gray-300 group-hover:text-purple-600 transition-colors" size={20} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            {!loading && "No complaints found."}
          </div>
        )}
      </div>

      {/* Complaint Form Modal */}
      {isFormOpen && (
        <ComplaintForm
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            fetchComplaints();
            setIsFormOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Complaints;
