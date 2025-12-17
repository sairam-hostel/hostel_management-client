import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Loader, Upload, Eye, EyeOff } from 'lucide-react';
import api from '../../utils/api';
import InputField from '../../component/InputField';
import SelectField from '../../component/SelectField';

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'Student@123', // Default for new students
    roll_number: '',
    register_number: '',
    department: '',
    year: '',
    section: '',
    batch: '',
    hostel_block: '',
    room_number: '',
    bed_number: '',
    warden_name: '',
    floor: '',
    gender: '',
    dob: '',
    blood_group: '',
    nationality: 'Indian',
    religion: '',
    community: '',
    phone: '',
    alternate_phone: '',
    whatsapp_number: '',
    father_name: '',
    father_phone: '',
    mother_name: '',
    mother_phone: '',
    guardian_name: '',
    guardian_phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    pincode: '',
    permanent_address: '',
    school_name: '',
    school_board: '',
    school_percentage: '',
    status: 'in'
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchStudent = async () => {
        try {
          // Use 'students' plural and the ID (which is auth_user_id passed from list)
          const response = await api.get(`/bf1/accounts/students/${id}`);
          // API returns { success: true, data: { ... } }
          const studentInfo = response.data.data || response.data;
          
          // Format DOB if present
          if (studentInfo.dob) {
            studentInfo.dob = studentInfo.dob.split('T')[0];
          }

          const { password, ...studentData } = studentInfo;
          setFormData(prev => ({ ...prev, ...studentData }));
        } catch (err) {
          console.error('Error fetching student details:', err);
          setError('Failed to load student details');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchStudent();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        // Update
        // Use 'students' plural
        await api.put(`/bf1/accounts/students/${id}`, formData);
      } else {
        // Create
        await api.post('/bf1/accounts/students/register', formData);
      }
      navigate('/admin'); // Redirect to list
    } catch (err) {
      console.error('Error saving student:', err);
      // Try to extract useful error message from API response
      const message = err.response?.data?.message || err.message || 'Failed to save student';
      setError(message);
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
    <div className="max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin')}
            className="p-2 hover:bg-white rounded-lg text-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Edit Student' : 'Add New Student'}
          </h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-70 transition-colors shadow-sm"
        >
          {loading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
          Save Student
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-100">
          {error}
        </div>
      )}

      <form className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        
        {/* Core Identity */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
          <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required />
          {!isEditMode && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password || ''}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm w-full transition-shadow pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}
          <InputField label="Roll Number" name="roll_number" value={formData.roll_number} onChange={handleChange} required />
          <InputField label="Register Number" name="register_number" value={formData.register_number} onChange={handleChange} required />
          <InputField label="Batch" name="batch" placeholder="e.g. 2023" value={formData.batch} onChange={handleChange} />
        </div>

        <SectionHeader title="Academic Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InputField label="Department" name="department" value={formData.department} onChange={handleChange} required />
          <SelectField label="Year" name="year" options={["1", "2", "3", "4", "5"]} value={formData.year} onChange={handleChange} required />
          <InputField label="Section" name="section" value={formData.section} onChange={handleChange} />
          <InputField label="School Name" name="school_name" value={formData.school_name} onChange={handleChange} />
          <InputField label="School Board" name="school_board" value={formData.school_board} onChange={handleChange} />
          <InputField label="School %" name="school_percentage" type="number" step="0.01" value={formData.school_percentage} onChange={handleChange} />
        </div>

        <SectionHeader title="Hostel Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InputField label="Block" name="hostel_block" value={formData.hostel_block} onChange={handleChange} required />
          <InputField label="Room Number" name="room_number" value={formData.room_number} onChange={handleChange} required />
          <InputField label="Bed Number" name="bed_number" value={formData.bed_number} onChange={handleChange} />
          <InputField label="Floor" name="floor" type="number" value={formData.floor} onChange={handleChange} />
          <InputField label="Warden Name" name="warden_name" value={formData.warden_name} onChange={handleChange} />
          <SelectField label="Status" name="status" options={["in", "out", "waiting"]} value={formData.status} onChange={handleChange} required />
        </div>

        <SectionHeader title="Personal Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SelectField label="Gender" name="gender" options={["Male", "Female", "Other"]} value={formData.gender} onChange={handleChange} required />
          <InputField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
          <SelectField label="Blood Group" name="blood_group" options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]} value={formData.blood_group} onChange={handleChange} />
          <InputField label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} />
          <InputField label="Religion" name="religion" value={formData.religion} onChange={handleChange} />
          <InputField label="Community" name="community" value={formData.community} onChange={handleChange} />
        </div>

        <SectionHeader title="Contact Information" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
          <InputField label="Alternate Phone" name="alternate_phone" value={formData.alternate_phone} onChange={handleChange} />
          <InputField label="WhatsApp Number" name="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} />
        </div>

        <SectionHeader title="Family Details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Father's Name" name="father_name" value={formData.father_name} onChange={handleChange} />
          <InputField label="Father's Phone" name="father_phone" value={formData.father_phone} onChange={handleChange} />
          <InputField label="Mother's Name" name="mother_name" value={formData.mother_name} onChange={handleChange} />
          <InputField label="Mother's Phone" name="mother_phone" value={formData.mother_phone} onChange={handleChange} />
          <InputField label="Guardian's Name" name="guardian_name" value={formData.guardian_name} onChange={handleChange} />
          <InputField label="Guardian's Phone" name="guardian_phone" value={formData.guardian_phone} onChange={handleChange} />
        </div>

        <SectionHeader title="Address" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Address Line 1" name="address_line_1" className="md:col-span-2" value={formData.address_line_1} onChange={handleChange} />
          <InputField label="Address Line 2" name="address_line_2" className="md:col-span-2" value={formData.address_line_2} onChange={handleChange} />
          <InputField label="City" name="city" value={formData.city} onChange={handleChange} />
          <InputField label="State" name="state" value={formData.state} onChange={handleChange} />
          <InputField label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
          <InputField label="Permanent Address" name="permanent_address" className="md:col-span-2" value={formData.permanent_address} onChange={handleChange} />
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
