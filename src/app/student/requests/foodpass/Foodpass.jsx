import React, { useState } from 'react';
import { Utensils, ArrowLeft, CheckCircle, Leaf, Drumstick } from 'lucide-react';
import { useToast } from '../../../../context/ToastContext';

const Foodpass = () => {
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);

  // Simulating backend data
  const [currentPreference, setCurrentPreference] = useState(null); // 'veg' or 'non-veg' or null
  const [formData, setFormData] = useState({
    preference: ''
  });

  const toggleView = () => {
    setShowForm(!showForm);
    setFormData({ preference: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.preference) {
      showToast("Please select a food preference", "error");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setCurrentPreference(formData.preference);
      showToast("Food preference updated successfully!", "success");
      toggleView();
    }, 500);
  };

  const getStatusColor = (pref) => {
    if (pref === 'veg') return 'bg-green-100 text-green-700 border-green-200';
    if (pref === 'non-veg') return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Food Pass Preference</h1>
          <p className="text-gray-500 mt-1">Manage your mess food details</p>
        </div>
        {!showForm && (
          <button
            onClick={toggleView}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium"
          >
            <Utensils size={18} />
            <span>Update Preference</span>
          </button>
        )}
      </div>

      {showForm ? (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-8 pb-4 border-b border-gray-100">
            <button
              onClick={toggleView}
              className="mr-3 p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-500" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Select Food Preference</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Veg Option */}
              <label className={`
                                relative flex flex-col items-center p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md
                                ${formData.preference === 'veg'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-green-200'}
                            `}>
                <input
                  type="radio"
                  name="preference"
                  value="veg"
                  checked={formData.preference === 'veg'}
                  onChange={(e) => setFormData({ preference: e.target.value })}
                  className="absolute opacity-0 w-full h-full cursor-pointer"
                />
                <div className={`p-4 rounded-full mb-3 ${formData.preference === 'veg' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Leaf className={`${formData.preference === 'veg' ? 'text-green-600' : 'text-gray-400'}`} size={32} />
                </div>
                <span className={`font-semibold text-lg ${formData.preference === 'veg' ? 'text-green-700' : 'text-gray-600'}`}>Vegetarian</span>
                <span className="text-xs text-gray-400 mt-1">Pure Veg Meals</span>
                {formData.preference === 'veg' && (
                  <div className="absolute top-3 right-3 text-green-500">
                    <CheckCircle size={20} fill="currentColor" className="text-white" />
                  </div>
                )}
              </label>

              {/* Non-Veg Option */}
              <label className={`
                                relative flex flex-col items-center p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md
                                ${formData.preference === 'non-veg'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 bg-white hover:border-orange-200'}
                            `}>
                <input
                  type="radio"
                  name="preference"
                  value="non-veg"
                  checked={formData.preference === 'non-veg'}
                  onChange={(e) => setFormData({ preference: e.target.value })}
                  className="absolute opacity-0 w-full h-full cursor-pointer"
                />
                <div className={`p-4 rounded-full mb-3 ${formData.preference === 'non-veg' ? 'bg-orange-100' : 'bg-gray-100'}`}>
                  <Drumstick className={`${formData.preference === 'non-veg' ? 'text-orange-600' : 'text-gray-400'}`} size={32} />
                </div>
                <span className={`font-semibold text-lg ${formData.preference === 'non-veg' ? 'text-orange-700' : 'text-gray-600'}`}>Non-Vegetarian</span>
                <span className="text-xs text-gray-400 mt-1">Includes Egg & Meat</span>
                {formData.preference === 'non-veg' && (
                  <div className="absolute top-3 right-3 text-orange-500">
                    <CheckCircle size={20} fill="currentColor" className="text-white" />
                  </div>
                )}
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Save Preference</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Utensils size={20} className="text-purple-500" />
              Current Mess Election
            </h2>

            {currentPreference ? (
              <div className={`rounded-xl border p-6 flex items-start gap-4 ${getStatusColor(currentPreference)}`}>
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  {currentPreference === 'veg' ? <Leaf size={32} className="text-green-600" /> : <Drumstick size={32} className="text-orange-600" />}
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-70">Selected Plan</span>
                  <h3 className="text-2xl font-bold capitalize mt-1 mb-1">{currentPreference === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}</h3>
                  <p className="text-sm opacity-80">
                    {currentPreference === 'veg'
                      ? 'You have opted for pure vegetarian meals.'
                      : 'You have opted for meals including egg and meat.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <div className="bg-gray-100 p-3 rounded-full inline-block mb-3">
                  <Utensils size={24} className="text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-medium">No Preference Set</h3>
                <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">You haven't selected your food preference yet. Please update it to ensure correct service.</p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Note:</h4>
              <ul className="text-sm text-gray-500 space-y-2 list-disc pl-5">
                <li>Preference changes will be applicable from the next month.</li>
                <li>You can only change your preference once per month.</li>
                <li>Contact the warden for any emergency changes.</li>
              </ul>
            </div>
          </div>

          {/* Info Card side panel (optional, can simulate stats or info) */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl shadow-md p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Utensils size={120} />
            </div>
            <h3 className="text-xl font-bold mb-2 relative z-10">Mess Details</h3>
            <div className="space-y-4 relative z-10 mt-6">
              <div>
                <span className="text-purple-200 text-xs uppercase">Mess Hall</span>
                <p className="font-semibold">Main Block Dining</p>
              </div>
              <div>
                <span className="text-purple-200 text-xs uppercase">Timing</span>
                <p className="font-semibold text-sm">Breakfast: 7:30 - 9:00 AM</p>
                <p className="font-semibold text-sm">Lunch: 12:30 - 2:00 PM</p>
                <p className="font-semibold text-sm">Dinner: 7:30 - 9:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Foodpass