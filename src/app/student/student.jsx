import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileEdit, Bell, Search } from 'lucide-react';
import logo from '../auth/Sairam-instuition.png';

const STUDENT_NAV_ITEMS = [
  {
    path: '/student',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    path: '/student/outpass',
    label: 'Outpass',
    icon: FileEdit,
  },
];

const StudentLayout = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-32 bg-purple-700 flex flex-col items-center shadow-lg px-1 pt-24">
        <nav className="flex flex-col gap-6 w-full items-center">
          {STUDENT_NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center w-full py-3 rounded-lg transition-all duration-200 text-xs font-medium
              ${
                isActive(path)
                  ? 'bg-white text-purple-700 shadow-md'
                  : 'text-gray-200 hover:bg-purple-600 hover:text-white'
              }`}
            >
              <Icon size={22} />
              <span className="mt-1 text-center">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto w-full px-2 pb-4">
          <p className="text-[10px] text-center text-gray-200 py-2 border-t border-purple-600">
            Student
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TopBar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
          {/* Left: Logo */}
          <div className="flex items-center">
            <img src={logo} alt="Sairam Logo" className="h-18 w-auto object-contain" />
          </div>

          {/* Right: Student Profile */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-purple-100">
                S
              </div>
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-gray-800">Student Name</p>
              </div>
              
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;