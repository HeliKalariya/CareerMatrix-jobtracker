import { useState, useEffect } from 'react';
import { Menu, Bell } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useNotificationStore from '../../store/notificationStore';
import NotificationDropdown from '../notifications/NotificationDropdown';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuthStore();
  const { unreadCount, fetchUnreadCount } = useNotificationStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="h-16 border-b border-white/10 bg-dark-900/80 backdrop-blur-lg px-6 flex items-center justify-between z-50">
      <button
        onClick={toggleSidebar}
        className="p-2 hover:bg-white/10 rounded-xl transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors relative"
          >
            <Bell className="w-5 h-5 text-gray-400 hover:text-white" />
            {unreadCount > 0 && (
              <div className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center px-1">
                <span className="text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </div>
            )}
          </button>
          <NotificationDropdown
            isOpen={dropdownOpen}
            onClose={() => setDropdownOpen(false)}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 -mt-0.5">Job Tracker</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
