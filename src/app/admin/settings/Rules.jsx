import React, { useState } from 'react';
import { ArrowLeft, ShieldAlert, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

const Rules = () => {
  const { accentColor } = useTheme();
  const [rules, setRules] = useState([
    { id: 1, text: "Students must be back in the hostel by 10:00 PM." },
    { id: 2, text: "No loud music allowed after 11:00 PM." },
    { id: 3, text: "Visitors are only allowed in the common area." }
  ]);
  const [newRule, setNewRule] = useState("");

  const handleAddRule = () => {
    if (newRule.trim()) {
      setRules([...rules, { id: Date.now(), text: newRule }]);
      setNewRule("");
    }
  };

  const handleDeleteRule = (id) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/settings" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Admin Defined Rules</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-full">
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Manage Rules</h2>
            <p className="text-sm text-gray-500">Manage the official hostel rules and regulations visible to students.</p>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-900">Important Note</h4>
                <p className="text-xs text-amber-700 mt-1">Changes made here will be immediately reflected in the student guidelines section.</p>
              </div>
          </div>

          <div className="space-y-4">
            {rules.map((rule, index) => (
              <div key={rule.id} className="flex items-start gap-3 group">
                <div className="flex-none pt-2">
                    <span 
                      className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold font-mono"
                      style={{ color: accentColor, backgroundColor: `${accentColor}20` }}
                    >
                      {index + 1}
                    </span>
                </div>
                <div className="flex-1 p-3 bg-white border border-gray-200 rounded-lg group-hover:border-purple-200 transition-colors">
                  <p className="text-gray-700 text-sm">{rule.text}</p>
                </div>
                <button 
                  onClick={() => handleDeleteRule(rule.id)}
                  className="flex-none p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Rule"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add New Rule</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                placeholder="Type a new rule definition..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddRule()}
              />
              <button 
                onClick={handleAddRule}
                className="px-4 py-2 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2"
                style={{ backgroundColor: accentColor }}
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rules;
