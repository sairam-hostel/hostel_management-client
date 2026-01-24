import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, MapPin, MessageSquare, CheckCircle, Eye, Loader2, AlertCircle } from 'lucide-react';
import api from '../../../utils/api';
import { useToast } from '../../../context/ToastContext';
import ConfirmationModal from '../../../component/ConfirmationModal';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [facultyNote, setFacultyNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/bf1/complaints/${id}`);
        setComplaint(response.data.data || response.data); // Handle potential wrapper
      } catch (err) {
        console.error('Failed to fetch complaint details:', err);
        setError('Failed to load complaint details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  const handleMarkAsSeen = async () => {
    try {
      setIsSubmitting(true);
      await api.put(`/bf1/complaints/${id}/update`, {
        status: 'in_progress',
        faculty_note: 'Checking the issue'
      });
      showToast('Complaint marked as seen (In Progress)', 'success');
      // Refresh local state
      setComplaint(prev => ({ ...prev, status: 'in_progress', faculty_note: 'Checking the issue' }));
    } catch (err) {
      console.error('Failed to update status:', err);
      showToast('Failed to update status', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolve = async () => {
    if (!resolutionSummary.trim()) {
      showToast('Please provide a resolution summary', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.put(`/bf1/complaints/${id}/update`, {
        status: 'resolved',
        resolution_summary: resolutionSummary,
        faculty_note: facultyNote || 'Issue resolved.'
      });
      showToast('Complaint resolved successfully', 'success');
      setIsResolveModalOpen(false);
      setComplaint(prev => ({ 
        ...prev, 
        status: 'resolved', 
        resolution_summary: resolutionSummary, 
        faculty_note: facultyNote || 'Issue resolved.' 
      }));
    } catch (err) {
      console.error('Failed to resolve complaint:', err);
      showToast('Failed to resolve complaint', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="animate-spin text-purple-600" size={32} />
    </div>
  );

  if (error || !complaint) return (
    <div className="flex h-64 items-center justify-center text-red-500 gap-2">
      <AlertCircle />
      <span>{error || 'Complaint not found'}</span>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('/admin/complaints')}
        className="flex items-center gap-2 text-gray-500 hover:text-purple-600 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to List
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-3 mb-2">
              {(() => {
                const normalizedStatus = (complaint.status || 'unknown').toLowerCase();
                const badgeColor = {
                  'resolved': 'bg-green-100 text-green-700',
                  'in_progress': 'bg-blue-100 text-blue-700',
                  'rejected': 'bg-red-100 text-red-700',
                  'pending': 'bg-yellow-100 text-yellow-700'
                }[normalizedStatus] || 'bg-gray-100 text-gray-700';
                
                return (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${badgeColor}`}>
                     {normalizedStatus.replace('_', ' ')}
                  </span>
                );
              })()}
              <span className="text-gray-400 text-sm">#{complaint._id?.slice(-6) || 'ID'}</span>
            </div>
              <span className="text-gray-400 text-sm">#{complaint._id?.slice(-6) || 'ID'}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{complaint.title}</h1>
          </div>
          <div className="text-right text-gray-500 text-sm">
             <div className="flex items-center gap-1 justify-end">
              <Calendar size={14} />
              {new Date(complaint.created_at || complaint.date).toLocaleDateString()}
             </div>
             <div className="mt-1">{new Date(complaint.created_at || complaint.date).toLocaleTimeString()}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {/* Main Content */}
          <div className="md:col-span-2 p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MessageSquare size={16} /> Description
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {complaint.description || complaint.message}
              </p>
            </div>

            {complaint.image_url && (
               <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Attachment</h3>
                <img 
                  src={complaint.image_url} 
                  alt="Complaint attachment" 
                  className="rounded-lg border border-gray-200 max-h-80 object-cover"
                />
               </div>
            )}

             {/* Resolution Info (if resolved) */}
            {(complaint.status?.toLowerCase() === 'resolved') && (
              <div className="bg-green-50 border border-green-100 rounded-lg p-4 mt-6">
                <h3 className="text-green-800 font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle size={18} /> Resolution Details
                </h3>
                <div className="space-y-2 text-sm text-green-900">
                  <p><span className="font-medium">Summary:</span> {complaint.resolution_summary}</p>
                  <p><span className="font-medium">Faculty Note:</span> {complaint.faculty_note}</p>
                </div>
              </div>
            )}
            
             {/* Progress Info (if in progress) */}
             {(complaint.status?.toLowerCase() === 'in_progress') && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-6">
                <h3 className="text-blue-800 font-semibold mb-2 flex items-center gap-2">
                  <Loader2 size={18} /> Status Update
                </h3>
                <div className="space-y-2 text-sm text-blue-900">
                  <p><span className="font-medium">Current Status:</span> In Progress</p>
                  <p><span className="font-medium">Faculty Note:</span> {complaint.faculty_note}</p>
                </div>
              </div>
            )}

            {/* Rejection Info (if rejected) */}
            {(complaint.status?.toLowerCase() === 'rejected') && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 mt-6">
                <h3 className="text-red-800 font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle size={18} /> Complaint Rejected
                </h3>
                <div className="space-y-2 text-sm text-red-900">
                   <p><span className="font-medium">Faculty Note:</span> {complaint.faculty_note || 'No additional details provided.'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="p-6 space-y-6 bg-gray-50/50">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Student Details</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                  {complaint.student_name?.charAt(0) || <User size={20} />}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{complaint.student_name || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{complaint.student_roll || 'No Roll Number'}</p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                 <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span>Room: {complaint.room_number || 'N/A'}</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="w-4 h-4 rounded bg-gray-200 flex items-center justify-center text-[10px] text-gray-500 font-bold">B</span>
                   <span>Block: {complaint.hostel_block || 'N/A'}</span>
                 </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
               <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Actions</h3>
               <div className="space-y-3">
                 {(() => {
                   const normalizedStatus = (complaint.status || 'unknown').toLowerCase();
                   const isResolved = normalizedStatus === 'resolved';
                   const isRejected = normalizedStatus === 'rejected';
                   const isInProgress = normalizedStatus === 'in_progress';

                   if (isResolved) {
                      return <p className="text-center text-sm text-gray-500 italic">This complaint has been resolved.</p>;
                   }
                   if (isRejected) {
                      return <p className="text-center text-sm text-gray-500 italic">This complaint has been rejected.</p>;
                   }

                   return (
                     <>
                        {!isInProgress && (
                           <button 
                             onClick={handleMarkAsSeen}
                             disabled={isSubmitting}
                             className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition font-medium text-sm disabled:opacity-50"
                           >
                             <Eye size={16} /> Mark as Seen
                           </button>
                        )}
                        
                        <button 
                          onClick={() => setIsResolveModalOpen(true)}
                          disabled={isSubmitting}
                          className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition font-medium text-sm disabled:opacity-50"
                        >
                          <CheckCircle size={16} /> Resolve Complaint
                        </button>
                     </>
                   );
                 })()}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resolve Modal */}
      <ConfirmationModal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        onConfirm={handleResolve}
        title="Resolve Complaint"
        message={
          <div className="space-y-4 mt-2 text-left">
            <p className="text-sm text-gray-600">Please provide details about the resolution.</p>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Resolution Summary *</label>
              <textarea 
                value={resolutionSummary}
                onChange={(e) => setResolutionSummary(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                rows="3"
                placeholder="e.g., The electrical wiring was repaired..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Faculty Note (Optional)</label>
              <textarea 
                value={facultyNote}
                onChange={(e) => setFacultyNote(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                rows="2"
                placeholder="e.g., Issue resolved by maintenance team..."
              />
            </div>
          </div>
        }
        confirmText="Mark Resolved"
        confirmColor="bg-green-600 hover:bg-green-700"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default ComplaintDetails;
