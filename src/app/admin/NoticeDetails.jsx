import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Loader, Bell, Calendar, Users, Paperclip, AlertTriangle } from 'lucide-react';
import api from '../../utils/api';

const NoticeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await api.get(`/bf1/notices/${id}`);
        setNotice(response.data.data || response.data);
      } catch (err) {
        console.error('Error fetching notice details:', err);
        setError('Failed to load notice details');
      } finally {
        setLoading(false);
      }
    };
    fetchNotice();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <p className="text-red-500 font-medium mb-4">{error || 'Notice not found'}</p>
        <button 
          onClick={() => navigate('/admin/notices')}
          className="text-purple-600 hover:text-purple-800 flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to List
        </button>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const safeDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return !isNaN(d.getTime()) ? d.toLocaleDateString() : '—';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/notices')}
            className="p-2 hover:bg-white rounded-full text-gray-600 transition-colors shadow-sm bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              Notice Details
              <span className={`text-xs px-2 py-0.5 rounded-full border uppercase tracking-wider ${getPriorityColor(notice.priority || 'Normal')}`}>
                {notice.priority || 'Normal'}
              </span>
            </h1>
            <p className="text-sm text-gray-500 capitalize">{notice.category || 'General'} • Posted on {safeDate(notice.created_at)}</p>
          </div>
        </div>
        <button 
          onClick={() => navigate(`/admin/notices/edit/${id}`)}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm font-medium text-sm"
        >
          <Edit size={16} />
          Edit Notice
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
             <h2 className="text-xl font-bold text-gray-900 mb-6">{notice.title}</h2>
             <div className="prose prose-purple max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
               {notice.message}
             </div>
          </div>
          
          {/* Attachments Section */}
          {notice.attachments && notice.attachments.length > 0 && (
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
               <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                 <Paperclip size={16} /> Attachments
               </h3>
               <div className="flex flex-wrap gap-3">
                 {notice.attachments.map((link, idx) => (
                   <a 
                     key={idx} 
                     href={link} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-blue-600 hover:text-blue-800 hover:border-blue-300 transition-colors shadow-sm"
                   >
                     <span className="truncate max-w-xs">{link}</span>
                   </a>
                 ))}
               </div>
            </div>
          )}
        </div>

        {/* Meta Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
           {/* Target Audience */}
           <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-50">
                <Users size={20} className="text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-800">Target Audience</h3>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between items-center">
                   <span className="text-sm text-gray-500">Department</span>
                   <span className="text-sm font-medium text-gray-900 capitalize">{notice.target_department === 'all' ? 'All Departments' : notice.target_department}</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-sm text-gray-500">Course</span>
                   <span className="text-sm font-medium text-gray-900 capitalize">{notice.target_course || 'All'}</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-sm text-gray-500">Year</span>
                   <span className="text-sm font-medium text-gray-900 capitalize">{notice.target_year === 'all' ? 'All Years' : notice.target_year}</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-sm text-gray-500">Gender</span>
                   <span className="text-sm font-medium text-gray-900 capitalize">{notice.target_gender === 'all' ? 'All Students' : notice.target_gender}</span>
                 </div>
              </div>
           </div>

           {/* Validity */}
           <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-50">
                <Calendar size={20} className="text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-800">Validity Period</h3>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                    <span className="text-sm text-green-700">Valid From</span>
                    <span className="font-semibold text-green-800">{safeDate(notice.valid_from)}</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                    <span className="text-sm text-red-700">Valid Till</span>
                    <span className="font-semibold text-red-800">{safeDate(notice.valid_till)}</span>
                 </div>
                 {notice.expires && (
                   <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 p-2 rounded justify-center">
                     <AlertTriangle size={12} />
                     Auto-expires after end date
                   </div>
                 )}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default NoticeDetails;
