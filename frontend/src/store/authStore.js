import { create } from 'zustand';

const API_URL = import.meta.env.VITE_API_URL;


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
      return true;
    } catch (error) {
      console.error(error);
      return false;
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
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  }
}));

export default useAuthStore;
