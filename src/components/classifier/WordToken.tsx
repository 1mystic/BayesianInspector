import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { WordContribution } from '../../engine/types';

interface WordTokenProps {
  word: string;
  contribution?: WordContribution;
  classes?: string[];
  isInVocab: boolean;
}

export function WordToken({ word, contribution, classes, isInVocab }: WordTokenProps) {
  const [hovered, setHovered] = useState(false);

  if (!isInVocab || !contribution) {
    return (
      <span style={{ color: 'var(--text-muted)' }}>{word}</span>
    );
  }

  const delta = contribution.delta_score;
  const dir = contribution.direction;

  let overlayColor: string;
  let overlayOpacity: number;

  if (dir === 'positive') {
    overlayColor = 'var(--accent)';
  } else if (dir === 'negative') {
    overlayColor = 'var(--danger)';
  } else {
    overlayColor = 'var(--neutral)';
  }

  if (delta > 1.5) {
    overlayOpacity = 0.85;
  } else if (delta > 0.5) {
    overlayOpacity = 0.45;
  } else {
    overlayOpacity = 0.18;
  }

  return (
    <span
      style={{ position: 'relative', display: 'inline' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{
        color: overlayColor,
        opacity: overlayOpacity + 0.15,
        cursor: 'default',
      }}>{word}</span>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: 6,
              background: 'var(--bg-card-2)',
              border: '1px solid var(--border-light)',
              borderRadius: 4,
              padding: '6px 10px',
              zIndex: 100,
              minWidth: 160,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--accent)',
              letterSpacing: '0.06em',
              marginBottom: 4,
            }}>{word.toUpperCase()}</div>
            {(classes ?? contribution.log_probs.map((_, i) => `Class ${i}`)).map((cls, i) => (
              <div key={cls} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-muted)',
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
              }}>
                <span>{cls.toUpperCase()}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{contribution.log_probs[i].toFixed(3)}</span>
              </div>
            ))}
            <div style={{
              borderTop: '1px solid var(--border)',
              marginTop: 4,
              paddingTop: 4,
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
            }}>Δ = {contribution.delta_score.toFixed(3)}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
