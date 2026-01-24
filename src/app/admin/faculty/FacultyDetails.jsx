import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Loader, User, Briefcase, Home, Phone, MapPin, Shield } from 'lucide-react';
import api from '../../../utils/api';

const FacultyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await api.get(`/bf1/accounts/faculty/${id}`);
        setFaculty(response.data.data || response.data);
      } catch (err) {
        console.error('Error fetching faculty details:', err);
        setError('Failed to load faculty details');
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  if (error || !faculty) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <p className="text-red-500 font-medium mb-4">{error || 'Faculty not found'}</p>
        <button 
          onClick={() => navigate('/admin/faculty')}
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
      <p className="text-sm font-medium text-gray-900 wrap-break-word">{value || 'N/A'}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/faculty')}
            className="p-2 hover:bg-white rounded-full text-gray-600 transition-colors shadow-sm bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{faculty.name}</h1>
            <p className="text-sm text-gray-500">{faculty.designation} • {faculty.department}</p>
          </div>
        </div>
        <button 
          onClick={() => navigate(`/admin/faculty/edit/${id}`)}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm font-medium text-sm"
        >
          <Edit size={16} />
          Edit Profile
        </button>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Core Info & Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg md:col-span-1">
              <div className="flex flex-col items-center text-center">
                 <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold mb-4 backdrop-blur-sm">
                   {faculty.name?.charAt(0)}
                 </div>
                 <h2 className="text-xl font-bold mb-1">{faculty.name}</h2>
                 <p className="text-blue-100 text-sm mb-4">{faculty.qualification}</p>
                 <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                   <Shield size={12} />
                   <span>Role: {faculty.role}</span>
                 </div>
              </div>
           </div>

           <div className="md:col-span-2 space-y-6">
              <InfoGroup icon={User} title="Personal Details">
                 <InfoItem label="Email" value={faculty.email} />
                 <InfoItem label="Phone" value={faculty.phone} />
                 <InfoItem label="Gender" value={faculty.gender} />
                 <InfoItem label="Date of Birth" value={faculty.dob ? new Date(faculty.dob).toLocaleDateString() : null} />
                 <InfoItem label="Blood Group" value={faculty.blood_group} />
                 <InfoItem label="Marital Status" value={faculty.marital_status} />
              </InfoGroup>
           </div>
        </div>

        {/* Professional & Hostel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <InfoGroup icon={Briefcase} title="Professional Info">
             <InfoItem label="Department" value={faculty.department} />
             <InfoItem label="Designation" value={faculty.designation} />
             <InfoItem label="Qualification" value={faculty.qualification} />
             <InfoItem label="Experience" value={faculty.experience_years ? `${faculty.experience_years} Years` : 'N/A'} />
             <InfoItem label="Joining Date" value={faculty.joining_date ? new Date(faculty.joining_date).toLocaleDateString() : null} />
           </InfoGroup>

           <InfoGroup icon={Home} title="Hostel Responsibility">
             <InfoItem label="Assigned Block" value={faculty.hostel_block} />
             <InfoItem label="Assigned Floors" value={Array.isArray(faculty.assigned_floors) ? faculty.assigned_floors.join(', ') : 'None'} />
           </InfoGroup>
        </div>

        {/* Contact & Emergency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <InfoGroup icon={Phone} title="Additional Contact">
             <InfoItem label="Alternate Phone" value={faculty.alternate_phone} />
             <InfoItem label="Emergency Contact (Name)" value={faculty.emergency_contact_name} />
             <InfoItem label="Emergency Contact (Phone)" value={faculty.emergency_contact_number} />
             <InfoItem label="Relation" value={faculty.relation} />
           </InfoGroup>

           <InfoGroup icon={MapPin} title="Address">
             <InfoItem label="Current Address" value={`${faculty.address_line_1 || ''} ${faculty.address_line_2 || ''}`} fullWidth />
             <InfoItem label="City" value={faculty.city} />
             <InfoItem label="State" value={faculty.state} />
             <InfoItem label="Pincode" value={faculty.pincode} />
           </InfoGroup>
        </div>
      </div>
    </div>
  );
};

export default FacultyDetails;
