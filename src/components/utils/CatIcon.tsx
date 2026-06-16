const CatIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://w3.org"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1 .88 2.22.88 3.5 0 4.69-3.5 8.5-8.88 8.5-5.37 0-8.88-3.81-8.88-8.5 0-1.28.31-2.5.88-3.5 0 0-1.82-6.42-.42-7 1.39-.58 4.64.26 6.42 2.26.65-.17 1.33-.26 2-.26Z" />
    <path d="M9 14h.01" />
    <path d="M15 14h.01" />
    <path d="M11 17h2" />
  </svg>
);

export default CatIcon;