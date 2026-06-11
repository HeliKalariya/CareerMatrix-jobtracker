import { NavLink } from 'react-router-dom';
import { Home, Briefcase, PlusCircle, LogOut, Bell } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuthStore();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Briefcase, label: 'Applications', path: '/applications' },
    // { icon: PlusCircle, label: 'Add Application', path: '/applications/new' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
  ];

  return (
    <div className={`h-full bg-dark-900 border-r border-white/10 transition-all duration-300 ${isOpen ? 'w-72' : 'w-20'} flex-shrink-0`}>
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-xl">C</span>
        </div>
        {isOpen && <h1 className="text-2xl font-semibold tracking-tight">CareerMatrix</h1>}
      </div>

      <div className="p-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${isActive
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-white/5 text-gray-400 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {isOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-6 w-full px-6">
        <button
          onClick={logout}
          className="flex items-center gap-3 text-red-400 hover:text-red-500 w-full px-4 py-3 rounded-2xl hover:bg-white/5 transition-all"
        >
          <LogOut className="w-5 h-5" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;