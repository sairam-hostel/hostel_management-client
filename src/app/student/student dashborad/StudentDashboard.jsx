import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import DashboardStats from './DashboardStats';
import LeaveInfo from './LeaveInfo';
import { useNotification } from '../../../context/NotificationContext';
import { Bell, Clock, ArrowRight, FileText } from 'lucide-react';

const StudentDashboard = () => {
  const { notices } = useNotification();
  const navigate = useNavigate();
  const [latestOutpass, setLatestOutpass] = useState(null);
  const [loading, setLoading] = useState(true);

  const [studentProfile, setStudentProfile] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch Profile
        const profileRes = await api.get('/bs1/profile');
        if (profileRes.data.success) {
          setStudentProfile(profileRes.data.data);
          // Cache name
          if (profileRes.data.data?.name) {
            localStorage.setItem('studentName', profileRes.data.data.name);
            window.dispatchEvent(new Event("storage"));
          }
        }

        // Fetch Latest Outpass
        const outpassRes = await api.get('/bs1/leave-outpass');
        const outpassData = Array.isArray(outpassRes.data) ? outpassRes.data : outpassRes.data.data || [];

        if (outpassData.length > 0) {
          // Sort by created_at desc
          const sorted = [...outpassData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setLatestOutpass(sorted[0]);
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const renderStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'pending';
    let colorClass = 'bg-yellow-100 text-yellow-700';

    if (s === 'approved') colorClass = 'bg-green-100 text-green-700';
    else if (s === 'rejected') colorClass = 'bg-red-100 text-red-700';

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${colorClass} capitalize`}>
        {status || 'Pending'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  // Get top 3 notices
  const recentNotices = notices.slice(0, 3);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-2 text-base font-medium">
            Welcome back, <span className="text-purple-700 font-bold">{studentProfile?.name || 'Student'}</span>! Here’s what’s happening today.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/student/outpass/apply')}
            className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white transition-all duration-200 bg-purple-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 hover:bg-purple-700 active:scale-95 shadow-lg shadow-purple-200">
            <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-400 to-purple-600 opacity-20 group-hover:opacity-50 blur-lg"></div>
            <span className="relative flex items-center gap-2">
              <FileText size={18} /> Apply Outpass
            </span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <DashboardStats profileData={studentProfile} />

      {/* Leave Info */}
      <LeaveInfo />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column (2/3): Latest Outpass */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Clock size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                  <p className="text-xs text-gray-500 font-medium">Track your real-time requests</p>
                </div>
              </div>
              {latestOutpass && (
                <button
                  onClick={() => navigate('/student/outpass')}
                  className="text-[11px] font-bold text-gray-500 hover:text-purple-600 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-all uppercase tracking-wide"
                >
                  View History <ArrowRight size={14} />
                </button>
              )}
            </div>

            <div className="p-6 flex-1 bg-gray-50/30">
              {latestOutpass ? (
                // Ticket Design
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${latestOutpass.mentor_status === 'Approved' && latestOutpass.hod_status === 'Approved' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="inline-block px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-2">
                          {latestOutpass.type} Request
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900 capitalize flex items-center gap-2">
                          Request Status
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-center justify-between bg-gray-50 rounded-xl p-5 border border-dashed border-gray-200">
                      {/* From */}
                      <div className="text-center md:text-left flex-1">
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Departure</p>
                        <p className="text-lg font-bold text-gray-800">{latestOutpass.from_date ? new Date(latestOutpass.from_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : '-'}</p>
                        <p className="text-xs text-gray-500 font-medium">{latestOutpass.from_time ? new Date(latestOutpass.from_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</p>
                      </div>

                      {/* Arrow */}
                      <div className="flex flex-col items-center flex-1">
                        <div className="w-full h-px bg-gray-300 relative max-w-[100px]">
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wide">Duration</p>
                      </div>

                      {/* To */}
                      <div className="text-center md:text-right flex-1">
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Return</p>
                        <p className="text-lg font-bold text-gray-800">{latestOutpass.to_date ? new Date(latestOutpass.to_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : '-'}</p>
                        <p className="text-xs text-gray-500 font-medium">{latestOutpass.to_time ? new Date(latestOutpass.to_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-8 w-full">
                        {/* Mentor Status */}
                        <div className="flex-1">
                          <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Mentor</p>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${latestOutpass.mentor_status === 'Approved' ? 'bg-green-500' : latestOutpass.mentor_status === 'Rejected' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                            <span className={`text-xs font-bold ${latestOutpass.mentor_status === 'Approved' ? 'text-green-700' : latestOutpass.mentor_status === 'Rejected' ? 'text-red-700' : 'text-gray-500'}`}>{latestOutpass.mentor_status || 'Pending'}</span>
                          </div>
                        </div>

                        <div className="w-px h-8 bg-gray-200"></div>

                        {/* Warden Status */}
                        <div className="flex-1">
                          <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Warden</p>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${latestOutpass.admin_status === 'Approved' ? 'bg-green-500' : latestOutpass.admin_status === 'Rejected' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                            <span className={`text-xs font-bold ${latestOutpass.admin_status === 'Approved' ? 'text-green-700' : latestOutpass.admin_status === 'Rejected' ? 'text-red-700' : 'text-gray-500'}`}>{latestOutpass.admin_status || 'Pending'}</span>
                          </div>
                        </div>

                        <div className="w-px h-8 bg-gray-200"></div>

                        {/* HOD Status */}
                        <div className="flex-1">
                          <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">HOD</p>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${latestOutpass.hod_status === 'Approved' ? 'bg-green-500' : latestOutpass.hod_status === 'Rejected' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                            <span className={`text-xs font-bold ${latestOutpass.hod_status === 'Approved' ? 'text-green-700' : latestOutpass.hod_status === 'Rejected' ? 'text-red-700' : 'text-gray-500'}`}>{latestOutpass.hod_status || 'Pending'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="bg-purple-50 p-6 rounded-full mb-4 shadow-inner">
                    <FileText className="text-purple-300" size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Requests</h3>
                  <p className="text-gray-500 mb-8 max-w-sm text-sm leading-relaxed">You currently don't have any active leave or outpass requests. Need to step out?</p>
                  <button
                    onClick={() => navigate('/student/outpass/apply')}
                    className="text-white bg-gray-900 hover:bg-black px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg hover:shadow-xl active:scale-95"
                  >
                    Create New Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Notifications */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Bell size={18} className="text-purple-600" /> Notifications
              </h2>
              <button
                onClick={() => navigate('/student/notification')}
                className="text-[10px] font-bold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-full transition-colors uppercase tracking-wide"
              >
                View All
              </button>
            </div>

            <div className="p-0 flex-1 overflow-y-auto">
              {recentNotices.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {recentNotices.map((notice, idx) => (
                    <div key={notice._id} onClick={() => navigate(`/student/notification/${notice._id}`)} className="group cursor-pointer p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex gap-4 items-start">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-105 ${idx === 0 ? 'bg-gradient-to-br from-purple-100 to-white text-purple-600 border border-purple-50' : 'bg-white border border-gray-100 text-gray-400'}`}>
                          <Bell size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-purple-600 transition-colors pr-2">{notice.title}</h4>
                            <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">{notice.date ? new Date(notice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Today'}</span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{notice.message || notice.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Bell size={24} className="text-gray-300" />
                  </div>
                  <p className="text-gray-900 font-bold text-sm">All caught up!</p>
                  <p className="text-gray-400 text-xs mt-1">No new notifications to display.</p>
                </div>
              )}
            </div>

            {recentNotices.length > 0 && (
              <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
                <button onClick={() => navigate('/student/notification')} className="w-full py-2.5 text-xs font-bold text-center text-gray-600 hover:text-purple-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow active:scale-95 transition-all">
                  VIEW ALL NOTIFICATIONS
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default StudentDashboard