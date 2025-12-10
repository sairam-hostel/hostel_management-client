import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Loader, User, Book, Home, Phone, MapPin, Users } from 'lucide-react';
import api from '../../utils/api';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await api.get(`/bf1/accounts/students/${id}`);
        setStudent(response.data.data || response.data);
      } catch (err) {
        console.error('Error fetching student details:', err);
        setError('Failed to load student details');
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <p className="text-red-500 font-medium mb-4">{error || 'Student not found'}</p>
        <button 
          onClick={() => navigate('/admin')}
          className="text-purple-600 hover:text-purple-800 flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to List
        </button>
      </div>
    );
  }

  const InfoGroup = ({ icon: Icon, title, children }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-50">
        <Icon size={20} className="text-purple-500" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
        {children}
      </div>
    </div>
  );

  const InfoItem = ({ label, value, fullWidth = false }) => (
    <div className={`${fullWidth ? 'md:col-span-2' : ''}`}>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900 break-words">{value || 'N/A'}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin')}
            className="p-2 hover:bg-white rounded-full text-gray-600 transition-colors shadow-sm bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
            <p className="text-sm text-gray-500">{student.roll_number} • {student.department}</p>
          </div>
        </div>
        <button 
          onClick={() => navigate(`/admin/student/edit/${id}`)}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm font-medium text-sm"
        >
          <Edit size={16} />
          Edit Profile
        </button>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Core Info & Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg md:col-span-1">
              <div className="flex flex-col items-center text-center">
                 <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold mb-4 backdrop-blur-sm">
                   {student.name?.charAt(0)}
                 </div>
                 <h2 className="text-xl font-bold mb-1">{student.name}</h2>
                 <p className="text-purple-100 text-sm mb-4">{student.register_number}</p>
                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                   ${student.status === 'in' ? 'bg-green-400/20 text-green-100' : 'bg-yellow-400/20 text-yellow-100'}`}>
                   Status: {student.status}
                 </span>
              </div>
           </div>

           <div className="md:col-span-2 space-y-6">
              <InfoGroup icon={User} title="Personal Details">
                 <InfoItem label="Email" value={student.email} />
                 <InfoItem label="Phone" value={student.phone} />
                 <InfoItem label="Gender" value={student.gender} />
                 <InfoItem label="Date of Birth" value={student.dob ? new Date(student.dob).toLocaleDateString() : null} />
                 <InfoItem label="Blood Group" value={student.blood_group} />
                 <InfoItem label="Nationality" value={student.nationality} />
              </InfoGroup>
           </div>
        </div>

        {/* Academic & Hostel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <InfoGroup icon={Book} title="Academic Info">
             <InfoItem label="Department" value={student.department} />
             <InfoItem label="Year" value={student.year} />
             <InfoItem label="Section" value={student.section} />
             <InfoItem label="Batch" value={student.batch} />
             <InfoItem label="School Name" value={student.school_name} />
             <InfoItem label="School Board" value={student.school_board} />
           </InfoGroup>

           <InfoGroup icon={Home} title="Hostel Details">
             <InfoItem label="Block" value={student.hostel_block} />
             <InfoItem label="Room Number" value={student.room_number} />
             <InfoItem label="Bed Number" value={student.bed_number} />
             <InfoItem label="Floor" value={student.floor} />
             <InfoItem label="Warden Name" value={student.warden_name} />
           </InfoGroup>
        </div>

        {/* Family & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <InfoGroup icon={Users} title="Family Information">
             <InfoItem label="Father's Name" value={student.father_name} />
             <InfoItem label="Father's Phone" value={student.father_phone} />
             <InfoItem label="Mother's Name" value={student.mother_name} />
             <InfoItem label="Mother's Phone" value={student.mother_phone} />
             <InfoItem label="Guardian's Name" value={student.guardian_name} />
             <InfoItem label="Guardian's Phone" value={student.guardian_phone} />
           </InfoGroup>

           <InfoGroup icon={MapPin} title="Address">
             <InfoItem label="Current Address" value={`${student.address_line_1 || ''} ${student.address_line_2 || ''}`} fullWidth />
             <InfoItem label="City" value={student.city} />
             <InfoItem label="State" value={student.state} />
             <InfoItem label="Pincode" value={student.pincode} />
             <InfoItem label="Permanent Address" value={student.permanent_address} fullWidth />
           </InfoGroup>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
