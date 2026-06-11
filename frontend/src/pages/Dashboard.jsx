import { useEffect, useRef, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import useApplicationStore from '../store/applicationStore';
import useAuthStore from '../store/authStore';
import StatusBadge from '../components/common/StatusBadge';

const Dashboard = () => {
  const { stats, applications, fetchApplications } = useApplicationStore();
  const { user } = useAuthStore();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const { last7Days, last30Days, weeklyData, activityMap } = useMemo(() => {
    const now = new Date();
    const sevenAgo = new Date(now);
    sevenAgo.setDate(sevenAgo.getDate() - 7);
    const thirtyAgo = new Date(now);
    thirtyAgo.setDate(thirtyAgo.getDate() - 30);

    const last7 = applications.filter((a) => new Date(a.applicationDate) >= sevenAgo).length;
    const last30 = applications.filter((a) => new Date(a.applicationDate) >= thirtyAgo).length;

    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      const count = applications.filter((a) => {
        const ad = new Date(a.applicationDate);
        return ad >= d && ad < next;
      }).length;
      days.push({
        day: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count
      });
    }

    const map = {};
    applications.forEach((a) => {
      const key = new Date(a.applicationDate).toISOString().split('T')[0];
      map[key] = (map[key] || 0) + 1;
    });

    return { last7Days: last7, last30Days: last30, weeklyData: days, activityMap: map };
  }, [applications]);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: weeklyData.map((d) => d.day),
        datasets: [{
          label: 'Jobs Applied',
          data: weeklyData.map((d) => d.count),
          backgroundColor: '#3b82f6',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#64748b', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#64748b', stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true }
        }
      }
    });

    return () => chartInstance.current?.destroy();
  }, [weeklyData]);

  const recentApps = applications.slice(0, 5);
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const year = new Date().getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const startDay = startOfYear.getDay();
  const totalWeeks = 53;

  const getIntensity = (dateKey) => {
    const count = activityMap[dateKey] || 0;
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count <= 4) return 3;
    return 4;
  };

  const colors = ['#1f2937', '#334155', '#475569', '#60a5fa', '#2563eb'];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-semibold text-white">
            {greeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-slate-400 mt-1">Create new jobs to apply and track.</p>
        </div>
        <Link
          to="/applications/new"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl text-sm font-medium flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Job
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-6 rounded-3xl">
          <p className="text-sm text-slate-400">Total Applications</p>
          <p className="text-5xl font-semibold mt-3 text-white">{stats.total || 0}</p>
        </div>
        <div className="glass p-6 rounded-3xl">
          <p className="text-sm text-slate-400">Last 7 Days</p>
          <p className="text-5xl font-semibold mt-3">{last7Days}</p>
          <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${stats.total ? Math.min(100, (last7Days / stats.total) * 100) : 0}%` }}
            />
          </div>
        </div>
        <div className="glass p-6 rounded-3xl">
          <p className="text-sm text-slate-400">Last 30 Days</p>
          <p className="text-5xl font-semibold mt-3">{last30Days}</p>
          <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${stats.total ? Math.min(100, (last30Days / stats.total) * 100) : 0}%` }}
            />
          </div>
        </div>
        <div className="glass p-6 rounded-3xl">
          <p className="text-sm text-slate-400">Offers Received</p>
          <p className="text-5xl font-semibold mt-3 text-emerald-400">{stats.offer || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 glass rounded-3xl p-6">
          <h2 className="text-lg font-semibold mb-6">Weekly Activity</h2>
          <div className="h-80">
            <canvas ref={chartRef} />
          </div>
        </div>

        <div className="lg:col-span-5 glass rounded-3xl p-6">
          <div className="flex justify-between mb-5">
            <h2 className="text-lg font-semibold">Recent Applications</h2>
            <Link to="/applications" className="text-blue-400 text-sm hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {recentApps.length > 0 ? recentApps.map((app) => (
              <Link
                key={app._id}
                to={`/applications/${app._id}`}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold">
                  {app.companyName?.[0] || 'C'}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{app.jobTitle}</p>
                  <p className="text-sm text-slate-400">{app.companyName}</p>
                </div>
                <StatusBadge status={app.status} />
              </Link>
            )) : (
              <p className="text-center py-12 text-slate-400">No applications yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="glass rounded-3xl p-6">
        <h2 className="text-lg font-semibold mb-4">Activity Calendar ({year})</h2>
        <div className="overflow-x-auto pb-4">
          <div className="inline-block min-w-full">
            <div className="grid grid-cols-12 gap-1 text-xs text-slate-400 mb-2 pl-3">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                <div key={month} className="text-center font-medium">{month}</div>
              ))}
            </div>
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${totalWeeks}, 13px)`, gridTemplateRows: 'repeat(7, 13px)' }}
            >
              {Array.from({ length: totalWeeks * 7 }).map((_, i) => {
                const week = Math.floor(i / 7);
                const dayOfWeek = i % 7;
                const dayOffset = week * 7 + dayOfWeek - startDay;
                const date = new Date(year, 0, 1 + dayOffset);
                if (date.getFullYear() !== year) {
                  return <div key={i} style={{ width: '13px', height: '13px' }} />;
                }
                const dateKey = date.toISOString().split('T')[0];
                const intensity = getIntensity(dateKey);
                return (
                  <div
                    key={i}
                    className="rounded-sm hover:scale-110 transition-transform cursor-pointer"
                    title={`${dateKey}: ${activityMap[dateKey] || 0} applications`}
                    style={{ backgroundColor: colors[intensity], width: '13px', height: '13px' }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-6 text-xs text-slate-400">
          <span>Less</span>
          <div className="flex gap-1">
            {colors.map((color, i) => (
              <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
