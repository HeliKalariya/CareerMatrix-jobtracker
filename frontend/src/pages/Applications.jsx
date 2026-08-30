import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit2, Trash2, X, Download, Filter } from 'lucide-react';
import useApplicationStore from '../store/applicationStore';
import useCompanyStore from '../store/companyStore';
import StatusBadge from '../components/common/StatusBadge';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const Applications = () => {
  const navigate = useNavigate();
  const {
  applications,
  fetchApplications,
  deleteApplication,
  addApplication,
  updateApplication
  } = useApplicationStore();
  const { companies, fetchCompanies } = useCompanyStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const [formData, setFormData] = useState({
    jobUrl: '',
    jobTitle: '',
    companyName: '',
    location: '',
    jobType: 'Full-time',
    jobSource: '',
    status: 'Applied',
    applicationDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    salary: '',
    notes: ''
  });

  useEffect(() => {
    fetchApplications();
    fetchCompanies();
  }, []);

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      (app.companyName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (app.jobTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const statusSummary = useMemo(() => ['Applied', 'Interview', 'Offer', 'Rejected'].map((status) => ({
    status, count: applications.filter((app) => app.status === status).length
  })), [applications]);

  const openModal = (app = null, edit = false) => {
    if (app) {
      setFormData({
        jobUrl: app.jobUrl || '',
        jobTitle: app.jobTitle || '',
        companyName: app.companyName || '',
        location: app.location || '',
        jobType: app.jobType || 'Full-time',
        jobSource: app.jobSource || '',
        status: app.status || 'Applied',
        applicationDate: app.applicationDate ? app.applicationDate.split('T')[0] : '',
        dueDate: app.dueDate ? app.dueDate.split('T')[0] : '',
        salary: app.salary || '',
        notes: app.notes || ''
      });
      setSelectedApp(app);
    } else {
      setFormData({
        jobUrl: '', jobTitle: '', companyName: '', location: '', jobType: 'Full-time',
        jobSource: '', status: 'Applied', applicationDate: new Date().toISOString().split('T')[0],
        dueDate: '', salary: '', notes: ''
      });
    }
    setIsEditing(edit);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApp(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (isEditing) {
      await updateApplication({
        ...formData,
        _id: selectedApp._id
      });

      toast.success('Job updated successfully!');
    } else {
      await addApplication(formData);

      toast.success('Job added successfully!');
    }

    fetchApplications();
    closeModal();
  } catch (err) {
    toast.error(err.message);
  }
};
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await deleteApplication(id);
      toast.success('Application deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleExport = () => {
    if (filteredApps.length === 0) {
      toast.error('No applications to export');
      return;
    }
    const headers = ['Date Applied', 'Job Title', 'Company', 'Location', 'Status', 'Source', 'Salary', 'Notes'];
    const rows = filteredApps.map((app) => [
      new Date(app.applicationDate).toLocaleDateString(),
      app.jobTitle,
      app.companyName,
      app.location || '',
      app.status,
      app.jobSource || '',
      app.salary || '',
      (app.notes || '').replace(/"/g, '""')
    ]);
    const csv = [headers, ...rows].map((row) => row.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:justify-between sm:items-end">
        <div>
          <p className="app-eyebrow">Your pipeline</p>
          <h1 className="app-page-title mt-3">Applications</h1>
          <p className="app-subtitle">{filteredApps.length} opportunities in view</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowFilters(!showFilters)} className={`px-5 py-2.5 border rounded-xl text-sm flex items-center gap-2 font-semibold ${showFilters ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:bg-white/5'}`}><Filter className="w-4 h-4" />Filter</button>
          <button
            onClick={handleExport}
            className="px-5 py-2.5 border border-white/10 rounded-xl text-sm font-semibold hover:bg-white/5 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => openModal()}
            className="app-button px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Job
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statusSummary.map(({ status, count }) => (
          <button key={status} onClick={() => { setStatusFilter(statusFilter === status ? 'All' : status); setShowFilters(true); }} className={`text-left glass rounded-2xl p-4 hover:border-blue-500/50 transition-colors ${statusFilter === status ? 'border-blue-500/70 bg-blue-500/10' : ''}`}>
            <p className="text-xs text-slate-400">{status}</p><p className="text-2xl font-semibold mt-1">{count}</p>
          </button>
        ))}
      </div>

      {showFilters && (
        <div className="glass rounded-2xl p-4 flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search by company or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[200px] bg-[#12151f] border border-white/10 rounded-xl px-4 py-2 text-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#12151f] border border-white/10 rounded-xl px-4 py-2 text-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          {(searchTerm || statusFilter !== 'All') && (
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
              className="text-sm text-slate-400 hover:text-white"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <div className="glass rounded-3xl overflow-hidden">
        {filteredApps.length === 0 ? (
          <p className="text-center text-slate-400 py-16">No applications found</p>
        ) : (
          <div className="overflow-x-auto"><table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-white/10 text-left text-sm text-slate-400">
                <th className="px-6 py-5 font-normal">Date Applied</th>
                <th className="px-6 py-5 font-normal">Title</th>
                <th className="px-6 py-5 font-normal">Company</th>
                <th className="px-6 py-5 font-normal">Location</th>
                <th className="px-6 py-5 font-normal">Status</th>
                <th className="px-6 py-5 font-normal">Source</th>
                <th className="px-6 py-5 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredApps.map((app) => (
                <tr key={app._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-5 text-sm text-slate-300">
                    {new Date(app.applicationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-5 font-medium text-white">{app.jobTitle}</td>
                  <td className="px-6 py-5">
                    <span className="font-medium text-[#29424c]">{app.companyName}</span>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-400">{app.location || 'Remote'}</td>
                  <td className="px-6 py-5">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-400">{app.jobSource || '—'}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                      <button onClick={() => navigate(`/applications/${app._id}`)} aria-label={`View ${app.jobTitle}`} title="View details" className="rounded-lg p-2 text-[#718792] transition hover:bg-[#f7efec] hover:text-[#3d887b]"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => openModal(app, true)} aria-label={`Edit ${app.jobTitle}`} title="Edit job" className="rounded-lg p-2 text-[#718792] transition hover:bg-[#f7efec] hover:text-[#3d887b]"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(app._id)} aria-label={`Delete ${app.jobTitle}`} title="Delete job" className="rounded-lg p-2 text-[#718792] transition hover:bg-[#fae9e6] hover:text-[#d75d52]"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200]">
          <div className="bg-[#1a1f2e] rounded-3xl w-full max-w-3xl mx-4 max-h-[92vh] overflow-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold">{isEditing ? 'Edit Job' : 'Add Job'}</h2>
                <button onClick={closeModal} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Job URL</label>
                  <input type="url" className="w-full bg-[#12151f] border border-blue-500 rounded-2xl px-5 py-3" placeholder="Copy and paste job link here" value={formData.jobUrl} onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Job Title</label>
                    <input type="text" required className="w-full bg-[#12151f] border border-white/10 rounded-2xl px-5 py-3" value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Company</label>
                    <input type="text" required list="saved-companies" className="w-full bg-[#12151f] border border-white/10 rounded-2xl px-5 py-3" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
                    <datalist id="saved-companies">{companies.map((company) => <option key={company._id} value={company.name} />)}</datalist>
                    {companies.length > 0 && <p className="text-xs text-slate-500 mt-2">Suggestions from your saved companies</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Job Location</label>
                    <input type="text" className="w-full bg-[#12151f] border border-white/10 rounded-2xl px-5 py-3" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Job Type</label>
                    <div className="flex gap-6 mt-3">
                      {['Full-time', 'Part-time', 'Contract'].map((type) => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="jobType" checked={formData.jobType === type} onChange={() => setFormData({ ...formData, jobType: type })} />
                          <span className="text-sm">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Job Source</label>
                    <select className="w-full bg-[#12151f] border border-white/10 rounded-2xl px-5 py-3" value={formData.jobSource} onChange={(e) => setFormData({ ...formData, jobSource: e.target.value })}>
                      <option value="">Select Source</option>
                      <option value="Indeed">Indeed</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Naukri">Naukri</option>
                      <option value="Company Website">Company Website</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Status</label>
                    <select className="w-full bg-[#12151f] border border-white/10 rounded-2xl px-5 py-3" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Date Applied</label>
                    <input type="date" className="w-full bg-[#12151f] border border-white/10 rounded-2xl px-5 py-3" value={formData.applicationDate} onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Due Date</label>
                    <input type="date" className="w-full bg-[#12151f] border border-white/10 rounded-2xl px-5 py-3" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Salary Range</label>
                  <input type="text" className="w-full bg-[#12151f] border border-white/10 rounded-2xl px-5 py-3" placeholder="0 - 10,000" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Job Description / Notes</label>
                  <textarea rows={6} className="w-full bg-[#12151f] border border-white/10 rounded-3xl px-5 py-4" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Add job description..." />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={closeModal} className="flex-1 py-4 border border-white/10 rounded-2xl font-medium">Cancel</button>
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-semibold">
                    {isEditing ? 'Update Job' : 'Add Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
