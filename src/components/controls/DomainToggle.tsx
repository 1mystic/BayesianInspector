import type { Domain } from '../../engine';

interface DomainToggleProps {
  value: Domain;
  onChange: (d: Domain) => void;
}

const DOMAINS: { value: Domain; label: string }[] = [
  { value: 'spam',      label: 'SPAM' },
  { value: 'news',      label: 'NEWS' },
  { value: 'sentiment', label: 'SENTIMENT' },
];

export function DomainToggle({ value, onChange }: DomainToggleProps) {
  return (
    <div className="seg-control">
      {DOMAINS.map(d => (
        <button
          key={d.value}
          className={`seg-control__btn${value === d.value ? ' seg-control__btn--active' : ''}`}
          onClick={() => onChange(d.value)}
        >
          {d.label}
        </button>
      ))}
    </div>
  );
}
