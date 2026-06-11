import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import useAuthStore from '../../store/authStore';
import useNotificationStore from '../../store/notificationStore';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { fetchUser } = useAuthStore();
  const { fetchUnreadCount } = useNotificationStore();

  useEffect(() => {
    fetchUser();
    fetchUnreadCount();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a]">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;