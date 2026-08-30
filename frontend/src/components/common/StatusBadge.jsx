const StatusBadge = ({ status }) => {
  const colors = {
    Applied: 'bg-[#e8f3ee] text-[#3d887b]',
    Interview: 'bg-[#e7f1f6] text-[#3d718c]',
    Offer: 'bg-[#f5eadb] text-[#a66b31]',
    Rejected: 'bg-[#f9e8e6] text-[#d75d52]',
  };

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colors[status] || 'bg-[#eee7e3] text-[#718792]'}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
