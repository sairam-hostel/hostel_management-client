import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Loader, Paperclip, X } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import api from '../../../utils/api';
import InputField from '../../../component/InputField';
import SelectField from '../../../component/SelectField';
import { DEPARTMENTS } from '../../../utils/constants';

const NoticeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [newAttachment, setNewAttachment] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    category: 'general',
    priority: 'medium',
    attachments: [],
    
    // Target Audience
    target_course: 'all',
    target_year: 'all',
    target_department: 'all',
    target_gender: 'all',

    // Validity
    valid_from: new Date().toISOString().split('T')[0],
    valid_till: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 1 week
    expires: true
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchNotice = async () => {
        try {
          const response = await api.get(`/bf1/notices/${id}`);
          const data = response.data.data || response.data;

          // Format dates
          if (data.valid_from) data.valid_from = data.valid_from.split('T')[0];
          if (data.valid_till) data.valid_till = data.valid_till.split('T')[0];

          setFormData(prev => ({ ...prev, ...data }));
        } catch (err) {
          console.error('Error fetching notice:', err);
          setError('Failed to load notice details');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchNotice();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddAttachment = () => {
    if (newAttachment.trim()) {
      setFormData(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), newAttachment.trim()]
      }));
      setNewAttachment('');
    }
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (new Date(formData.valid_from) > new Date(formData.valid_till)) {
      const msg = "Validity end date cannot be earlier than start date";
      setError(msg);
      showToast(msg, 'error');
      setLoading(false);
      return;
    }

    try {
      // Basic payload preparation (add timestamps to dates if needed by backend, but usually ISO string suffices)
      const payload = {
        ...formData,
         // Ensure ISO format with time if backend strictly requires full ISO
         // simple append of time might be safe enough for this context
         valid_from: new Date(formData.valid_from).toISOString(),
         valid_till: new Date(formData.valid_till).toISOString(),
      };

      if (isEditMode) {
        await api.put(`/bf1/notices/${id}`, payload);
        showToast('Notice updated successfully', 'success');
      } else {
        await api.post('/bf1/notices', payload);
        showToast('Notice published successfully', 'success');
      }
      navigate('/admin/notices');
    } catch (err) {
      console.error('Error saving notice:', err);
      const message = err.response?.data?.message || err.message || 'Failed to save notice';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-purple-600" size={32} />
      </div>
    );
  }

  const SectionHeader = ({ title }) => (
    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-6 border-b border-gray-100 pb-2">
      {title}
    </h3>
  );

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-160px)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/notices')}
            className="p-2 hover:bg-white rounded-lg text-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Edit Notice' : 'Create Notice'}
          </h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-70 transition-colors shadow-sm"
        >
          {loading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
          Publish
        </button>
      </div>

      {/* Scrollable Form Container */}
      <div className="flex-1 overflow-y-auto pr-2 pb-4">
        <form className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          
          {/* Basic Info */}
          <div className="space-y-6">
            <InputField 
              label="Notice Title" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Hostel Fee Payment Deadline Extension"
            />
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Message Content <span className="text-red-500">*</span></label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                required
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm w-full transition-shadow resize-y"
                placeholder="Enter the full content of the notice here..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField 
                label="Category" 
                name="category" 
                options={["general", "hostel", "academic", "urgent", "event", "fee"]} 
                value={formData.category} 
                onChange={handleChange} 
                required 
              />
               <SelectField 
                label="Priority" 
                name="priority" 
                options={["low", "medium", "high", "critical"]} 
                value={formData.priority} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <SectionHeader title="Target Audience" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <SelectField 
                label="Target Department" 
                name="target_department" 
                options={["all", ...DEPARTMENTS]} 
                value={formData.target_department} 
                onChange={handleChange} 
                searchable
             />
             <InputField label="Target Course" name="target_course" value={formData.target_course} onChange={handleChange} placeholder="e.g. BTech" />
             <InputField label="Target Year" name="target_year" value={formData.target_year} onChange={handleChange} placeholder="e.g. 1st, 2nd, all" />
             <SelectField 
                label="Gender Group" 
                name="target_gender" 
                options={["all", "male", "female"]} 
                value={formData.target_gender} 
                onChange={handleChange} 
              />
          </div>

          <SectionHeader title="Validity & Attachments" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
             <InputField label="Valid From" name="valid_from" type="date" value={formData.valid_from} onChange={handleChange} required />
             <InputField label="Valid Till" name="valid_till" type="date" value={formData.valid_till} onChange={handleChange} required />
          </div>
          
          <div className="mb-6">
             <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
               <input type="checkbox" name="expires" checked={formData.expires} onChange={handleChange} className="rounded text-purple-600 focus:ring-purple-500" />
               Auto-expire notice after "Valid Till" date
             </label>
          </div>

          <div className="flex flex-col gap-2">
             <label className="text-sm font-medium text-gray-700">Attachments (Optional)</label>
             <div className="flex gap-2">
               <input 
                 type="text" 
                 value={newAttachment}
                 onChange={(e) => setNewAttachment(e.target.value)}
                 placeholder="Enter attachment URL (e.g. Google Drive link)"
                 className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
               />
               <button 
                 type="button" 
                 onClick={handleAddAttachment}
                 className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
               >
                 <Paperclip size={18} />
               </button>
             </div>
             
             {formData.attachments && formData.attachments.length > 0 && (
               <div className="mt-2 space-y-2">
                 {formData.attachments.map((link, idx) => (
                   <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-100 text-xs">
                     <span 
                       className="truncate flex-1 text-blue-600 hover:underline cursor-pointer" 
                       onClick={() => {
                         try {
                           const url = new URL(link);
                           if (['http:', 'https:'].includes(url.protocol.toLowerCase())) {
                             window.open(url.href, '_blank', 'noopener,noreferrer');
                           }
                         } catch (e) {
                           // Invalid URL, ignore
                         }
                       }}
                     >
                       {link}
                     </span>
                     <button type="button" onClick={() => removeAttachment(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                       <X size={14} />
                     </button>
                   </div>
                 ))}
               </div>
             )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default NoticeForm;
