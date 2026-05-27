import React, { useState } from 'react';

interface VariantToggleProps {
  value: 'multinomial' | 'bernoulli';
  onChange: (v: 'multinomial' | 'bernoulli') => void;
}

const TOOLTIPS: Record<string, string> = {
  multinomial: 'Uses word counts — repeated words increase evidence',
  bernoulli:   'Binary presence only — word counts ignored',
};

export function VariantToggle({ value, onChange }: VariantToggleProps) {
  const [tooltip, setTooltip] = useState<string | null>(null);

  return (
    <div style={{ position: 'relative' }}>
      <div className="seg-control">
        {(['multinomial', 'bernoulli'] as const).map(v => (
          <button
            key={v}
            className={`seg-control__btn${value === v ? ' seg-control__btn--active' : ''}`}
            onClick={() => onChange(v)}
            onMouseEnter={() => setTooltip(TOOLTIPS[v])}
            onMouseLeave={() => setTooltip(null)}
          >
            {v === 'multinomial' ? 'MULTINOMIAL' : 'BERNOULLI'}
          </button>
        ))}
      </div>
      {tooltip && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: 6,
          background: 'var(--bg-card-2)',
          border: '1px solid var(--border-light)',
          borderRadius: 4,
          padding: '6px 10px',
          fontSize: 11,
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          zIndex: 10,
          pointerEvents: 'none',
        }}>
          {tooltip}
        </div>
      )}
    </div>
  );
}
