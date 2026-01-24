import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import api from '../../../utils/api';
import CustomDropdown from '../../../component/CustomDropdown';
import { useToast } from '../../../context/ToastContext';

const CATEGORIES = ["room", "mess", "hostel", "electric", "water", "discipline", "other"];
const SEVERITIES = ["low", "medium", "high"];

const ComplaintForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    category: '',
    otherCategory: '',
    title: '',
    description: '',
    hostel_block: '',
    room_number: '',
    floor_number: '',
    severity: 'medium',
    is_emergency: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const validate = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = 'Please select a category';
    if (formData.category === 'other' && !formData.otherCategory.trim()) {
      newErrors.otherCategory = 'Please specify the category';
    }
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.hostel_block.trim()) newErrors.hostel_block = 'Block is required';
    if (!formData.room_number.trim()) newErrors.room_number = 'Room No is required';
    if (!formData.floor_number.trim()) newErrors.floor_number = 'Floor No is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare final category
      const finalCategory = formData.category === 'other' && formData.otherCategory
        ? formData.otherCategory
        : formData.category;

      const payload = {
        title: formData.title,
        category: finalCategory,
        description: formData.description,
        hostel_block: formData.hostel_block,
        room_number: formData.room_number,
        floor_number: formData.floor_number,
        severity: formData.severity,
        is_emergency: formData.is_emergency,
        attachments: [] // Placeholder
      };

      const response = await api.post('/bs1/complaints', payload);

      console.log('Submitted Complaint Response:', response.data);
      showToast('Complaint submitted successfully!', 'success');
      if (onSuccess) onSuccess();
      else onClose();

    } catch (err) {
      console.error("Complaint submission error:", err);
      showToast("Failed to submit complaint. Please try again.", 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">New Complaint</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <CustomDropdown
                options={CATEGORIES.map(cat => ({
                  label: cat.charAt(0).toUpperCase() + cat.slice(1),
                  value: cat
                }))}
                value={formData.category}
                onChange={(value) => handleChange({ target: { name: 'category', value } })}
                placeholder="Select Category"
                className={errors.category ? 'border-red-500' : ''}
              />
              {errors.category && (
                <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {errors.category}
                </p>
              )}
            </div>

            {/* Severity */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Severity</label>
              <CustomDropdown
                options={SEVERITIES.map(sev => ({
                  label: sev.charAt(0).toUpperCase() + sev.slice(1),
                  value: sev
                }))}
                value={formData.severity}
                onChange={(value) => handleChange({ target: { name: 'severity', value } })}
                placeholder="Select Severity"
              />
            </div>
          </div>

          {/* Other Category Input */}
          {formData.category === 'other' && (
            <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="text-sm font-medium text-gray-700">Specify Category</label>
              <input
                type="text"
                name="otherCategory"
                value={formData.otherCategory}
                onChange={handleChange}
                placeholder="Enter category name"
                className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 ${errors.otherCategory ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-200'}`}
              />
              {errors.otherCategory && (
                <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {errors.otherCategory}
                </p>
              )}
            </div>
          )}

          {/* Location Details */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Block</label>
              <input
                type="text"
                name="hostel_block"
                value={formData.hostel_block}
                onChange={handleChange}
                placeholder="Block A"
                className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 ${errors.hostel_block ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-200'}`}
              />
              {errors.hostel_block && <p className="text-red-500 text-xs mt-1">{errors.hostel_block}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Floor</label>
              <input
                type="text"
                name="floor_number"
                value={formData.floor_number}
                onChange={handleChange}
                placeholder="2"
                className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 ${errors.floor_number ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-200'}`}
              />
              {errors.floor_number && <p className="text-red-500 text-xs mt-1">{errors.floor_number}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Room No</label>
              <input
                type="text"
                name="room_number"
                value={formData.room_number}
                onChange={handleChange}
                placeholder="203"
                className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 ${errors.room_number ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-200'}`}
              />
              {errors.room_number && <p className="text-red-500 text-xs mt-1">{errors.room_number}</p>}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief summary of the issue (e.g. Water leakage)"
              className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 ${errors.title ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-200'}`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                <AlertCircle size={12} /> {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Detailed description of the problem..."
              className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 resize-none ${errors.description ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-200'}`}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                <AlertCircle size={12} /> {errors.description}
              </p>
            )}
          </div>

          {/* Emergency Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_emergency"
              name="is_emergency"
              checked={formData.is_emergency}
              onChange={handleChange}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label htmlFor="is_emergency" className="text-sm font-medium text-red-600 cursor-pointer">
              Is this an emergency?
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition shadow-md shadow-purple-200 text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;
