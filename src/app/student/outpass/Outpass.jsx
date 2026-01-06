import React from 'react';
import CustomDropdown from '../../../component/CustomDropdown';

const Outpass = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    year: '',
    department: '',
    fromLeave: '',
    toLeave: '',
    reason: '',
    proof: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'proof' && files && files[0]) {
      const file = files[0];
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF or image file (JPG, PNG)');
        e.target.value = null;
        return;
      }

      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        e.target.value = null;
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Date Validation
    if (
      formData.fromLeave &&
      formData.toLeave &&
      formData.fromLeave > formData.toLeave
    ) {
      alert("End date must be after or equal to start date");
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Assuming backend endpoint is /api/outpass
      // Note: This needs a backend to work. 
      const response = await fetch('/api/outpass', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('Outpass Request Submitted Successfully');
        // Reset form
        setFormData({
          name: '',
          year: '',
          department: '',
          fromLeave: '',
          toLeave: '',
          reason: '',
          proof: null
        });
        e.target.reset(); // Reset file input
      } else {
        alert('Failed to submit request. Please try again.');
        console.error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Apply for Outpass</h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            placeholder="Enter your full name"
          />
        </div>

        {/* Year and Department Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>

            <CustomDropdown
              options={[
                { label: '1st Year', value: '1' },
                { label: '2nd Year', value: '2' },
                { label: '3rd Year', value: '3' },
                { label: '4th Year', value: '4' }
              ]}
              value={formData.year}
              onChange={(value) => handleChange({ target: { name: 'year', value } })}
              placeholder="Select Year"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. CSE, IT, ECE"
            />
          </div>
        </div>

        {/* Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Leave</label>
            <input
              type="date"
              name="fromLeave"
              value={formData.fromLeave}
              onChange={handleChange}
              min={today}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Leave</label>
            <input
              type="date"
              name="toLeave"
              value={formData.toLeave}
              onChange={handleChange}
              min={formData.fromLeave || today}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/*Reason*/}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            placeholder="Enter the reason for your outpass"
          />
        </div>

        {/* Upload Proof*/}
        <div className="grid grid-cols-1 gap-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Proof
          </label>
          <input
            type="file"
            name="proof"
            onChange={handleChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition-all"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-95"
          >
            Submit Request
          </button>
        </div>

      </form>
    </div>
  );
};

export default Outpass;
