import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Loader, Eye, EyeOff } from 'lucide-react';
import api from '../../utils/api';
import InputField from '../../component/InputField';
import SelectField from '../../component/SelectField';
import { DEPARTMENTS } from '../../utils/constants';

const FacultyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  // If in edit mode, wait for fetch; otherwise ready
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'StrongPass@123',
    role: 'faculty', // 'admin', 'faculty', 'warden'

    gender: '',
    dob: '',
    blood_group: '',
    marital_status: '',

    phone: '',
    alternate_phone: '',

    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    pincode: '',

    department: '',
    designation: '',
    qualification: '',
    experience_years: '',
    joining_date: '',

    hostel_block: '',
    // Will be stored as an array of numbers in the backend, but managed/formatted as needed
    assigned_floors: [],
    // For local string input handling "1, 2"
    assigned_floors_str: '', 

    emergency_contact_name: '',
    emergency_contact_number: '',
    relation: ''
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchFaculty = async () => {
        try {
          const response = await api.get(`/bf1/accounts/faculty/${id}`);
          // Adjust based on actual API response shape
          const data = response.data.data || response.data;

          // Format dates yyyy-MM-dd
          if (data.dob) data.dob = data.dob.split('T')[0];
          if (data.joining_date) data.joining_date = data.joining_date.split('T')[0];

          // Prepare initial floors string from array
          let floorsStr = '';
          if (Array.isArray(data.assigned_floors)) {
            floorsStr = data.assigned_floors.join(', ');
          }

          setFormData(prev => ({
            ...prev,
            ...data,
            assigned_floors_str: floorsStr
          }));
        } catch (err) {
          console.error('Error fetching faculty:', err);
          setError('Failed to load faculty details');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchFaculty();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'experience_years') {
      // Allow 0 as valid value, only treat empty string as missing
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : parseInt(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.department || !formData.role) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (!isEditMode && !formData.password) {
      setError('Password is required for new faculty');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        assigned_floors: formData.assigned_floors_str 
          ? formData.assigned_floors_str.split(',').map(num => parseInt(num.trim())).filter(n => !isNaN(n))
          : []
      };

      // Remove temporary field
      delete payload.assigned_floors_str;
      
      if (isEditMode) {
        delete payload.password; // Don't update password on edit
        await api.put(`/bf1/accounts/faculty/${id}`, payload);
      } else {
        await api.post('/bf1/accounts/faculty/register', payload);
      }
      navigate('/admin/faculty');
    } catch (err) {
      console.error('Error saving faculty:', err);
      const message = err.response?.data?.message || err.message || 'Failed to save faculty';
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
            onClick={() => navigate('/admin/faculty')}
            className="p-2 hover:bg-white rounded-lg text-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Edit Faculty' : 'Add New Faculty'}
          </h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-70 transition-colors shadow-sm"
        >
          {loading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
          Save Faculty
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
                   value={formData.password}
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
          
          <SelectField label="Role" name="role" options={["faculty", "admin", "warden"]} value={formData.role} onChange={handleChange} required />
          <SelectField label="Gender" name="gender" options={["Male", "Female", "Other"]} value={formData.gender} onChange={handleChange} />
          <InputField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
          <SelectField label="Blood Group" name="blood_group" options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]} value={formData.blood_group} onChange={handleChange} />
          <SelectField label="Marital Status" name="marital_status" options={["Single", "Married", "Divorced", "Widowed"]} value={formData.marital_status} onChange={handleChange} />
        </div>

        <SectionHeader title="Professional Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SelectField label="Department" name="department" options={DEPARTMENTS} value={formData.department} onChange={handleChange} required searchable />
          <InputField label="Designation" name="designation" value={formData.designation} onChange={handleChange} required />
          <InputField label="Qualification" name="qualification" value={formData.qualification} onChange={handleChange} />
          <InputField label="Experience (Years)" name="experience_years" type="number" value={formData.experience_years} onChange={handleChange} />
          <InputField label="Joining Date" name="joining_date" type="date" value={formData.joining_date} onChange={handleChange} />
        </div>

        <SectionHeader title="Hostel Responsibility" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Assigned Block" name="hostel_block" value={formData.hostel_block} onChange={handleChange} />
          <InputField 
            label="Assigned Floors (comma separated)" 
            name="assigned_floors_str" 
            placeholder="e.g. 1, 2, 4"
            value={formData.assigned_floors_str} 
            onChange={handleChange} 
          />
        </div>

        <SectionHeader title="Contact Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
          <InputField label="Alternate Phone" name="alternate_phone" value={formData.alternate_phone} onChange={handleChange} />
        </div>

        <SectionHeader title="Address" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Address Line 1" name="address_line_1" className="md:col-span-2" value={formData.address_line_1} onChange={handleChange} />
          <InputField label="Address Line 2" name="address_line_2" className="md:col-span-2" value={formData.address_line_2} onChange={handleChange} />
          <InputField label="City" name="city" value={formData.city} onChange={handleChange} />
          <InputField label="State" name="state" value={formData.state} onChange={handleChange} />
          <InputField label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
        </div>

        <SectionHeader title="Emergency Contact" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField label="Contact Name" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} />
          <InputField label="Contact Number" name="emergency_contact_number" value={formData.emergency_contact_number} onChange={handleChange} />
          <InputField label="Relation" name="relation" value={formData.relation} onChange={handleChange} />
        </div>

      </form>
    </div>
  );
};

export default FacultyForm;
