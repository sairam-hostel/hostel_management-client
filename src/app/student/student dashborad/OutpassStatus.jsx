import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const OutpassStatus = () => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock fetching data
    useEffect(() => {
        const fetchStatus = async () => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock Data - Replace with actual API call later
            // Possible statuses: 'Pending', 'Approved', 'Rejected'
            const mockData = {
                id: 1,
                type: 'Outpass',
                status: 'Pending', // Change this to test different states
                fromDate: '2024-12-15',
                toDate: '2024-12-17',
                reason: 'Family function',
                appliedOn: '2024-12-10',
            };

            setStatus(mockData);
            setLoading(false);
        };

        fetchStatus();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100 flex items-center justify-center h-40">
                <p className="text-gray-500 animate-pulse">Loading status...</p>
            </div>
        );
    }

    if (!status) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
                <p className="text-gray-500">No active outpass requests.</p>
            </div>
        );
    }

    const getStatusColor = (statusType) => {
        switch (statusType) {
            case 'Approved': return 'text-green-600 bg-green-50 border-green-200';
            case 'Rejected': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        }
    };

    const getStatusIcon = (statusType) => {
        switch (statusType) {
            case 'Approved': return <CheckCircle size={20} />;
            case 'Rejected': return <XCircle size={20} />;
            default: return <Clock size={20} />;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                    <AlertCircle size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Latest Outpass Status</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Status Badge */}
                <div className={`flex flex-col items-center justify-center p-6 rounded-xl border w-full md:w-1/3 ${getStatusColor(status.status)}`}>
                    <div className="mb-2">
                        {getStatusIcon(status.status)}
                    </div>
                    <span className="text-xl font-bold uppercase tracking-wide">{status.status}</span>
                    <span className="text-xs opacity-75 mt-1">Applied on {status.appliedOn}</span>
                </div>

                {/* Details */}
                <div className="w-full md:w-2/3 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 uppercase font-semibold">From</p>
                            <p className="font-medium text-gray-800">{status.fromDate}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 uppercase font-semibold">To</p>
                            <p className="font-medium text-gray-800">{status.toDate}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Reason</p>
                        <p className="font-medium text-gray-800">{status.reason}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OutpassStatus;
