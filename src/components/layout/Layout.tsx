import { useState } from 'react';
import type { ReactNode } from 'react';
import { Sidebar, type NavId } from './Sidebar';
import type { Domain } from '../../engine';

interface LayoutProps {
  children: ReactNode;
  activeDomain: Domain;
  activeNav: NavId;
  onNavChange: (id: NavId) => void;
}

function HamburgerIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <line x1="2" y1="2" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="12" y1="2" x2="2" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <line x1="1" y1="3.5" x2="13" y2="3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="1" y1="10.5" x2="13" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function Layout({ children, activeDomain, activeNav, onNavChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleNavChange(id: NavId) {
    onNavChange(id);
    setSidebarOpen(false);
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Backdrop — mobile only */}
      <div
        className={`sidebar-backdrop${sidebarOpen ? ' sidebar-backdrop--visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Hamburger — mobile only */}
      <button
        className="hamburger-btn"
        onClick={() => setSidebarOpen(o => !o)}
        aria-label="Toggle navigation"
      >
        <HamburgerIcon open={sidebarOpen} />
      </button>

      <Sidebar
        activeDomain={activeDomain}
        activeNav={activeNav}
        onNavChange={handleNavChange}
        isOpen={sidebarOpen}
      />

      <main
        className="main-content"
        style={{
          flex: 1,
          minWidth: 0,
          marginLeft: 200,
          overflow: 'auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {children}
      </main>
    </div>
  );
}
