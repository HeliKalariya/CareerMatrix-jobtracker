import { useEffect, useMemo, useRef } from 'react';
import { ArrowUpRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import useApplicationStore from '../store/applicationStore';
import useAuthStore from '../store/authStore';
import StatusBadge from '../components/common/StatusBadge';

const Dashboard = () => {
  const { stats, applications, fetchApplications } = useApplicationStore();
  const { user } = useAuthStore();
  const chartRef = useRef(null); const chartInstance = useRef(null);
  useEffect(() => { fetchApplications(); }, []);
  const { last7, last30, weekly } = useMemo(() => {
    const now = new Date(); const seven = new Date(now); seven.setDate(now.getDate() - 7); const thirty = new Date(now); thirty.setDate(now.getDate() - 30);
    const days = Array.from({ length: 7 }, (_, index) => { const date = new Date(now); date.setDate(now.getDate() - (6 - index)); date.setHours(0, 0, 0, 0); const next = new Date(date); next.setDate(date.getDate() + 1); return { label: date.toLocaleDateString('en-US', { weekday: 'short' }), value: applications.filter((app) => { const applied = new Date(app.applicationDate); return applied >= date && applied < next; }).length }; });
    return { last7: applications.filter((app) => new Date(app.applicationDate) >= seven).length, last30: applications.filter((app) => new Date(app.applicationDate) >= thirty).length, weekly: days };
  }, [applications]);
  useEffect(() => { if (!chartRef.current) return; chartInstance.current?.destroy(); chartInstance.current = new Chart(chartRef.current, { type: 'bar', data: { labels: weekly.map((item) => item.label), datasets: [{ data: weekly.map((item) => item.value), backgroundColor: ['#3d887b', '#f39456', '#3d887b', '#3d887b', '#3d887b', '#3d887b', '#3d887b'], borderRadius: 8, borderSkipped: false, maxBarThickness: 42 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#718792', font: { weight: 600 } }, border: { display: false } }, y: { display: false, beginAtZero: true } } } }); return () => chartInstance.current?.destroy(); }, [weekly]);
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';
  const cards = [[stats.total || 0, 'Total applications', 'All time momentum'], [last7, 'Last 7 days', 'A fresh week starts here'], [last30, 'Last 30 days', 'Your current focus window'], [stats.offer || 0, 'Offers received', 'A strong step forward']];
  return <div className="max-w-[1450px] mx-auto space-y-6 md:space-y-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="app-eyebrow">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p><h1 className="app-page-title mt-3">{greeting}, {user?.name?.split(' ')[0] || 'there'}</h1><p className="app-subtitle">A clear view of your next best move.</p></div><Link to="/applications/new" className="app-button rounded-xl px-5 py-3.5 text-sm font-semibold inline-flex items-center justify-center gap-2"><Plus className="w-4 h-4"/>Add new job</Link></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">{cards.map(([value, label, caption]) => <div key={label} className="glass rounded-2xl p-6 min-h-40 relative overflow-hidden"><div className="absolute -right-6 -bottom-7 h-20 w-20 rounded-full bg-[#f8ebe2]"/><p className="text-sm font-semibold text-[#718792]">{label}</p><p className="text-4xl font-semibold tracking-tight text-[#29424c] mt-4">{value}</p><p className="text-sm font-semibold text-[#3d887b] mt-3">{caption}</p></div>)}</div>
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5"><section className="xl:col-span-7 glass rounded-2xl p-7"><div className="flex items-start justify-between"><div><h2 className="text-xl font-semibold text-[#29424c]">Weekly activity</h2><p className="text-sm text-[#718792] mt-1">Applications added by day</p></div><ArrowUpRight className="w-5 h-5 text-[#3d887b]"/></div><div className="h-72 mt-8"><canvas ref={chartRef}/></div></section>
      <section className="xl:col-span-5 glass rounded-2xl p-7"><div className="flex justify-between items-start"><div><h2 className="text-xl font-semibold text-[#29424c]">Recent applications</h2><p className="text-sm text-[#718792] mt-1">The latest doors you opened</p></div><Link className="text-sm font-semibold text-[#3d887b]" to="/applications">See all</Link></div><div className="space-y-3 mt-7">{applications.slice(0, 4).map((app) => <Link to={`/applications/${app._id}`} key={app._id} className="flex items-center gap-3 rounded-xl bg-[#faf7f5] border border-[#eee2dc] p-4 hover:border-[#c4ded8]"><div className="w-10 h-10 rounded-xl bg-[#f2e5df] text-[#3d887b] flex items-center justify-center text-sm font-bold">{app.companyName?.slice(0, 2).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="font-semibold text-[#29424c] truncate">{app.jobTitle}</p><p className="text-sm text-[#718792] truncate">{app.companyName} · {new Date(app.applicationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p></div><StatusBadge status={app.status}/></Link>)}{applications.length === 0 && <p className="py-14 text-center text-[#718792]">No applications yet.</p>}</div></section></div>
  </div>;
};
export default Dashboard;
