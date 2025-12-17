import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, MessageSquare, Trash2, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../../../utils/api';

const STATUS_CONFIG = {
  'Pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  'In Progress': { color: 'bg-blue-100 text-blue-800', icon: Clock },
  'Resolved': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'Rejected': { color: 'bg-red-100 text-red-800', icon: XCircle },
};

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [complaint, setComplaint] = useState(location.state?.complaint || null);
  const [loading, setLoading] = useState(!location.state?.complaint);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If we already have the complaint from state, no need to fetch
    if (complaint) {
      setLoading(false);
      return;
    }

    const fetchComplaintDetails = async () => {
      try {
        setLoading(true);
        // First try fetching individual
        try {
          const response = await api.get(`/bs1/complaints/${id}`);
          const data = response.data.data || response.data;
          setComplaint(data);
        } catch (individualErr) {
          console.warn("Individual fetch failed, trying list fetch:", individualErr);
          // Fallback: Fetch all and find
          const response = await api.get('/bs1/complaints');
          const allConfig = Array.isArray(response.data) ? response.data : (response.data.data || []);
          const found = allConfig.find(c => (c.id || c._id) === id);

          if (found) {
            setComplaint(found);
          } else {
            setError("Complaint not found.");
          }
        }
      } catch (err) {
        console.error("Error fetching complaint details:", err);
        setError("Failed to load complaint details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchComplaintDetails();
    }
  }, [id]);


  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      // Implement delete API call here if needed
      // await api.delete(`/bs1/complaints/${id}`);
      alert('Delete functionality to be implemented with API.');
      navigate('/student/complaints');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p className="text-lg font-medium">{error || "Complaint not found"}</p>
        <button
          onClick={() => navigate('/student/complaints')}
          className="mt-4 text-purple-600 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const StatusIcon = STATUS_CONFIG[complaint.status]?.icon || Clock;
  const statusColor = STATUS_CONFIG[complaint.status]?.color || 'bg-gray-100 text-gray-800';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/student/complaints')}
        className="flex items-center gap-2 text-gray-600 hover:text-purple-700 transition font-medium"
      >
        <ArrowLeft size={20} />
        Back to Complaints
      </button>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${statusColor}`}>
                <StatusIcon size={14} />
                {complaint.status || 'Pending'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                {complaint.category}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{complaint.title}</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={16} />
            <span>
              {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString() : (complaint.date || 'Unknown Date')}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8">
          {/* Description */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <FileText size={20} className="text-purple-600" />
              Description
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700 leading-relaxed">
              {complaint.description || complaint.message}
            </div>
          </div>

          {/* Admin Remarks */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <MessageSquare size={20} className="text-purple-600" />
              Admin Remarks
            </h3>
            {complaint.adminRemarks || complaint.admin_response ? (
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 text-gray-800">
                {complaint.adminRemarks || complaint.admin_response}
              </div>
            ) : (
              <div className="text-gray-400 italic pl-1">
                No remarks yet.
              </div>
            )}
          </div>
        </div>

        {/* Footer / Actions */}
        {(complaint.status === 'Pending' || !complaint.status) && (
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition font-medium text-sm"
            >
              <Trash2 size={18} />
              Delete Complaint
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetails;
