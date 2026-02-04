import React, { useState } from 'react';
import { Lock, HelpCircle, ChevronRight, Mail, AlertTriangle } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

const Settings = () => {
    const { showToast } = useToast();

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast("New passwords do not match", "error");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            showToast("Password must be at least 6 characters", "error");
            return;
        }

        // Mock API call
        console.log("Updating password...");
        showToast("Password updated successfully!", "success");
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account preferences</p>
            </div>

            {/* Appearance Section Removed as per request */}

            {/* Change Password Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-colors">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                        <Lock size={18} className="text-purple-600" />
                        Change Password
                    </h2>
                </div>
                <div className="p-6">
                    <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-transparent text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-transparent text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-transparent text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors text-sm"
                            >
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Help & Support Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-colors">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                        <HelpCircle size={18} className="text-purple-600" />
                        Help & Support
                    </h2>
                </div>
                <div className="divide-y divide-gray-50">
                    <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                <AlertTriangle size={18} />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Report an Issue</p>
                                <p className="text-xs text-gray-500">Found a bug? Let us know.</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-400" />
                    </button>

                    <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-100 transition-colors">
                                <Mail size={18} />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Contact Warden</p>
                                <p className="text-xs text-gray-500">Reach out for hostel related queries</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-400" />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Settings;
