import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import useNotificationStore from '../../store/notificationStore';

const typeColors = {
  status_change: 'bg-blue-500/20 text-blue-400',
  reminder: 'bg-amber-500/20 text-amber-400',
  info: 'bg-emerald-500/20 text-emerald-400'
};

const NotificationDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotificationStore();

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const recent = notifications.slice(0, 5);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-10 w-96 bg-[#1a1f2e] border border-white/10 rounded-2xl shadow-2xl z-[200] overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-400" />
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {recent.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-10">No notifications yet</p>
        ) : (
          recent.map((n) => (
            <div
              key={n._id}
              className={`px-5 py-3 border-b border-white/5 hover:bg-white/5 transition-colors ${
                !n.read ? 'bg-blue-500/5' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${typeColors[n.type] || typeColors.info}`}>
                      {n.type === 'status_change' ? 'Status' : n.type === 'reminder' ? 'Reminder' : 'Info'}
                    </span>
                    {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                  </div>
                  <p className="text-sm font-medium text-white truncate">{n.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n._id)}
                      className="p-1 hover:bg-white/10 rounded-lg"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n._id)}
                    className="p-1 hover:bg-white/10 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Link
        to="/notifications"
        onClick={onClose}
        className="block text-center text-sm text-blue-400 hover:text-blue-300 py-3 border-t border-white/10"
      >
        View all notifications
      </Link>
    </div>
  );
};

export default NotificationDropdown;
