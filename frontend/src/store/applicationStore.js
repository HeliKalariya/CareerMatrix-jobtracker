import { create } from 'zustand';
const API_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

const useApplicationStore = create((set, get) => ({
  applications: [],
  loading: false,
  stats: { total: 0, applied: 0, interview: 0, offer: 0, rejected: 0 },

  fetchApplications: async () => {
    set({ loading: true });
    try {
      const res = await fetch(`${API_URL}/applications`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      set({ applications: data });
      get().calculateStats(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      set({ loading: false });
    }
  },

  fetchApplicationById: async (id) => {
    try {
      const res = await fetch(`${API_URL}/applications/${id}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch application');
      return await res.json();
    } catch (err) {
      console.error('Fetch by id error:', err);
      return null;
    }
  },

  addApplication: async (appData) => {
    try {
      const res = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(appData)
      });
      if (!res.ok) throw new Error('Failed to add');
      const newApp = await res.json();
      set((state) => ({ applications: [newApp, ...state.applications] }));
      get().calculateStats(get().applications);
      return newApp;
    } catch (err) {
      console.error('Add error:', err);
      throw err;
    }
  },

  updateApplication: async (appData) => {
    try {
      const { _id, ...body } = appData;
      const res = await fetch(`${API_URL}/applications/${_id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      set((state) => ({
        applications: state.applications.map((a) => (a._id === _id ? updated : a))
      }));
      get().calculateStats(get().applications);
      return updated;
    } catch (err) {
      console.error('Update error:', err);
      throw err;
    }
  },

  deleteApplication: async (id) => {
    try {
      const res = await fetch(`${API_URL}/applications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to delete');
      set((state) => ({
        applications: state.applications.filter((a) => a._id !== id)
      }));
      get().calculateStats(get().applications);
    } catch (err) {
      console.error('Delete error:', err);
      throw err;
    }
  },

  calculateStats: (apps) => {
    const stats = {
      total: apps.length,
      applied: apps.filter((a) => a.status === 'Applied').length,
      interview: apps.filter((a) => a.status === 'Interview').length,
      offer: apps.filter((a) => a.status === 'Offer').length,
      rejected: apps.filter((a) => a.status === 'Rejected').length
    };
    set({ stats });
  }
}));

export default useApplicationStore;
