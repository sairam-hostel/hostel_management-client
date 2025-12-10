import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileCheck, LogOut, UserPlus, Users, Bell } from 'lucide-react';
import logo from '../auth/Sairam-instuition.png';

const ADMIN_NAV_ITEMS = [
  {
    path: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    path: '/admin/leave-management',
    label: 'Leave Management',
    icon: FileCheck,
  },
  {
    path: '/admin/create-student', 
    label: 'Manage Student',
    icon: UserPlus,
  },
  {
    path: '/admin/faculty',
    label: 'Manage Faculty',
    icon: Users,
  },
  {
    path: '/admin/notices',
    label: 'Notices',
    icon: Bell,
  },
];

const AdminLayout = () => {
  const location = useLocation();
  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-32 bg-purple-700 flex flex-col items-center shadow-lg px-1 pt-24">
        
        {/* Navigation */}
        <nav className="flex flex-col gap-6 w-full items-center">
          {ADMIN_NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center w-full py-3 rounded-lg transition-all duration-200 text-xs font-medium
              ${
                isActive(path)
                  ? 'bg-white text-purple-700 shadow-md'
                  : 'text-purple-100 hover:bg-purple-600 hover:text-white'
              }`}
            >
              <Icon size={22} className={isActive(path) ? 'text-purple-700' : 'text-purple-200'} />
              <span className="mt-1 text-center">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto w-full px-2 pb-4">
          <p className="text-[10px] text-center text-purple-200 py-2 border-t border-purple-600">
            Admin
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TopBar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
             <img src={logo} alt="Sairam Logo" className="h-12 w-auto object-contain" />
             <div className="h-8 w-px bg-gray-200 mx-2"></div>
             <h1 className="text-xl font-semibold text-gray-800">
              {ADMIN_NAV_ITEMS.find(item => isActive(item.path))?.label || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
