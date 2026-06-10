import React from 'react';
import { User, Mail, Phone, Shield } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const Profile = () => {
  const { accentColor } = useTheme();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div 
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${accentColor}20` }}
        >
          <User className="w-6 h-6" style={{ color: accentColor }} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div 
          className="h-32" 
          style={{ background: `linear-gradient(to right, ${accentColor}, ${accentColor}dd)` }}
        ></div>
        <div className="px-6 pb-6">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end gap-4">
              <div className="p-1 bg-white rounded-full">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-white"
                  style={{ backgroundColor: `${accentColor}15` }}
                >
                  <User size={40} style={{ color: `${accentColor}80` }} />
                </div>
              </div>
              <div className="mb-2">
                <h2 className="text-xl font-bold text-gray-800">Admin User</h2>
                <span 
                  className="px-2 py-0.5 text-xs font-medium rounded-full"
                  style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                >
                  Administrator
                </span>
              </div>
            </div>
            <button 
              className="px-4 py-2 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: accentColor }}
            >
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail size={18} className="text-gray-400" />
                  <span>admin@example.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone size={18} className="text-gray-400" />
                  <span>+91 98765 43210</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Account Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Shield size={18} className="text-gray-400" />
                  <span>Role: Super Admin</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span>Status: Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
