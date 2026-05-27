import { DotBar } from '../classifier/ClassScore';

interface PriorPanelProps {
  classes?: string[];
  priors?: number[];
}

const CLASS_COLORS = ['--accent', '--blue', '--danger', '--neutral'];

export function PriorPanel({ classes, priors }: PriorPanelProps) {
  const displayClasses = classes ?? ['CLASS A', 'CLASS B'];
  const displayPriors  = priors  ?? displayClasses.map(() => 1 / displayClasses.length);

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.1em',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        marginBottom: 10,
      }}>PRIOR P(C)</div>

      {displayClasses.map((cls, i) => {
        const color = CLASS_COLORS[i % CLASS_COLORS.length];
        const pct = ((displayPriors[i] ?? 0) * 100).toFixed(1);
        return (
          <div key={cls} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 6,
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 700,
              color: `var(${color})`,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              minWidth: 90,
            }}>{cls}</span>
            <DotBar value={displayPriors[i] ?? 0} color={color} dots={20} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: `var(${color})`,
              minWidth: 40,
              textAlign: 'right',
            }}>{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}
