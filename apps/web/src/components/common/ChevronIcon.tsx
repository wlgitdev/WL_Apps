interface ChevronIconProps {
  isExpanded: boolean;
}

export const ChevronIcon = ({ isExpanded }: ChevronIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);