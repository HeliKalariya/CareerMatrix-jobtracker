import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, MapPin, Calendar, DollarSign } from 'lucide-react';
import useApplicationStore from '../store/applicationStore';
import StatusBadge from '../components/common/StatusBadge';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchApplicationById } = useApplicationStore();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchApplicationById(id);
      setApp(data);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return <p className="text-center text-slate-400 py-20">Loading...</p>;
  }

  if (!app) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 mb-4">Application not found</p>
        <Link to="/applications" className="text-blue-400 hover:underline">Back to applications</Link>
      </div>
    );
  }

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/applications')}
        className="flex items-center gap-2 text-[#718792] hover:text-[#3d887b] text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to applications
      </button>

      <div className="glass rounded-3xl p-8">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              {app.companyName?.[0] || '?'}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">{app.jobTitle}</h1>
              <p className="text-slate-400">{app.companyName}</p>
            </div>
          </div>
          <StatusBadge status={app.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {app.location && (
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl">
              <MapPin className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-xs text-slate-500">Location</p>
                <p className="text-sm">{app.location}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl">
            <Calendar className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-xs text-slate-500">Date Applied</p>
              <p className="text-sm">{formatDate(app.applicationDate)}</p>
            </div>
          </div>
          {app.dueDate && (
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl">
              <Calendar className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-xs text-slate-500">Due Date</p>
                <p className="text-sm">{formatDate(app.dueDate)}</p>
              </div>
            </div>
          )}
          {app.salary && (
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-xs text-slate-500">Salary</p>
                <p className="text-sm">{app.salary}</p>
              </div>
            </div>
          )}
          {app.jobType && (
            <div className="p-4 bg-white/5 rounded-2xl">
              <p className="text-xs text-slate-500">Job Type</p>
              <p className="text-sm">{app.jobType}</p>
            </div>
          )}
          {app.jobSource && (
            <div className="p-4 bg-white/5 rounded-2xl">
              <p className="text-xs text-slate-500">Source</p>
              <p className="text-sm">{app.jobSource}</p>
            </div>
          )}
        </div>

        {app.jobUrl && (
          <a
            href={app.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm mb-6"
          >
            <ExternalLink className="w-4 h-4" />
            View original job posting
          </a>
        )}

        {app.notes && (
          <div className="mb-8">
            <h3 className="text-sm text-slate-500 mb-2">Notes / Description</h3>
            <p className="text-sm text-slate-300 whitespace-pre-wrap bg-white/5 rounded-2xl p-4">
              {app.notes}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ApplicationDetails;
