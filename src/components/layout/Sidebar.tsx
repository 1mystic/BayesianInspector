import type { Domain } from '../../engine';

export type NavId = 'classifier' | 'domains' | 'formula' | 'about';

interface SidebarProps {
  activeDomain: Domain;
  activeNav: NavId;
  onNavChange: (id: NavId) => void;
  isOpen?: boolean;
}

const NAV_ITEMS: { id: NavId; label: string; icon: string }[] = [
  { id: 'classifier', label: 'CLASSIFIER', icon: 'grid' },
  { id: 'domains',    label: 'DOMAINS',    icon: 'layers' },
  { id: 'formula',   label: 'FORMULA',    icon: 'math' },
  { id: 'about',     label: 'ABOUT',      icon: 'info' },
];

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="3" height="3" fill="currentColor" rx="0.5"/>
      <rect x="5.5" y="1" width="3" height="3" fill="currentColor" rx="0.5"/>
      <rect x="10" y="1" width="3" height="3" fill="currentColor" rx="0.5"/>
      <rect x="1" y="5.5" width="3" height="3" fill="currentColor" rx="0.5"/>
      <rect x="5.5" y="5.5" width="3" height="3" fill="currentColor" rx="0.5"/>
      <rect x="10" y="5.5" width="3" height="3" fill="currentColor" rx="0.5"/>
      <rect x="1" y="10" width="3" height="3" fill="currentColor" rx="0.5"/>
      <rect x="5.5" y="10" width="3" height="3" fill="currentColor" rx="0.5"/>
      <rect x="10" y="10" width="3" height="3" fill="currentColor" rx="0.5"/>
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="2" width="12" height="2" fill="currentColor" rx="1"/>
      <rect x="1" y="6" width="12" height="2" fill="currentColor" rx="1"/>
      <rect x="1" y="10" width="12" height="2" fill="currentColor" rx="1"/>
    </svg>
  );
}

function MathIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <text x="1" y="11" fill="currentColor" fontSize="12" fontFamily="serif">∑</text>
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="6.25" y="6" width="1.5" height="4.5" fill="currentColor" rx="0.5"/>
      <rect x="6.25" y="3.5" width="1.5" height="1.5" fill="currentColor" rx="0.5"/>
    </svg>
  );
}

function NavIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'grid':   return <GridIcon />;
    case 'layers': return <LayersIcon />;
    case 'math':   return <MathIcon />;
    case 'info':   return <InfoIcon />;
    default:       return null;
  }
}

const domainLabels: Record<Domain, string> = {
  spam: 'SPAM',
  news: 'NEWS',
  sentiment: 'SENTIMENT',
};

export function Sidebar({ activeDomain, activeNav, onNavChange, isOpen }: SidebarProps) {
  return (
    <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`} style={{
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
    }}>
      {/* Logo */}
      <div style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        borderBottom: '1px solid var(--border)',
        gap: 10,
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--accent)',
          letterSpacing: '-0.02em',
        }}>BI</span>
        <span style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text-secondary)',
          letterSpacing: '0.04em',
        }}>BayesInspector</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {NAV_ITEMS.map(item => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                height: 36,
                padding: '0 20px',
                background: isActive ? 'var(--bg-card-2)' : 'transparent',
                border: 'none',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'color 150ms, background 150ms',
              }}
            >
              <NavIcon icon={item.icon} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Domain badge at bottom */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: 10,
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.08em',
          marginBottom: 6,
        }}>ACTIVE DOMAIN</div>
        <span className="badge badge--active">{domainLabels[activeDomain]}</span>
      </div>
    </aside>
  );
}
