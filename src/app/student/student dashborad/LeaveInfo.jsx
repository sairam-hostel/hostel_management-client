import React from 'react';
import { Calendar } from 'lucide-react';

const LEAVE_DATA = [
  { month: 'August', leavesTaken: 1 },
  { month: 'September', leavesTaken: 3 }, // > 2, so next month (Oct) not eligible
  { month: 'October', leavesTaken: 0 },
];

const LeaveInfo = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
          <Calendar size={20} />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Leave History & Eligibility</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {LEAVE_DATA.map((data, index) => {
          // Logic: Check previous month's leaves to determine current month's eligibility
          // For the first item, we assume eligible or check a previous hidden month (defaulting to eligible here)
          const previousMonthLeaves = index > 0 ? LEAVE_DATA[index - 1].leavesTaken : 0;
          const isEligible = previousMonthLeaves <= 2;

          return (
            <div
              key={data.month}
              className={`p-4 rounded-lg border ${isEligible ? 'bg-white border-gray-200' : 'bg-red-50 border-red-200'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-md font-bold text-gray-800">{data.month}</h3>
                {!isEligible && (
                  <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
                    Not Eligible
                  </span>
                )}
                {isEligible && (
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                    Eligible
                  </span>
                )}
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Leaves Taken</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{data.leavesTaken}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaveInfo;