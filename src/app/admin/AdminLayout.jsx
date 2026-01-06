import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileCheck, LogOut, UserPlus, Users, Bell, Menu, X } from 'lucide-react';
import logo from '../auth/Sairam-instuition.png';
import ConfirmationModal from '../../component/ConfirmationModal';

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
    path: '/admin/students', 
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
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };
  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const toggleSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:relative z-30 h-full w-64 bg-purple-700 flex flex-col items-center shadow-lg pt-24 transition-transform duration-300 ease-in-out
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          md:w-32 px-1
        `}
      >
        <button 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 text-white p-2"
        >
          <X size={24} />
        </button>
        
        {/* Navigation */}
        <nav className="flex flex-col gap-6 w-full items-center">
          {ADMIN_NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsMobileSidebarOpen(false)}
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
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex flex-col items-center justify-center w-full py-3 rounded-lg transition-all duration-200 text-xs font-medium text-purple-100 hover:bg-purple-600 hover:text-white"
          >
            <LogOut size={22} className="text-purple-200" />
            <span className="mt-1 text-center">Logout</span>
          </button>

          <p className="text-[10px] text-center text-purple-200 py-2 border-t border-purple-600">
            Admin
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TopBar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 md:px-8 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            >
              <Menu size={24} />
            </button>
             <img src={logo} alt="Sairam Logo" className="h-8 md:h-12 w-auto object-contain" />
             <div className="hidden md:block h-8 w-px bg-gray-200 mx-2"></div>
             <h1 className="text-lg md:text-xl font-semibold text-gray-800">
              {ADMIN_NAV_ITEMS.find(item => isActive(item.path))?.label || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-xs md:text-sm text-gray-500 hidden sm:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>

      <ConfirmationModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out? You will need to sign in again to access the admin dashboard."
      />
    </div>
  );
};

export default AdminLayout;
