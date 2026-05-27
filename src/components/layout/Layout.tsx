import type { ReactNode } from 'react';
import { Sidebar, type NavId } from './Sidebar';
import type { Domain } from '../../engine';

interface LayoutProps {
  children: ReactNode;
  activeDomain: Domain;
  activeNav: NavId;
  onNavChange: (id: NavId) => void;
}

export function Layout({ children, activeDomain, activeNav, onNavChange }: LayoutProps) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg)',
    }}>
      <Sidebar activeDomain={activeDomain} activeNav={activeNav} onNavChange={onNavChange} />
      <main style={{
        flex: 1,
        minWidth: 0,
        overflow: 'auto',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        {children}
      </main>
    </div>
  );
}
