import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useApplicationStore from '../store/applicationStore';
import useCompanyStore from '../store/companyStore';
import toast from 'react-hot-toast';

const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addApplication, updateApplication, fetchApplicationById } = useApplicationStore();
  const { companies, fetchCompanies } = useCompanyStore();
  const [loading, setLoading] = useState(!!id);

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
    if (!id) return;
    const load = async () => {
      const app = await fetchApplicationById(id);
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
      }
      setLoading(false);
    };
    load();
  }, [id]);

  useEffect(() => { fetchCompanies(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateApplication({ ...formData, _id: id });
        toast.success('Application updated successfully');
      } else {
        await addApplication(formData);
        toast.success('Job added successfully');
      }
      navigate('/applications');
    } catch {
      toast.error('Something went wrong');
    }
  };

  if (loading) {
    return <p className="text-center text-slate-400 py-20">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass rounded-3xl p-8">
        <h1 className="text-3xl font-semibold mb-8">{id ? 'Edit Job' : 'Add New Job'}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Job URL</label>
            <input
              type="url"
              className="w-full bg-[#1a1f2e] border border-white/10 rounded-2xl px-5 py-3 focus:border-blue-500 outline-none"
              placeholder="Copy and paste job link here"
              value={formData.jobUrl}
              onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Job Title</label>
              <input type="text" required className="w-full bg-[#1a1f2e] border border-white/10 rounded-2xl px-5 py-3"
                value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Company</label>
              <input type="text" required list="saved-companies" className="w-full bg-[#1a1f2e] border border-white/10 rounded-2xl px-5 py-3"
                value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
              <datalist id="saved-companies">{companies.map((company) => <option key={company._id} value={company.name} />)}</datalist>
              {companies.length > 0 && <p className="text-xs text-slate-500 mt-2">Start typing to select from your saved companies.</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Location</label>
              <input type="text" className="w-full bg-[#1a1f2e] border border-white/10 rounded-2xl px-5 py-3"
                value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Job Type</label>
              <select className="w-full bg-[#1a1f2e] border border-white/10 rounded-2xl px-5 py-3"
                value={formData.jobType} onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Job Source</label>
              <select className="w-full bg-[#1a1f2e] border border-white/10 rounded-2xl px-5 py-3"
                value={formData.jobSource} onChange={(e) => setFormData({ ...formData, jobSource: e.target.value })}>
                <option value="">Select Source</option>
                <option value="Indeed">Indeed</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Naukri">Naukri</option>
                <option value="Company Website">Company Website</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Status</label>
              <select className="w-full bg-[#1a1f2e] border border-white/10 rounded-2xl px-5 py-3"
                value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
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
              <input type="date" className="w-full bg-[#1a1f2e] border border-white/10 rounded-2xl px-5 py-3"
                value={formData.applicationDate} onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Due Date</label>
              <input type="date" className="w-full bg-[#1a1f2e] border border-white/10 rounded-2xl px-5 py-3"
                value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Salary Range</label>
            <input type="text" className="w-full bg-[#1a1f2e] border border-white/10 rounded-2xl px-5 py-3"
              placeholder="0 - 10,000" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Notes / Job Description</label>
            <textarea rows={6} className="w-full bg-[#1a1f2e] border border-white/10 rounded-3xl px-5 py-4"
              placeholder="Add any notes, recruiter info, or job description..."
              value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl text-lg font-medium transition-all">
            {id ? 'Update Job' : 'Add Job'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
