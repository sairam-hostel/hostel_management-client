import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileEdit, BellRing, Search, MessageSquareWarning, LogOut } from 'lucide-react';
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
    path: '/student/outpass',
    label: 'Outpass',
    icon: FileEdit,
  },
  {
    path: '/student/notification',
    label: 'Notification',
    icon: BellRing,

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
  const isActive = (path) => location.pathname === path;
  const { unreadCount } = useNotification();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

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
              ${isActive(path)
                  ? 'bg-white text-purple-700 shadow-md'
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
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex flex-col items-center justify-center w-full py-3 rounded-lg transition-all duration-200 text-xs font-medium text-purple-200 hover:bg-purple-600 hover:text-white"
          >
            <LogOut size={22} className="text-purple-200" />
            <span className="mt-1 text-center">Logout</span>
          </button>
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
            <Logo className="h-18 w-auto object-contain" />
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