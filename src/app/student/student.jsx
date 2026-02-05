import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileEdit, BellRing, Search, MessageSquareWarning, LogOut, User, ChevronDown, Settings } from 'lucide-react';
import Logo from '../../component/Logo';
import { useNotification } from '../../context/NotificationContext';
import ConfirmationModal from '../../component/ConfirmationModal';

const STUDENT_NAV_ITEMS = [
  {
    path: '/student',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    path: '/student/requests',
    label: 'Request',
    icon: FileEdit,
  },
  {
    path: '/student/complaints',
    label: 'Complaints',
    icon: MessageSquareWarning,
  }
];

const StudentLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const isActive = (path) => {
    if (path === '/student') {
      return location.pathname === '/student';
    }
    return location.pathname.startsWith(path);
  };
  const { unreadCount } = useNotification();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100 transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-32 bg-purple-700 flex flex-col items-center shadow-lg px-1 pt-24 transition-colors duration-200">
        <nav className="flex flex-col gap-6 w-full items-center">
          {STUDENT_NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center w-full py-3 rounded-lg transition-all duration-200 text-xs font-medium
              ${isActive(path)
                  ? 'bg-white text-purple-700 shadow-md transform scale-105'
                  : 'text-gray-200 hover:bg-purple-600 hover:text-white'
                }`}
            >
              <div className="relative">
                <Icon size={22} />
                {label === 'Notification' && unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-purple-700"></span>
                )}
              </div>
              <span className="mt-1 text-center">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto w-full px-2 pb-4">
          <Link
            to="/student/settings"
            className={`flex flex-col items-center justify-center w-full py-3 rounded-lg transition-all duration-200 text-xs font-medium
              ${isActive('/student/settings')
                ? 'bg-white text-purple-700 shadow-md'
                : 'text-purple-200 hover:bg-purple-600 hover:text-white'
              }`}
          >
            <Settings size={22} />
            <span className="mt-1 text-center">Settings</span>
          </Link>
          <p className="text-[10px] text-center text-gray-200 py-2 border-t border-purple-600 mt-2">
            Student
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TopBar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10 transition-colors duration-200">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Logo className="h-18 w-auto object-contain" />
          </div>

          {/* Right: Student Profile */}
          <div className="flex items-center gap-4 relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors focus:outline-none"
            >
              <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-purple-100">
                {localStorage.getItem('studentName') ? localStorage.getItem('studentName').charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-gray-800">
                  {localStorage.getItem('studentName') || 'Student Name'}
                </p>
              </div>
              <ChevronDown size={16} className={`text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animation-fade-in-up">
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-sm font-semibold text-gray-900">{localStorage.getItem('studentName') || 'Student Name'}</p>
                  <p className="text-xs text-gray-500">Student</p>
                </div>

                <div className="py-1">
                  <Link
                    to="/student/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                  >
                    <User size={16} />
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsLogoutModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out? You will need to sign in again to access the student dashboard."
      />
    </div>
  );
};

export default StudentLayout;