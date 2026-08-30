import { useEffect, useMemo, useState } from 'react';
import { Building2, Edit3, Globe, MapPin, Plus, Search, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import useCompanyStore from '../store/companyStore';

const emptyCompany = { name: '', website: '', industry: '', location: '', notes: '' };

const Companies = () => {
  const { companies, loading, fetchCompanies, addCompany, updateCompany, deleteCompany } = useCompanyStore();
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyCompany);

  useEffect(() => { fetchCompanies(); }, []);
  const filteredCompanies = useMemo(() => companies.filter((company) =>
    [company.name, company.industry, company.location].some((value) => value?.toLowerCase().includes(query.toLowerCase()))
  ), [companies, query]);

  const openModal = (company = null) => {
    setEditing(company);
    setForm(company ? { name: company.name, website: company.website || '', industry: company.industry || '', location: company.location || '', notes: company.notes || '' } : emptyCompany);
    setModalOpen(true);
  };

  const saveCompany = async (event) => {
    event.preventDefault();
    try {
      if (editing) { await updateCompany({ ...editing, ...form }); toast.success('Company updated'); }
      else { await addCompany(form); toast.success('Company added'); }
      setModalOpen(false);
    } catch (error) { toast.error(error.message); }
  };

  const removeCompany = async (company) => {
    if (!window.confirm(`Remove ${company.name} from your company list? Existing applications will be kept.`)) return;
    try { await deleteCompany(company._id); toast.success('Company removed'); }
    catch { toast.error('Could not remove company'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="app-eyebrow mb-3">Your watchlist</p>
          <h1 className="app-page-title">Companies</h1>
          <p className="app-subtitle">{companies.length} saved target companies</p>
        </div>
        <button onClick={() => openModal()} className="app-button px-5 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Add company
        </button>
      </div>

      <div className="glass rounded-2xl p-3 flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-500 ml-2" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search companies, industries, or locations" className="w-full bg-transparent outline-none px-2 py-2 text-sm" />
        <span className="text-xs text-slate-500 whitespace-nowrap pr-2">{companies.length} saved</span>
      </div>

      {loading ? <p className="text-center py-16 text-slate-400">Loading companies...</p> : filteredCompanies.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
          <Building2 className="w-11 h-11 text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">{query ? 'No companies match that search' : 'Start your target company list'}</h2>
          <p className="text-slate-400 mt-2 mb-6">Save companies before an opening appears, then add jobs when you find the right role.</p>
          {!query && <button onClick={() => openModal()} className="text-blue-400 hover:text-blue-300 text-sm font-medium">Add your first company</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredCompanies.map((company) => (
            <article key={company._id} className="glass rounded-3xl p-6 hover:border-blue-500/40 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-semibold text-xl">{company.name[0]?.toUpperCase()}</div>
                <div className="flex gap-1">
                  <button onClick={() => openModal(company)} aria-label={`Edit ${company.name}`} className="p-2 text-[#718792] rounded-xl"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => removeCompany(company)} aria-label={`Remove ${company.name}`} className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <h2 className="font-semibold text-lg mt-5">{company.name}</h2>
              <p className="text-sm text-blue-300 min-h-5">{company.industry || 'Industry not set'}</p>
              <div className="mt-5 space-y-2 text-sm text-slate-400 min-h-12">
                {company.location && <p className="flex gap-2 items-center"><MapPin className="w-4 h-4" />{company.location}</p>}
                {company.website && <a href={company.website} target="_blank" rel="noreferrer" className="flex gap-2 items-center hover:text-blue-300 truncate"><Globe className="w-4 h-4 shrink-0" />{company.website.replace(/^https?:\/\//, '')}</a>}
              </div>
              <div className="border-t border-white/10 mt-5 pt-4 flex justify-between text-sm"><span className="text-slate-400">Active applications</span><span className="font-semibold text-white">{company.applicationCount || 0}</span></div>
            </article>
          ))}
        </div>
      )}

      {modalOpen && <div className="fixed inset-0 z-[200] bg-black/80 p-4 flex items-center justify-center">
        <div className="bg-[#1a1f2e] border border-white/10 rounded-3xl w-full max-w-xl max-h-[92vh] overflow-auto p-7">
          <div className="flex justify-between items-center mb-6"><div><h2 className="text-xl font-semibold">{editing ? 'Edit company' : 'Add a company'}</h2><p className="text-sm text-slate-400 mt-1">Build a focused list of places you want to work.</p></div><button onClick={() => setModalOpen(false)} className="p-2 text-slate-400 hover:text-white"><X /></button></div>
          <form onSubmit={saveCompany} className="space-y-4">
            {[['name', 'Company name', 'e.g. Figma'], ['website', 'Website', 'https://company.com'], ['industry', 'Industry', 'e.g. Design software'], ['location', 'Headquarters or work location', 'e.g. Remote / Bengaluru']].map(([key, label, placeholder]) => <label key={key} className="block text-sm text-slate-400">{label}<input required={key === 'name'} type={key === 'website' ? 'url' : 'text'} value={form[key]} placeholder={placeholder} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="mt-2 w-full bg-[#12151f] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500" /></label>)}
            <label className="block text-sm text-slate-400">Research notes<textarea value={form.notes} placeholder="Culture, contacts, career page, or other details" onChange={(event) => setForm({ ...form, notes: event.target.value })} rows={3} className="mt-2 w-full bg-[#12151f] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500" /></label>
            <div className="flex gap-3 pt-2"><button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 border border-white/10 rounded-xl">Cancel</button><button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium">{editing ? 'Save changes' : 'Add company'}</button></div>
          </form>
        </div>
      </div>}
    </div>
  );
};

export default Companies;
