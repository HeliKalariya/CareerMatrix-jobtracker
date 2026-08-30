import { create } from 'zustand';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' });

const useCompanyStore = create((set) => ({
  companies: [],
  loading: false,
  fetchCompanies: async () => {
    set({ loading: true });
    try {
      const res = await fetch(`${API_URL}/companies`, { headers: headers() });
      if (!res.ok) throw new Error('Unable to load companies');
      set({ companies: await res.json() });
    } finally { set({ loading: false }); }
  },
  addCompany: async (company) => {
    const res = await fetch(`${API_URL}/companies`, { method: 'POST', headers: headers(), body: JSON.stringify(company) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Unable to add company');
    set((state) => ({ companies: [...state.companies, data].sort((a, b) => a.name.localeCompare(b.name)) }));
    return data;
  },
  updateCompany: async (company) => {
    const res = await fetch(`${API_URL}/companies/${company._id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(company) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Unable to update company');
    set((state) => ({ companies: state.companies.map((item) => item._id === data._id ? { ...item, ...data } : item) }));
  },
  deleteCompany: async (id) => {
    const res = await fetch(`${API_URL}/companies/${id}`, { method: 'DELETE', headers: headers() });
    if (!res.ok) throw new Error('Unable to delete company');
    set((state) => ({ companies: state.companies.filter((company) => company._id !== id) }));
  }
}));

export default useCompanyStore;
