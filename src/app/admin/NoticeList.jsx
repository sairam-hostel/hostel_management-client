import React, { useState } from 'react';
import { Edit, Trash2, Bell, AlertTriangle, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ApiTableManager from '../../component/ApiTableManager';
import api from '../../utils/api';
import ConfirmationModal from '../../component/ConfirmationModal';

const NoticeList = () => {
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, noticeId: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (id) => {
    navigate(`/admin/notices/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, noticeId: id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.noticeId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/bf1/notices/${deleteModal.noticeId}`);
      window.location.reload(); 
    } catch (err) {
      console.error('Failed to delete notice', err);
      alert('Failed to delete notice');
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, noticeId: null });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-blue-100 text-blue-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const columns = [
    {
      header: 'Notice Title',
      render: (notice) => (
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-purple-50 text-purple-600 mt-1">
            <Bell size={16} />
          </div>
          <div 
            onClick={() => navigate(`/admin/notices/view/${notice.notice_id || notice._id || notice.id}`)}
            className="cursor-pointer hover:bg-gray-50 rounded p-1 -ml-1 transition-colors flex-1"
          >
            <p className="text-sm font-semibold text-gray-900 line-clamp-1 hover:text-purple-700">{notice.title || 'Untitled Notice'}</p>
            <p className="text-xs text-gray-500 line-clamp-2 max-w-md">{notice.message || 'No content'}</p>
            <div className="flex gap-2 mt-1">
               <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${getPriorityColor(notice.priority)}`}>
                 {notice.priority || 'Normal'}
               </span>
               <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize border border-gray-200">
                 {notice.category || 'General'}
               </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Target Audience',
      render: (notice) => (
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex items-center gap-1.5">
            <Users size={12} className="text-gray-400"/>
            <span>Dep: {notice.target_department === 'all' ? 'All' : notice.target_department}</span>
          </div>
          <div className="pl-4.5">
             <span>Year: {notice.target_year === 'all' ? 'All' : notice.target_year}</span>
             <span className="mx-2">|</span>
             <span className="capitalize">{notice.target_gender || 'All'}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Validity',
      render: (notice) => (
        <div className="text-xs text-gray-600">
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar size={12} className="text-gray-400"/>
            <span className="font-medium">Valid Until:</span>
          </div>
          <p>{notice.valid_till ? new Date(notice.valid_till).toLocaleDateString() : 'No expiry'}</p>
          {notice.expires && <span className="text-[10px] text-orange-500 mt-1 block">Expiring Notice</span>}
        </div>
      ),
    },
  ];

  const actions = (notice) => (
    <div className="flex items-center justify-end gap-2">
      <button 
        onClick={() => handleEdit(notice.notice_id || notice._id || notice.id)} // Flexible ID check
        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
        title="Edit"
      >
        <Edit size={16} />
      </button>
      <button 
        onClick={() => handleDeleteClick(notice.notice_id || notice._id || notice.id)}
        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Notice Board</h1>
           <p className="text-sm text-gray-500 mt-1">Manage announcements and circulars for students</p>
        </div>
        <button 
          onClick={() => navigate('/admin/create-notice')}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Bell size={16} />
          Create Notice
        </button>
      </div>

      <ApiTableManager
        title="Active Notices"
        fetchUrl="/bf1/notices"
        columns={columns}
        actions={actions}
        searchPlaceholder="Search notices..."
      />
      
      <ConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, noticeId: null })}
        onConfirm={confirmDelete}
        title="Delete Notice"
        message="Are you sure you want to delete this notice? Updates will no longer be visible to students."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default NoticeList;
