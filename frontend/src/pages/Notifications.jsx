import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Bell, CheckCheck, Trash2, Briefcase } from 'lucide-react';
import useNotificationStore from '../store/notificationStore';
import toast from 'react-hot-toast';

const typeColors = {
  status_change: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  reminder: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  info: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
};

const typeLabels = {
  status_change: 'Status Update',
  reminder: 'Reminder',
  info: 'Info'
};

const Notifications = () => {
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAll = async () => {
    await markAllAsRead();
    toast.success('All notifications marked as read');
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    toast.success('Notification deleted');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-white flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-400" />
            Notifications
          </h1>
          <p className="text-slate-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-2xl text-sm hover:bg-white/5"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      <div className="glass rounded-3xl overflow-hidden">
        {loading ? (
          <p className="text-center text-slate-400 py-16">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No notifications yet</p>
            <p className="text-sm text-slate-500 mt-1">
              You'll get notified when you add jobs or update their status
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`flex items-start gap-4 p-6 hover:bg-white/5 transition-colors ${
                  !n.read ? 'bg-blue-500/5' : ''
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${typeColors[n.type] || typeColors.info}`}>
                  <Bell className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColors[n.type] || typeColors.info}`}>
                      {typeLabels[n.type] || 'Info'}
                    </span>
                    {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full ml-2" />}
                  </div>
                  <p className="font-medium text-white">{n.title}</p>
                  <p className="text-sm text-slate-400 mt-1">{n.message}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                  {n.application && (
                    <Link
                      to={`/applications/${n.application._id}`}
                      className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2"
                    >
                      <Briefcase className="w-3 h-3" />
                      View application
                    </Link>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n._id)}
                      className="p-2 hover:bg-white/10 rounded-xl"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-4 h-4 text-slate-400" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n._id)}
                    className="p-2 hover:bg-white/10 rounded-xl"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
