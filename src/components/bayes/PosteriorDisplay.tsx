import { motion, AnimatePresence } from 'framer-motion';
import { DotBar } from '../classifier/ClassScore';
import type { ClassificationResult } from '../../engine/types';

interface PosteriorDisplayProps {
  result: ClassificationResult | null;
}

const CLASS_COLORS = ['--accent', '--blue', '--danger', '--neutral'];

export function PosteriorDisplay({ result }: PosteriorDisplayProps) {
  if (!result) {
    return (
      <div style={{ textAlign: 'center', padding: '12px 0' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}>POSTERIOR P(C|X)</div>
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 48,
            fontWeight: 700,
            color: 'var(--text-muted)',
            lineHeight: 1,
          }}
        >—</motion.div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--accent)',
          letterSpacing: '0.1em',
          marginTop: 8,
          textTransform: 'uppercase',
          fontVariantCaps: 'small-caps',
        }}>START TYPING TO CLASSIFY</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.1em',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        marginBottom: 10,
      }}>POSTERIOR P(C|X)</div>

      {result.classes.map((cls, i) => {
        const color = CLASS_COLORS[i % CLASS_COLORS.length];
        const pct = (result.scores[i] * 100).toFixed(1);
        const isTop = i === result.predicted_class;

        return (
          <div key={cls} style={{ marginBottom: 10 }}>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 4,
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                fontWeight: 700,
                color: `var(${color})`,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>{cls}</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={pct}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: isTop ? 28 : 16,
                    fontWeight: 700,
                    color: isTop ? `var(${color})` : 'var(--text-muted)',
                  }}
                >
                  {pct}%
                </motion.span>
              </AnimatePresence>
            </div>
            <DotBar value={result.scores[i]} color={color} dots={20} />
          </div>
        );
      })}
    </div>
  );
}
