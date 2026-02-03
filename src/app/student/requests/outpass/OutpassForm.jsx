import React from 'react';
import CustomDropdown from '../../../../component/CustomDropdown';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../../../utils/api';

const OutpassForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({
        name: '', // Keep for UI, but might not be needed for API if token handles it
        year: '',
        department: '',
        from_date: '',
        to_date: '',
        request_reason: '',
        place_to_visit: '',
        address_details: '',
        mode_of_transport: '',
        expected_in_time: '',
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
            formData.from_date &&
            formData.to_date &&
            formData.from_date > formData.to_date
        ) {
            alert("End date must be after or equal to start date");
            return;
        }

        // Dropdown Validation
        if (!formData.year) {
            alert("Please select your year");
            return;
        }
        if (!formData.mode_of_transport) {
            alert("Please select a mode of transport");
            return;
        }

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Using the api utility for consistent base URL and headers
            const response = await api.post('/bs1/leave-outpass', formDataToSend);

            if (response.status === 200 || response.status === 201) {
                alert('Outpass Request Submitted Successfully');
                // Reset form
                setFormData({
                    name: '',
                    year: '',
                    department: '',
                    from_date: '',
                    to_date: '',
                    request_reason: '',
                    place_to_visit: '',
                    address_details: '',
                    mode_of_transport: '',
                    expected_in_time: '',
                    proof: null
                });
                e.target.reset(); // Reset file input
                navigate('/student/outpass'); // Navigate back to history
            } else {
                alert('Failed to submit request. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
            <div className="flex items-center mb-6 border-b pb-2">
                <button
                    onClick={() => navigate('/student/outpass')}
                    className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Apply for Outpass</h2>
            </div>

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
                        <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                        <input
                            type="date"
                            name="from_date"
                            value={formData.from_date}
                            onChange={handleChange}
                            min={today}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                        <input
                            type="date"
                            name="to_date"
                            value={formData.to_date}
                            onChange={handleChange}
                            min={formData.from_date || today}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Time and Transport Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expected In Time</label>
                        <input
                            type="time"
                            name="expected_in_time"
                            value={formData.expected_in_time}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mode of Transport</label>
                        <CustomDropdown
                            options={[
                                { label: 'Bus', value: 'Bus' },
                                { label: 'Train', value: 'Train' },
                                { label: 'Bike', value: 'Bike' },
                                { label: 'Car', value: 'Car' },
                                { label: 'Walk', value: 'Walk' }
                            ]}
                            value={formData.mode_of_transport}
                            onChange={(value) => handleChange({ target: { name: 'mode_of_transport', value } })}
                            placeholder="Select Mode"
                        />
                    </div>
                </div>

                {/* Place and Address Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Place to Visit</label>
                        <input
                            type="text"
                            name="place_to_visit"
                            value={formData.place_to_visit}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            placeholder="e.g. City Center, Home"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Details</label>
                        <input
                            type="text"
                            name="address_details"
                            value={formData.address_details}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            placeholder="e.g. 123 Main St, Bangalore"
                        />
                    </div>
                </div>

                {/*Reason*/}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                    <textarea
                        name="request_reason"
                        value={formData.request_reason}
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

export default OutpassForm;
