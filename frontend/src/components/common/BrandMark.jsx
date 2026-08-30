const BrandMark = ({ className = 'h-10 w-10' }) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
    <rect x="2" y="2" width="36" height="36" rx="10" fill="#3d887b" />
    <path d="M9.5 28.5 17 21l5 4.5L31 14.5" fill="none" stroke="#6f4638" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25.5 14.5H31v5.5" fill="none" stroke="#6f4638" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9.5" cy="28.5" r="2.5" fill="#f8f1ee" />
    <circle cx="17" cy="21" r="2.5" fill="#f8f1ee" />
  </svg>
);

export default BrandMark;
