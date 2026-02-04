import React from 'react';
import { Utensils, Percent, Home, CalendarCheck, CheckCircle, XCircle } from 'lucide-react';

const DashboardStats = ({ profileData }) => {
    // Safe defaults
    const attendance = 87; // Hardcoded placeholder
    const foodType = profileData?.food_type || "Not Selected";
    const isVeg = foodType.toLowerCase() === 'veg';
    const hostelName = profileData?.hostel_block || "Block A";
    const roomNumber = profileData?.room_number || "---";

    // Mock leave data for current month
    const currentMonthLeaves = 1;
    const isEligible = currentMonthLeaves <= 2;

    const stats = [
        {
            title: "Attendance",
            value: `${attendance}%`,
            subtitle: "Overall",
            icon: <Percent size={24} />,
            color: "bg-blue-50 text-blue-600",
            textColor: "text-blue-600"
        },
        {
            title: "Mess Preference",
            value: foodType,
            subtitle: "Everyday",
            icon: <Utensils size={24} />,
            color: isVeg ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600",
            textColor: isVeg ? "text-green-600" : "text-red-900" // Darker red for text readability
        },
        {
            title: "Hostel Details",
            value: roomNumber,
            subtitle: hostelName,
            icon: <Home size={24} />,
            color: "bg-purple-50 text-purple-600",
            textColor: "text-gray-800"
        },
        {
            title: "Leave Status",
            value: isEligible ? "Eligible" : "Not Eligible",
            subtitle: `${currentMonthLeaves} leaves taken this month`,
            icon: <CalendarCheck size={24} />,
            color: isEligible ? "bg-teal-50 text-teal-600" : "bg-orange-50 text-orange-600",
            textColor: isEligible ? "text-teal-600" : "text-orange-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="group bg-white rounded-2xl p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
                >
                    {/* Decorative Gradient Blob */}
                    <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br ${stat.color.replace('text-', 'from-').split(' ')[0]} to-transparent transition-transform group-hover:scale-150 duration-500`}></div>

                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className={`p-3.5 rounded-2xl ${stat.color} shadow-sm group-hover:shadow-md transition-shadow`}>
                            {stat.icon}
                        </div>
                    </div>

                    <div className="relative z-10">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{stat.title}</p>
                        <h3 className={`text-2xl font-extrabold ${stat.textColor} tracking-tight truncate`}>{stat.value}</h3>
                        <p className="text-xs text-gray-500 font-medium mt-1 truncate flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${stat.textColor.replace('text-', 'bg-')}`}></span>
                            {stat.subtitle}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;
