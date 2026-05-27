import { Badge } from '../controls/Badge';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  badge?: { label: string; variant: 'active' | 'spam' | 'ham' | 'neutral' | 'positive' | 'negative' };
  subtitle?: string;
  arrow?: boolean;
}

export function StatCard({ title, value, unit, badge, subtitle, arrow }: StatCardProps) {
  return (
    <div className="card" style={{ position: 'relative', minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Top row */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {badge && <Badge label={badge.label} variant={badge.variant} />}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {unit && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
              letterSpacing: '0.06em',
            }}>{unit}</span>
          )}
          {arrow && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 9L9 3M9 3H4M9 3V8" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </div>

      {/* Title */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        fontWeight: 700,
        color: 'var(--text-muted)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: 6,
      }}>{title}</div>

      {/* Value — flex: 1 pushes subtitle to bottom so all cards stay same height */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 28,
        fontWeight: 700,
        color: 'var(--text-primary)',
        lineHeight: 1,
        wordBreak: 'break-all',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
      }}>{value}</div>

      {subtitle && (
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-muted)',
          letterSpacing: '0.06em',
          marginTop: 6,
        }}>{subtitle}</div>
      )}
    </div>
  );
}
