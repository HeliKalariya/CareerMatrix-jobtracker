import { NavLink } from 'react-router-dom';
import { Home, Briefcase, Building2, LogOut, Settings } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import BrandMark from '../common/BrandMark';
import BrandName from '../common/BrandName';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuthStore();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Briefcase, label: 'Applications', path: '/applications' },
    { icon: Building2, label: 'Companies', path: '/companies' },
  ];

  return (
    <div className={`h-full bg-[#ede0da] border-r border-[#dfd1ca] transition-all duration-300 ${isOpen ? 'w-72' : 'w-20'} flex flex-col flex-shrink-0`}>
      <div className="h-28 px-6 flex items-center overflow-hidden">
        {isOpen ? (
          <div className="flex items-center gap-3" aria-label="CareerMatrix"><BrandMark /><BrandName /></div>
        ) : (
          <BrandMark />
        )}
      </div>

      <div className={`${isOpen ? 'px-5' : 'px-3'} pt-6`}>
        {isOpen && <p className="px-3 pb-4 text-xs font-bold tracking-[0.14em] text-[#718792]">WORKSPACE</p>}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center rounded-2xl text-sm font-semibold transition-all ${isOpen ? 'gap-3 px-4 py-3.5' : 'justify-center p-4'} ${isActive
                  ? 'bg-white text-[#3d887b] shadow-[0_10px_24px_rgba(76,53,44,0.08)]'
                  : 'text-[#718792] hover:bg-[#f7efec] hover:text-[#29424c]'
                }`
              }
            >
              <item.icon className={isOpen ? 'w-5 h-5' : 'w-6 h-6'} />
              {isOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className={`${isOpen ? 'p-5' : 'p-3'} mt-auto border-t border-[#dfd1ca] space-y-1`}>
        <NavLink to="/profile" className={({ isActive }) => `flex items-center rounded-2xl text-sm font-semibold ${isOpen ? 'gap-3 px-4 py-3' : 'justify-center p-4'} ${isActive ? 'bg-white text-[#3d887b]' : 'text-[#718792] hover:bg-[#f7efec]'}`}><Settings className={isOpen ? 'w-5 h-5' : 'w-6 h-6'} />{isOpen && <span>Profile & settings</span>}</NavLink>
        <button
          onClick={logout}
          className={`flex items-center text-[#718792] hover:text-[#d75d52] w-full rounded-xl hover:bg-[#fae9e6] transition-all text-sm font-semibold ${isOpen ? 'gap-3 px-4 py-3' : 'justify-center p-4'}`}
        >
          <LogOut className={isOpen ? 'w-5 h-5' : 'w-6 h-6'} />
          {isOpen && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
