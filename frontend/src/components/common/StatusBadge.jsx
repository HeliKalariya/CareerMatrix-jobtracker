const StatusBadge = ({ status }) => {
  const colors = {
    Applied: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    Interview: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
    Offer: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    Rejected: 'bg-red-500/10 text-red-400 border border-red-500/30',
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${colors[status] || 'bg-gray-500/10 text-gray-400'}`}>
      {status}
    </span>
  );
};

export default StatusBadge;