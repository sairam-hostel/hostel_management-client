import React, { useState } from 'react';
import { Mail, Phone, Edit, Trash2, Shield, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ApiTableManager from '../../component/ApiTableManager';
import api from '../../utils/api';
import ConfirmationModal from '../../component/ConfirmationModal';

const FacultyList = () => {
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, facultyId: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (id) => {
    navigate(`/admin/faculty/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, facultyId: id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.facultyId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/bf1/accounts/faculty/${deleteModal.facultyId}`);
      window.location.reload(); 
    } catch (err) {
      console.error('Failed to delete faculty', err);
      alert('Failed to delete faculty');
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, facultyId: null });
    }
  };

  const columns = [
    {
      header: 'Faculty Info',
      render: (faculty) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
            {faculty.name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{faculty.name || 'Unknown'}</p>
            <p className="text-xs text-gray-500">{faculty.qualification || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Department & Role',
      render: (faculty) => (
        <div>
           <p className="text-sm text-gray-700">{faculty.department || 'N/A'}</p>
           <div className="flex items-center gap-1">
             <Shield size={10} className="text-gray-400"/>
             <span className="text-xs text-gray-500 capitalize">{faculty.role || faculty.designation || 'Faculty'}</span>
           </div>
        </div>
      ),
    },
    {
      header: 'Assigned',
      render: (faculty) => (
        <div>
          <p className="text-xs text-gray-500 mb-1">Block: {faculty.hostel_block || 'N/A'}</p>
          <div className="flex flex-wrap gap-1">
            {faculty.assigned_floors && Array.isArray(faculty.assigned_floors) && faculty.assigned_floors.length > 0 ? (
              faculty.assigned_floors.map((floor, idx) => (
                <span key={idx} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">
                  Fl {floor}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">No floors</span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Contact',
      render: (faculty) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Phone size={12} /> {faculty.phone || 'N/A'}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Mail size={12} /> {faculty.email || 'N/A'}
          </div>
        </div>
      ),
    },
  ];

  const actions = (faculty) => (
    <div className="flex items-center justify-end gap-2">
      <button 
        onClick={() => handleEdit(faculty.auth_user_id)}
        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
        title="Edit"
      >
        <Edit size={16} />
      </button>
      <button 
        onClick={() => handleDeleteClick(faculty.auth_user_id)}
        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => navigate('/admin/create-faculty')}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          Add New Faculty
        </button>
      </div>

      <ApiTableManager
        title="All Faculty"
        fetchUrl="/bf1/accounts/faculty"
        columns={columns}
        actions={actions}
        searchPlaceholder="Search faculty..."
      />
      
      <ConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, facultyId: null })}
        onConfirm={confirmDelete}
        title="Delete Faculty"
        message="Are you sure you want to delete this faculty member? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default FacultyList;
