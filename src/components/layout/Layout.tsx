import React from 'react';
import { Sidebar } from './Sidebar';
import type { Domain } from '../../engine';

interface LayoutProps {
  children: React.ReactNode;
  activeDomain: Domain;
}

export function Layout({ children, activeDomain }: LayoutProps) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg)',
    }}>
      <Sidebar activeDomain={activeDomain} />
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
