import React from 'react';
import { motion } from 'framer-motion';

interface DotBarProps {
  value: number;  // 0–1
  color?: string; // CSS var name like '--accent'
  dots?: number;
}

export function DotBar({ value, color = '--accent', dots = 20 }: DotBarProps) {
  const filled = Math.round(value * dots);
  return (
    <div className="dot-bar">
      {Array.from({ length: dots }).map((_, i) => (
        <div
          key={i}
          className={`dot-bar__dot${i < filled ? ' dot-bar__dot--filled' : ''}`}
          style={{
            background: i < filled ? `var(${color})` : undefined,
            transitionDelay: `${i * 15}ms`,
          }}
        />
      ))}
    </div>
  );
}

interface ClassScoreProps {
  label: string;
  score: number;  // 0–1
  index: number;
}

const CLASS_COLORS: string[] = ['--accent', '--blue', '--danger', '--neutral'];

export function ClassScore({ label, score, index }: ClassScoreProps) {
  const color = CLASS_COLORS[index % CLASS_COLORS.length];
  const pct = (score * 100).toFixed(1);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 8,
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 700,
        color: `var(${color})`,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        minWidth: 100,
      }}>{label}</span>
      <DotBar value={score} color={color} dots={20} />
      <motion.span
        key={pct}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          fontWeight: 700,
          color: `var(${color})`,
          minWidth: 46,
          textAlign: 'right',
        }}
      >
        {pct}%
      </motion.span>
    </div>
  );
}
