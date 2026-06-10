import React from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

const Security = () => {
  const { accentColor } = useTheme();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/settings" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Change Password</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-full">
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Security Settings</h2>
            <p className="text-sm text-gray-500">Ensure your account is using a long, random password to stay secure.</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                placeholder="Enter current password"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button 
                  className="px-4 py-2 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2"
                  style={{ backgroundColor: accentColor }}
                >
                <Save size={16} />
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Security;
