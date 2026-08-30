import { create } from 'zustand';

const API_URL = import.meta.env.VITE_API_URL || '/api';


const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,

  fetchUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        localStorage.removeItem('token');
        set({ user: null, token: null });
        return;
      }
      const data = await res.json();
      set({ user: data, token });
    } catch (error) {
      console.error(error);
    }
  },

  login: async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      set({ user: data, token: data.token });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  register: async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      localStorage.setItem('token', data.token);
      set({ user: data, token: data.token });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  updateProfile: async ({ name, email }) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ name, email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Unable to update profile');
    set((state) => ({ user: { ...state.user, ...data } }));
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  }
}));

export default useAuthStore;
