import React, { useState } from 'react';
import { Plus, ArrowLeft, Utensils, Calendar, Users, FileText } from 'lucide-react';
import ApiTableManager from '../../../../component/ApiTableManager';
import api from '../../../../utils/api';
import { useToast } from '../../../../context/ToastContext';

const MessCount = () => {
    const { showToast } = useToast();
    const [showForm, setShowForm] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // To trigger table refresh
    const [formData, setFormData] = useState({
        meal_type: '',
        guest_count: '',
        pass_date: '',
        reason: ''
    });
    const [loading, setLoading] = useState(false);

    const toggleView = () => {
        setShowForm(!showForm);
        setFormData({
            meal_type: '',
            guest_count: '',
            pass_date: '',
            reason: ''
        });
    };

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

        try {
            // Basic Validation
            if (!formData.meal_type || !formData.guest_count || !formData.pass_date || !formData.reason) {
                showToast("Please fill all fields", "error");
                setLoading(false);
                return;
            }

            const payload = {
                ...formData,
                guest_count: parseInt(formData.guest_count, 10)
            };

            await api.post('/bs1/food-management/', payload);
            showToast("Mess count request submitted successfully!", "success");
            toggleView();
            setRefreshKey(prev => prev + 1); // Refresh the list
        } catch (error) {
            console.error("Error submitting mess count:", error);
            showToast(error.response?.data?.message || "Failed to submit request", "error");
        } finally {
            setLoading(false);
        }
    };

    const renderStatusBadge = (status) => {
        const s = status?.toLowerCase() || 'pending';
        let colorClass = 'bg-yellow-100 text-yellow-700';

        if (s === 'approved') colorClass = 'bg-green-100 text-green-700';
        else if (s === 'rejected') colorClass = 'bg-red-100 text-red-700';

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass} capitalize`}>
                {status || 'Pending'}
            </span>
        );
    };

    const columns = [
        {
            header: 'Meal Type',
            accessor: 'meal_type',
            className: 'font-medium text-gray-900 capitalize'
        },
        {
            header: 'Guest Count',
            accessor: 'guest_count',
            render: (row) => (
                <div className="flex items-center gap-1">
                    <Users size={14} className="text-gray-400" />
                    <span>{row.guest_count}</span>
                </div>
            )
        },
        {
            header: 'Date',
            accessor: 'pass_date',
            render: (row) => row.pass_date ? new Date(row.pass_date).toLocaleDateString() : '-'
        },
        {
            header: 'Reason',
            accessor: 'reason',
            className: 'text-gray-600 truncate max-w-xs'
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => renderStatusBadge(row.status)
        }
    ];

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Mess Count Requests</h1>
                    <p className="text-gray-500 mt-1">Manage guest meal requests</p>
                </div>
                {!showForm && (
                    <button
                        onClick={toggleView}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium"
                    >
                        <Plus size={18} />
                        <span>Add Request</span>
                    </button>
                )}
            </div>

            {showForm ? (
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center mb-6 pb-2 border-b border-gray-100">
                        <button
                            onClick={toggleView}
                            className="mr-3 p-2 hover:bg-gray-50 rounded-full transition-colors"
                        >
                            <ArrowLeft size={20} className="text-gray-500" />
                        </button>
                        <h2 className="text-xl font-semibold text-gray-800">New Guest Meal Request</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Meal Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                            <div className="relative">
                                <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <select
                                    name="meal_type"
                                    value={formData.meal_type}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                                >
                                    <option value="">Select Meal Type</option>
                                    <option value="breakfast">Breakfast</option>
                                    <option value="lunch">Lunch</option>
                                    <option value="snacks">Snacks</option>
                                    <option value="dinner">Dinner</option>
                                </select>
                            </div>
                        </div>

                        {/* Guest Count */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Guest Count</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="number"
                                    name="guest_count"
                                    value={formData.guest_count}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                    placeholder="Number of guests"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="date"
                                    name="pass_date"
                                    value={formData.pass_date}
                                    onChange={handleChange}
                                    min={today}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Reason */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    placeholder="Reason for guest meal..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <ApiTableManager
                    key={refreshKey} // Force re-mount/fetch on update
                    fetchUrl="/bs1/food-management/"
                    columns={columns}
                    title="History"
                    searchPlaceholder="Search reason or type..."
                    noDataComponent={
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="bg-purple-50 p-4 rounded-full mb-4">
                                <Utensils size={32} className="text-purple-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No requests found</h3>
                            <p className="text-gray-500 mb-6 max-w-sm">
                                You haven't made any guest meal requests yet.
                            </p>
                            <button
                                onClick={toggleView}
                                className="text-purple-600 hover:text-purple-700 font-medium"
                            >
                                Create your first request
                            </button>
                        </div>
                    }
                />
            )}
        </div>
    );
};

export default MessCount;