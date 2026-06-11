import { create } from 'zustand';

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const res = await fetch('/api/notifications', { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch notifications');
      const data = await res.json();
      set({ notifications: data });
      get().fetchUnreadCount();
    } catch (err) {
      console.error('Notification fetch error:', err);
    } finally {
      set({ loading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const res = await fetch('/api/notifications/unread-count', { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch unread count');
      const data = await res.json();
      set({ unreadCount: data.count });
    } catch (err) {
      console.error('Unread count error:', err);
    }
  },

  markAsRead: async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to mark as read');
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    } catch (err) {
      console.error('Mark as read error:', err);
    }
  },

  markAllAsRead: async () => {
    try {
      const res = await fetch('/api/notifications/read-all', {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to mark all as read');
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0
      }));
    } catch (err) {
      console.error('Mark all as read error:', err);
    }
  },

  deleteNotification: async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to delete notification');
      const wasUnread = get().notifications.find((n) => n._id === id)?.read === false;
      set((state) => ({
        notifications: state.notifications.filter((n) => n._id !== id),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
      }));
    } catch (err) {
      console.error('Delete notification error:', err);
    }
  }
}));

export default useNotificationStore;
