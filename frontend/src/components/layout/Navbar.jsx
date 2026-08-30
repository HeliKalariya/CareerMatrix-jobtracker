import { Menu, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuthStore();
  return (
    <nav className="h-[94px] border-b border-[#e2d5ce] bg-[#f9f3f0]/90 backdrop-blur-lg px-7 md:px-12 flex items-center justify-between z-50">
      <button
        onClick={toggleSidebar}
        className="p-2 text-[#6f8790] hover:bg-[#f1e6e0] rounded-xl transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex items-center gap-3 sm:gap-5">
        <Link to="/companies" className="hidden sm:flex items-center gap-2 rounded-xl bg-[#f3e7e1] px-4 py-3 text-sm font-semibold text-[#29424c] hover:bg-[#ebdcd4] transition-colors">
          <Building2 className="w-4 h-4" /> Companies
        </Link>
        <Link to="/profile" className="flex items-center gap-3 rounded-xl p-1 hover:bg-[#f1e6e0] transition-colors" aria-label="Open profile">
          <div className="w-10 h-10 bg-[#3d887b] rounded-xl flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-[#29424c]">{user?.name || 'User'}</p>
            <p className="text-xs text-[#718792]">{user?.email || ''}</p>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
