import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ClassificationResult } from '../../engine/types';

interface FormulaPanelProps {
  result: ClassificationResult | null;
}

function AnimatedNum({ value }: { value: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.15 }}
        style={{ display: 'inline-block' }}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}

export function FormulaPanel({ result }: FormulaPanelProps) {
  const monoStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    lineHeight: 1.8,
  };

  if (!result) {
    return (
      <div style={monoStyle}>
        <div style={{ color: 'var(--text-muted)', marginBottom: 8 }}>
          P(C|X) ∝ P(C) × ∏ P(xᵢ|C)
        </div>
        <div style={{ color: 'var(--border-light)', fontSize: 10 }}>
          0 VOCAB HITS — AWAITING INPUT
        </div>
      </div>
    );
  }

  if (result.n_words_found === 0) {
    return (
      <div style={monoStyle}>
        <div style={{ color: 'var(--text-muted)', marginBottom: 8 }}>
          P(C|X) ∝ P(C) × ∏ P(xᵢ|C)
        </div>
        <div style={{ color: 'var(--accent)', fontSize: 10 }}>
          0 VOCAB HITS — PRIOR ONLY
        </div>
        {result.classes.map((cls, i) => (
          <div key={cls} style={{ color: 'var(--text-muted)', fontSize: 10 }}>
            {cls.toUpperCase()}: log({result.class_log_priors[i].toFixed(3)}) = {result.log_scores[i].toFixed(3)} → {(result.scores[i] * 100).toFixed(1)}%
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={monoStyle}>
      <div style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
        P(C|X) ∝ P(C) × ∏ P(xᵢ|C)
      </div>

      {result.classes.map((cls, i) => {
        const topContribs = result.word_contributions.slice(0, 3);
        return (
          <div key={cls} style={{ marginBottom: 8 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 10, marginBottom: 2 }}>
              {cls.toUpperCase()}:
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>
              {'  '}
              log(<AnimatedNum value={result.class_log_priors[i].toFixed(3)} />)
              {topContribs.map(wc => (
                <span key={wc.word}>
                  {' + '}log(<AnimatedNum value={wc.contribution[i].toFixed(3)} />)
                </span>
              ))}
              {result.word_contributions.length > 3 && (
                <span style={{ color: 'var(--border-light)' }}> + ...</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span style={{ color: 'var(--border-light)', fontSize: 10 }}>{'  = '}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: 10 }}>
                <AnimatedNum value={result.log_scores[i].toFixed(3)} />
              </span>
              <span style={{ color: 'var(--border-light)', fontSize: 10 }}>{' → '}</span>
              <span style={{ color: 'var(--accent)', fontSize: 11, fontWeight: 700 }}>
                <AnimatedNum value={`${(result.scores[i] * 100).toFixed(1)}%`} />
              </span>
            </div>
          </div>
        );
      })}

      <div style={{
        borderTop: '1px solid var(--border)',
        paddingTop: 6,
        marginTop: 4,
        fontSize: 10,
        color: 'var(--text-muted)',
      }}>
        {result.n_words_found} VOCAB HIT{result.n_words_found !== 1 ? 'S' : ''} · {result.variant.toUpperCase()} · {result.processing_ms.toFixed(1)}ms
      </div>
    </div>
  );
}
