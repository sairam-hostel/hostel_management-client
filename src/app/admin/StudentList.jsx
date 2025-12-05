import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Mail, Phone, Loader } from 'lucide-react';
import TableManager from '../../component/TableManager';
import api from '../../utils/api';

const StudentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get('/bf1/profile');
        const data = response.data;
        console.log('Fetched Students:', data); // Log for debugging
        // Ensure data is an array, if not wrap it or handle accordingly
        const studentArray = Array.isArray(data) ? data : [data];
        setStudents(studentArray);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError(err.message || 'Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student =>
    (student.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (student.rollNo?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

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
            <p className="text-xs text-gray-500">{student.rollNo || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Department',
      render: (student) => (
        <div>
          <p className="text-sm text-gray-700">{student.dept || student.department || 'N/A'}</p>
          <p className="text-xs text-gray-500">Year {student.year || 'N/A'}</p>
        </div>
      ),
    },
    {
      header: 'Room Info',
      render: (student) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
          {student.room || 'N/A'}
        </span>
      ),
    },
    {
      header: 'Contact',
      render: (student) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Phone size={12} /> {student.contact || student.phone || 'N/A'}
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
          ${student.status === 'Present' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
          {student.status || 'Unknown'}
        </span>
      ),
    },
  ];

  const actions = (student) => (
    <button className="text-gray-400 hover:text-gray-600">
      <MoreVertical size={18} />
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-gray-100">
        <Loader className="animate-spin text-purple-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-gray-100 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header Controls */}
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-800">All Students</h2>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <TableManager 
        columns={columns} 
        data={filteredStudents} 
        actions={actions} 
      />
      
      {/* Pagination (Static for now) */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <p>Showing {filteredStudents.length} students</p>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
          <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
