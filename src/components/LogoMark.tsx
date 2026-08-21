interface LogoMarkProps {
  className?: string;
}

export function LogoMark({ className }: LogoMarkProps): React.JSX.Element {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect
        x="10"
        y="12"
        width="28"
        height="40"
        rx="2.5"
        fill="none"
        stroke="#efede7"
        strokeWidth="3.5"
      />
      <line x1="38" y1="24" x2="48" y2="24" stroke="#4a4740" strokeWidth="2.5" />
      <line x1="38" y1="44" x2="48" y2="44" stroke="#4a4740" strokeWidth="2.5" />
      <circle cx="48" cy="24" r="5.5" fill="#d9a254" stroke="#efede7" strokeWidth="2" />
      <circle cx="48" cy="44" r="5.5" fill="#5b7fb5" stroke="#efede7" strokeWidth="2" />
    </svg>
  );
}