import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, FileText, Truck, UserCheck } from 'lucide-react';
import api from '../../../../utils/api';

const OutpassDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [details, setDetails] = useState(location.state?.request || null);
    const [loading, setLoading] = useState(!location.state?.request);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            if (details) return;

            try {
                // Fallback: Fetch all and find by ID since specific endpoint might not exist
                const response = await api.get('/bs1/leave-outpass');
                const data = Array.isArray(response.data) ? response.data : response.data.data || [];
                const found = data.find(item => item._id === id || item.id === id);

                if (found) {
                    setDetails(found);
                } else {
                    setError("Request not found");
                }
            } catch (err) {
                console.error("Error fetching details:", err);
                setError("Failed to load details");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, details]);

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!details) return <div className="p-8 text-center">No details found</div>;

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const InfoItem = ({ icon: Icon, label, value }) => (
        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="mt-1">
                <Icon size={18} className="text-purple-600" />
            </div>
            <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{value || 'N/A'}</p>
            </div>
        </div>
    );

    const StatusBadge = ({ role, status, name, date }) => (
        <div className={`flex flex-col p-4 rounded-xl border ${getStatusColor(status)} transition-all`}>
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">{role}</span>
                {status === 'approved' && <UserCheck size={16} />}
            </div>
            <div className="font-bold text-lg capitalize">{status}</div>
            {name && <div className="text-sm mt-1 opacity-90 font-medium">{name}</div>}
            {date && <div className="text-xs mt-2 opacity-75">{new Date(date).toLocaleString()}</div>}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <button
                onClick={() => navigate('/student/outpass')}
                className="flex items-center text-gray-600 hover:text-purple-600 transition-colors mb-6 group"
            >
                <div className="p-2 rounded-full group-hover:bg-purple-50 mr-2 transition-colors">
                    <ArrowLeft size={20} />
                </div>
                <span className="font-medium">Back to History</span>
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">Outpass Request</h1>

                        </div>
                        <div className={`px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 font-bold capitalize`}>
                            {details.status}
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Approval Flow */}
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <UserCheck className="mr-2 text-purple-600" size={20} />
                        Approval Status
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <StatusBadge
                            role="Mentor"
                            status={details.mentor_status}
                            name={details.mentor_name}
                            date={details.mentor_action_at}
                        />
                        <StatusBadge
                            role="HOD"
                            status={details.hod_status}
                            name={details.hod_name}
                            date={details.hod_action_at}
                        />
                        <StatusBadge
                            role="Admin"
                            status={details.admin_status}
                            name={details.admin_name} // Assuming admin_name might be available or use generic
                            date={details.admin_action_at}
                        />
                    </div>

                    <div className="border-t border-gray-100 my-8"></div>

                    {/* Request Details */}
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <FileText className="mr-2 text-purple-600" size={20} />
                        Request Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <InfoItem
                            icon={Calendar}
                            label="From Date"
                            value={new Date(details.from_date).toLocaleString()}
                        />
                        <InfoItem
                            icon={Calendar}
                            label="To Date"
                            value={new Date(details.to_date).toLocaleString()}
                        />
                        <InfoItem
                            icon={Clock}
                            label="Expected In Time"
                            value={details.expected_in_time}
                        />
                        <InfoItem
                            icon={Truck}
                            label="Mode of Transport"
                            value={details.mode_of_transport}
                        />
                        <InfoItem
                            icon={MapPin}
                            label="Place to Visit"
                            value={details.place_to_visit}
                        />
                        <InfoItem
                            icon={MapPin}
                            label="Address Details"
                            value={details.address_details}
                        />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Reason</p>
                        <p className="text-gray-800 leading-relaxed">{details.request_reason}</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OutpassDetails;
