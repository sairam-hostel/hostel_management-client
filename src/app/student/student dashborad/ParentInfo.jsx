import React from 'react';
import { Users } from 'lucide-react';

const PARENT_INFO = {
  father: {
    name: "Father Name",
    mobile: "+91 9876543210",
    email: "father@example.com",
  },
  mother: {
    name: "Mother Name",
    mobile: "+91 9876543211",
    email: "mother@example.com",
  },
  guardian: {
    name: "Guardian Name",
    mobile: "+91 9876543212",
    email: "guardian@example.com",
  },
};

const ParentInfo = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
          <Users size={20} />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Parent Details</h2>
      </div>

      <div className="flex flex-col gap-4">
        
        {/* Father Details */}
        <div className="flex flex-col">
          <p className="text-xs text-purple-700 uppercase tracking-wider font-bold mb-3">Father</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-400 font-medium">Name</p>
              <p className="text-sm font-semibold text-gray-900">{PARENT_INFO.father.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Mobile Number</p>
              <p className="text-sm font-semibold text-gray-900">{PARENT_INFO.father.mobile}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Mail ID</p>
              <p className="text-sm font-semibold text-gray-900">{PARENT_INFO.father.email}</p>
            </div>
          </div>
        </div>

        {/* Mother Details */}
        <div className="flex flex-col">
          <p className="text-xs text-purple-700 uppercase tracking-wider font-bold mb-3">Mother</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-400 font-medium">Name</p>
              <p className="text-sm font-semibold text-gray-900">{PARENT_INFO.mother.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Mobile Number</p>
              <p className="text-sm font-semibold text-gray-900">{PARENT_INFO.mother.mobile}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Mail ID</p>
              <p className="text-sm font-semibold text-gray-900">{PARENT_INFO.mother.email}</p>
            </div>
          </div>
        </div>

        {/* Guardian Details */}
        <div className="flex flex-col">
          <p className="text-xs text-purple-700 uppercase tracking-wider font-bold mb-3">Guardian</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-400 font-medium">Name</p>
              <p className="text-sm font-semibold text-gray-900">{PARENT_INFO.guardian.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Mobile Number</p>
              <p className="text-sm font-semibold text-gray-900">{PARENT_INFO.guardian.mobile}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Mail ID</p>
              <p className="text-sm font-semibold text-gray-900">{PARENT_INFO.guardian.email}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ParentInfo;