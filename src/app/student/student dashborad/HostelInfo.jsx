import React from 'react';
import { Home } from 'lucide-react';

const HOSTEL_INFO = {
  name: "Boys Hostel 1",
  roomNumber: "305",
  messPass: "Non-Veg", // Can be "Veg" or "Non-Veg"
};

const HostelInfo = () => {
  const isVeg = HOSTEL_INFO.messPass.toLowerCase() === 'veg';

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
          <Home size={20} />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Hostel Details</h2>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Hostel Name */}
        <div>
          <p className="text-xs text-purple-700 uppercase tracking-wider font-bold mb-1">Hostel Name</p>
          <p className="text-sm font-semibold text-gray-900">{HOSTEL_INFO.name}</p>
        </div>

        {/* Room Number */}
        <div>
          <p className="text-xs text-purple-700 uppercase tracking-wider font-bold mb-1">Room Number</p>
          <p className="text-sm font-semibold text-gray-900">{HOSTEL_INFO.roomNumber}</p>
        </div>

        {/* Mess Pass */}
        <div>
          <p className="text-xs text-purple-700 uppercase tracking-wider font-bold mb-1">Mess Pass</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`h-3 w-3 rounded-full ${isVeg ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <p className={`text-sm font-semibold ${isVeg ? 'text-green-700' : 'text-red-700'}`}>
              {HOSTEL_INFO.messPass}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HostelInfo;