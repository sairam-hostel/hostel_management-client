import React from 'react';
import { Settings as SettingsIcon, User, Lock, ShieldAlert, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

const Settings = () => {
  const { accentColor } = useTheme();
  const settingCards = [
    {
      id: 'personalisation',
      label: 'Personalisation',
      description: 'Customize your interface, themes, and notification preferences.',
      icon: User,
      path: '/admin/settings/personalisation',
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      id: 'security',
      label: 'Change Password',
      description: 'Update your password and manage account security.',
      icon: Lock,
      path: '/admin/settings/security',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      id: 'rules',
      label: 'Admin Rules',
      description: 'Manage hostel rules and regulations visible to students.',
      icon: ShieldAlert,
      path: '/admin/settings/rules',
      color: 'bg-amber-50 text-amber-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div 
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${accentColor}20` }}
        >
          <SettingsIcon className="w-6 h-6" style={{ color: accentColor }} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>

      <div className="flex flex-col gap-4">
        {settingCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.id}
              to={card.path}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all group flex items-center gap-4 hover:shadow-md"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${accentColor}40`;
                const icon = e.currentTarget.querySelector('.chevron-icon');
                if (icon) icon.style.color = accentColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '';
                const icon = e.currentTarget.querySelector('.chevron-icon');
                if (icon) icon.style.color = '';
              }}
            >
              <div className={`p-3 rounded-xl ${card.color}`}>
                <Icon size={24} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{card.label}</h3>
                <p className="text-sm text-gray-500">{card.description}</p>
              </div>

              <ChevronRight 
                className="chevron-icon text-gray-300 transition-all group-hover:translate-x-1" 
                size={20} 
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Settings;
