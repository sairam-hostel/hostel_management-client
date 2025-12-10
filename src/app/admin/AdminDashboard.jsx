import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, FileText, Bell, School, GraduationCap, ArrowRight, TrendingUp, Calendar, Clock, Activity } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import api from '../../utils/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    notices: 0,
    recentNotices: []
  });
  const [loading, setLoading] = useState(true);

  // Chart Options State
  const [deptOption, setDeptOption] = useState({});
  const [yearOption, setYearOption] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, facultyRes, noticesRes] = await Promise.allSettled([
           api.get('/bf1/accounts/students'),
           api.get('/bf1/accounts/faculty'),
           api.get('/bf1/notices')
        ]);

        const studentsData = studentsRes.status === 'fulfilled' 
           ? (studentsRes.value.data.data || studentsRes.value.data || []) 
           : [];
           
        const studentCount = studentsData.length;

        const facultyCount = facultyRes.status === 'fulfilled'
           ? (facultyRes.value.data.data?.length || facultyRes.value.data?.length || 0)
           : 0;
           
        const noticesData = noticesRes.status === 'fulfilled'
           ? (noticesRes.value.data.data || noticesRes.value.data || [])
           : [];
        const noticesCount = noticesData.length;

        // Sort notices by date (assuming id or created_at usually correlates, but simpler to take last 3)
        // In a real app we'd sort by date field. Here taking last 3 for 'recent'.
        const recentNotices = noticesData.slice(-3).reverse();

        setStats({
          students: studentCount,
          faculty: facultyCount,
          notices: noticesCount,
          recentNotices: recentNotices
        });

        // Process Data for Charts
        processCharts(studentsData);

      } catch (err) {
        console.error("Dashboard stats fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const processCharts = (students) => {
    // 1. Department Distribution
    const deptMap = {};
    students.forEach(s => {
      const dept = s.department || 'Other';
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });
    
    const deptData = Object.keys(deptMap).map(key => ({ value: deptMap[key], name: key }));

    setDeptOption({
      color: ['#6366f1', '#8b5cf6', '#ec4899', '#3b82f6', '#14b8a6'],
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        bottom: '0%',
        left: 'center',
        icon: 'circle'
      },
      series: [
        {
          name: 'Department',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: deptData
        }
      ]
    });

    // 2. Year-wise Distribution
    const yearMap = {};
    students.forEach(s => {
      const yr = s.year || 'Unknown';
      yearMap[yr] = (yearMap[yr] || 0) + 1;
    });

    const years = Object.keys(yearMap).sort();
    const yearCounts = years.map(y => yearMap[y]);

    setYearOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'none' }, // clean look
        formatter: '{b}: {c} Students'
      },
      grid: {
        left: '0%',
        right: '0%',
        bottom: '0%',
        top: '10%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: years,
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: { color: '#9ca3af' }
        }
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f3f4f6' } },
          axisLabel: { show: false }
        }
      ],
      series: [
        {
          name: 'Students',
          type: 'bar',
          barWidth: '40px',
          data: yearCounts,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#8b5cf6' },
                { offset: 1, color: '#c4b5fd' }
              ]
            },
            borderRadius: [4, 4, 0, 0]
          },
          showBackground: true,
          backgroundStyle: { color: '#f9fafb', borderRadius: [4, 4, 0, 0] }
        }
      ]
    });
  };

  const StatCard = ({ title, count, icon: Icon, colorClass, link, trend }) => (
    <div 
      onClick={() => navigate(link)}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
        <Icon size={80} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2.5 rounded-lg ${colorClass} bg-opacity-10 text-current`}>
            <Icon size={22} className={colorClass.replace('text-', 'text-opacity-100 ')} />
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <TrendingUp size={12} /> {trend}
            </div>
          )}
        </div>
        
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{loading ? '-' : count}</h3>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of hostel performance and activities.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
           <Calendar size={18} className="text-gray-400" />
           <span className="text-sm font-medium text-gray-600">
             {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
           </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Students" 
          count={stats.students} 
          icon={GraduationCap} 
          colorClass="text-purple-600"
          link="/admin/students"
          trend="+12% this month"
        />
        <StatCard 
          title="Faculty & Wardens" 
          count={stats.faculty} 
          icon={School} 
          colorClass="text-blue-600"
          link="/admin/faculty"
          trend="Stable"
        />
        <StatCard 
          title="Active Notices" 
          count={stats.notices} 
          icon={Bell} 
          colorClass="text-orange-500"
          link="/admin/notices"
          trend="3 New today"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
         
         {/* Charts Group */}
         <div className="lg:col-span-2 space-y-8">
            {/* Analytics */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800">Enrollment Analytics</h3>
                  <select className="text-xs border-none bg-gray-50 rounded-lg px-2 py-1 text-gray-500 font-medium cursor-pointer outline-none hover:bg-gray-100">
                    <option>This Year</option>
                    <option>Last Year</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="h-[250px]">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">By Department</p>
                      {stats.students > 0 ? (
                         <ReactECharts option={deptOption} style={{ height: '100%', width: '100%' }} />
                      ) : (
                         <div className="h-full flex items-center justify-center text-gray-300 text-sm">No Data</div>
                      )}
                   </div>
                   <div className="h-[250px]">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">By Year</p>
                       {stats.students > 0 ? (
                         <ReactECharts option={yearOption} style={{ height: '100%', width: '100%' }} />
                      ) : (
                         <div className="h-full flex items-center justify-center text-gray-300 text-sm">No Data</div>
                      )}
                   </div>
                </div>
            </div>
         </div>

         {/* Sidebar Area: Recent Activity & Quick Actions */}
         <div className="space-y-8">
            
             {/* Quick Actions */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                   <button onClick={() => navigate('/admin/create-student')} className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-purple-50 hover:text-purple-700 text-gray-600 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg shadow-sm group-hover:text-purple-600"><UserPlus size={18} /></div>
                        <span className="font-medium text-sm">Add Student</span>
                      </div>
                      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                   </button>

                   <button onClick={() => navigate('/admin/create-faculty')} className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-700 text-gray-600 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg shadow-sm group-hover:text-blue-600"><Users size={18} /></div>
                        <span className="font-medium text-sm">Add Faculty</span>
                      </div>
                      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                   </button>

                   <button onClick={() => navigate('/admin/create-notice')} className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-orange-50 hover:text-orange-700 text-gray-600 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg shadow-sm group-hover:text-orange-600"><FileText size={18} /></div>
                        <span className="font-medium text-sm">Post Notice</span>
                      </div>
                      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                   </button>
                </div>
             </div>

             {/* Recent Activity */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Recent Notices</h3>
                  <Activity size={18} className="text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  {loading ? (
                    <div className="animate-pulse space-y-3">
                       <div className="h-10 bg-gray-100 rounded"></div>
                       <div className="h-10 bg-gray-100 rounded"></div>
                    </div>
                  ) : stats.recentNotices.length > 0 ? (
                    stats.recentNotices.map((notice, idx) => (
                      <div key={idx} className="flex gap-3 items-start pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                         <div className="mt-1 w-2 h-2 rounded-full bg-purple-500 shrink-0"></div>
                         <div>
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{notice.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{notice.category} • {new Date(notice.created_at || Date.now()).toLocaleDateString()}</p>
                         </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">No recent activity</p>
                  )}
                </div>
                
                <button 
                  onClick={() => navigate('/admin/notices')}
                  className="w-full mt-4 text-xs font-medium text-center text-gray-500 hover:text-purple-600 transition-colors"
                >
                  View All Activity
                </button>
             </div>

         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
