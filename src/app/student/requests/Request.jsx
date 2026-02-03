import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Utensils } from 'lucide-react';

const Request = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Requests</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Outpass Card */}
                <button
                    onClick={() => navigate('/student/outpass')}
                    className="w-full text-left bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 group"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                            <FileText className="w-8 h-8 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Outpass</h2>
                            <p className="text-gray-500 mt-1">Request for leave or outing</p>
                        </div>
                    </div>
                </button>

                {/* Mess Count Card */}
                <button
                    onClick={() => navigate('/student/mess-count')}
                    className="w-full text-left bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 group"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                            <Utensils className="w-8 h-8 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Mess Count</h2>
                            <p className="text-gray-500 mt-1">View or update mess details</p>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Request;
