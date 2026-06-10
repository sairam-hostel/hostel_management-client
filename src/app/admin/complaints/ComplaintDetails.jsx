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
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [facultyNote, setFacultyNote] = useState('');
  const [rejectionNote, setRejectionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Define a list of IDs to try for direct fetch
        const idAttempts = [id].filter(Boolean);
        let dataFound = null;

        for (const attemptId of idAttempts) {
          try {
            // Silence console during these attempts if possible, or just be prepared for 404
            const response = await api.get(`/bf1/complaints/${attemptId}`);
            dataFound = response.data.data || response.data;
            if (dataFound) {
              console.log(`Successfully fetched complaint with ID ${attemptId}`);
              break;
            }
          } catch (e) {
            // Ignore 404 for individual attempts
          }
        }

        if (dataFound) {
          setComplaint(dataFound);
          return;
        }

        // Fallback: fetch all and filter
        console.warn('Direct fetch failed for all known IDs, trying list fallback...');
        const listResponse = await api.get('/bf1/complaints');
        const listData = listResponse.data.data || listResponse.data || [];

        const list = Array.isArray(listData) ? listData : [];
        const found = list.find(c =>
          (c.complaint_id === id) ||
          (c._id === id) ||
          (c.id === id)
        );

        if (found) {
          console.log('Complaint found in list fallback:', found);
          setComplaint(found);
        } else {
          console.error('Complaint not found in list fallback. ID looked for:', id);
          throw new Error('Complaint not found');
        }
      } catch (err) {
        console.error('Final fetch error:', err);
        setError('Failed to load complaint details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  const updateComplaintStatus = async (status, noteData = {}) => {
    // Collect all possible note field names and normalize the payload
    const note = noteData.faculty_note || noteData.rejectionNote || noteData.resolution_summary || '';

    // Status normalization
    const statusVal = status.toLowerCase();
    const action = statusVal === 'resolved' ? 'resolve' : (statusVal === 'seen' ? 'seen' : statusVal.replace('_', '-'));

    // ID prioritization: Postman uses faculty_complaint_id which likely maps to complaint_id
    const idList = [...new Set([
      complaint?.complaint_id,
      complaint?.id,
      complaint?._id,
      id
    ])].filter(Boolean);

    console.log('Attempting status update using identified IDs:', idList);

    let lastErr = null;

    for (const currentId of idList) {
      // 1. Try Documented Action-based Endpoints (POST /bf1/complaints/:id/resolve)
      const documentedRoute = `/bf1/complaints/${currentId}/${action}`;
      try {
        console.log(`Trying DOCUMENTED POST ${documentedRoute}...`);
        const payload = {
          resolution_summary: note,
          faculty_note: note,
          admin_note: note,
          remarks: note,
          status: status, // Include just in case
          ...noteData
        };
        const response = await api.post(documentedRoute, payload);
        console.log(`SUCCESS on Documented Route:`, response.data);
        return response;
      } catch (err) {
        console.warn(`Documented POST ${documentedRoute} failed, trying general fallbacks...`);
        lastErr = err;
      }

      // 2. Try General PATCH /bf1/complaints/:id as a fallback
      try {
        const fallbackRoute = `/bf1/complaints/${currentId}`;
        console.log(`Trying FALLBACK PATCH ${fallbackRoute}...`);
        const response = await api.patch(fallbackRoute, {
          status: status,
          resolution_summary: note,
          faculty_note: note,
          ...noteData
        });
        console.log(`SUCCESS on Fallback PATCH:`, response.data);
        return response;
      } catch (err) {
        lastErr = err;
      }
    }

    throw lastErr;
  };

  const handleMarkAsSeen = async () => {
    try {
      setIsSubmitting(true);
      // Use 'seen' for the API action to match documentation
      await updateComplaintStatus('seen', { faculty_note: 'Checking the issue' });
      showToast('Complaint marked as seen (In Progress)', 'success');
      // Update UI state to in_progress as that's the intended logical flow
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
      const updateData = {
        resolution_summary: resolutionSummary,
        faculty_note: facultyNote || 'Issue resolved.'
      };
      await updateComplaintStatus('resolved', updateData);
      showToast('Complaint resolved successfully', 'success');
      setIsResolveModalOpen(false);
      setComplaint(prev => ({
        ...prev,
        status: 'resolved',
        ...updateData
      }));
    } catch (err) {
      console.error('Failed to resolve complaint:', err);
      showToast('Failed to resolve complaint', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionNote.trim()) {
      showToast('Please provide a reason for rejection', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateComplaintStatus('rejected', { faculty_note: rejectionNote });
      showToast('Complaint rejected', 'success');
      setIsRejectModalOpen(false);
      setComplaint(prev => ({
        ...prev,
        status: 'rejected',
        faculty_note: rejectionNote
      }));
    } catch (err) {
      console.error('Failed to reject complaint:', err);
      showToast('Failed to reject complaint', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-purple-600" size={40} />
        <p className="text-gray-500 font-medium animate-pulse">Loading complaint details...</p>
      </div>
    </div>
  );

  if (error || !complaint) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{error || 'Complaint Not Found'}</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          The complaint you're looking for might have been removed, or the ID is invalid.
          Please check the complaints list again.
        </p>
        <button
          onClick={() => navigate('/admin/complaints')}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-all font-semibold shadow-lg shadow-purple-200"
        >
          <ArrowLeft size={20} /> Back to Complaints
        </button>
      </div>
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

                      <button
                        onClick={() => setIsRejectModalOpen(true)}
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 py-2 rounded-lg hover:bg-red-50 transition font-medium text-sm disabled:opacity-50"
                      >
                        <AlertCircle size={16} /> Reject Complaint
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

      {/* Reject Modal */}
      <ConfirmationModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleReject}
        title="Reject Complaint"
        message={
          <div className="space-y-4 mt-2 text-left">
            <p className="text-sm text-gray-600">Please provide a reason for rejecting this complaint. This will be visible to the student.</p>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Rejection Reason *</label>
              <textarea
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                rows="3"
                placeholder="e.g., This is a duplicate request or not a valid complaint..."
              />
            </div>
          </div>
        }
        confirmText="Confirm Reject"
        confirmColor="bg-red-600 hover:bg-red-700"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default ComplaintDetails;
