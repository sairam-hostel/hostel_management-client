import React, { useState } from 'react';
import { Mail, Phone, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ApiTableManager from '../../component/ApiTableManager';
import api from '../../utils/api';
import ConfirmationModal from '../../component/ConfirmationModal';

const StudentList = () => {
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, studentId: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (id) => {
    navigate(`/admin/student/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, studentId: id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.studentId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/bf1/accounts/students/${deleteModal.studentId}`);
      window.location.reload(); 
    } catch (err) {
      console.error('Failed to delete student', err);
      alert('Failed to delete student');
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, studentId: null });
    }
  };

  const columns = [
    {
      header: 'Student Info',
      render: (student) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
            {student.name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{student.name || 'Unknown'}</p>
            <p className="text-xs text-gray-500">{student.roll_number || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Department',
      render: (student) => (
        <div>
          <p className="text-sm text-gray-700">{student.department || 'N/A'}</p>
          <p className="text-xs text-gray-500">Year {student.year || 'N/A'}</p>
        </div>
      ),
    },
    {
      header: 'Room Info',
      render: (student) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
          {student.hostel_block && student.room_number ? `${student.hostel_block} - ${student.room_number}` : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Contact',
      render: (student) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Phone size={12} /> {student.phone || 'N/A'}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Mail size={12} /> {student.email || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (student) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${student.status === 'in' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
          {student.status === 'in' ? 'In Hostel' : (student.status || 'Unknown')}
        </span>
      ),
    },
  ];

  const actions = (student) => (
    <div className="flex items-center justify-end gap-2">
      <button 
        onClick={() => handleEdit(student.auth_user_id)}
        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
        title="Edit"
      >
        <Edit size={16} />
      </button>
      <button 
        onClick={() => handleDeleteClick(student.auth_user_id)}
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
          onClick={() => navigate('/admin/create-student')}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          Add New Student
        </button>
      </div>

      <ApiTableManager
        title="All Students"
        fetchUrl="/bf1/accounts/students"
        columns={columns}
        actions={actions}
        searchPlaceholder="Search students by name or roll number..."
      />
      
      <ConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, studentId: null })}
        onConfirm={confirmDelete}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone and will permanently remove the student's data and access."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default StudentList;

