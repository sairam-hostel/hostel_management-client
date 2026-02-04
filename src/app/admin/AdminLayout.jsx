import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileCheck, LogOut, UserPlus, Users, Bell, Menu, X, MessageSquareWarning, Settings, User, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

import Logo from '../../component/Logo';
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
  {
    path: '/admin/complaints',
    label: 'Complaints',
    icon: MessageSquareWarning,
  },
  {
    path: '/admin/settings',
    label: 'Settings',
    icon: Settings,
  },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { accentColor } = useTheme();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };
  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const toggleSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        style={{ backgroundColor: accentColor }}
        className={`
          fixed md:relative z-30 h-full w-64 flex flex-col items-center justify-center shadow-lg transition-transform duration-300 ease-in-out
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
                  ? 'bg-white shadow-md'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              style={isActive(path) ? { color: accentColor } : {}}
            >
              <Icon size={22} className={isActive(path) ? '' : 'text-white/70'} style={isActive(path) ? { color: accentColor } : {}} />
              <span className="mt-1 text-center">{label}</span>
            </Link>
          ))}
        </nav>


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
             <Logo className="h-8 md:h-12 w-auto object-contain" />
             <div className="hidden md:block h-8 w-px bg-gray-200 mx-2"></div>
             <h1 className="text-lg md:text-xl font-semibold text-gray-800">
              {ADMIN_NAV_ITEMS.find(item => isActive(item.path))?.label || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-xs md:text-sm text-gray-500 hidden sm:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center border border-purple-200">
                  <User size={18} className="text-purple-600" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-medium text-gray-700">Admin</p>
                  <p className="text-[10px] text-gray-400">View Profile</p>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsProfileDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-medium text-gray-900">Admin User</p>
                      <p className="text-xs text-gray-500 truncate">admin@example.com</p>
                    </div>
                    
                    <div className="p-1">
                      <Link 
                        to="/admin/profile" 
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
                      >
                        <User size={16} />
                        Profile
                      </Link>
                      <Link 
                        to="/admin/settings" 
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
                      >
                        <Settings size={16} />
                        Settings
                      </Link>
                    </div>
                    
                    <div className="p-1 border-t border-gray-50">
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          setIsLogoutModalOpen(true);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 bg-gray-50">
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
