import React from 'react';
import { ArrowLeft, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

const Personalisation = () => {
  const { accentColor, updateAccentColor } = useTheme();

  const colorOptions = [
    { name: 'Purple', value: '#7c3aed', class: 'bg-purple-600' },
    { name: 'Blue', value: '#2563eb', class: 'bg-blue-600' },
    { name: 'Red', value: '#dc2626', class: 'bg-red-600' },
    { name: 'Green', value: '#16a34a', class: 'bg-green-600' },
    { name: 'Orange', value: '#ea580c', class: 'bg-orange-600' },
    { name: 'Black', value: '#111827', class: 'bg-gray-900' },
    { name: 'Pink', value: '#db2777', class: 'bg-pink-600' },
    { name: 'Indigo', value: '#4f46e5', class: 'bg-indigo-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/settings" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Personalisation</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-full">
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Theme Preferences</h2>
            <p className="text-sm text-gray-500">Customize the look and feel of your dashboard.</p>
          </div>

          <div className="space-y-6">
            {/* Accent Color Section */}
            <div className="p-4 border border-gray-100 rounded-xl bg-white hover:border-purple-100 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div 
                  className="p-2 rounded-lg text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  <Palette size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Accent Color</p>
                  <p className="text-xs text-gray-500">Choose your preferred primary color</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 pl-14">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateAccentColor(option.value)}
                    className={`w-8 h-8 rounded-full transition-all ${option.class} ${
                      accentColor === option.value 
                        ? 'ring-4 ring-offset-2 ring-gray-200 scale-110' 
                        : 'hover:scale-110'
                    }`}
                    title={option.name}
                    aria-label={`Select ${option.name} accent color`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Personalisation;
