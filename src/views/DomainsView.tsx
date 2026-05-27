import { motion } from 'framer-motion';
import { useModelLoader } from '../hooks/useModelLoader';
import { DotBar } from '../components/classifier/ClassScore';
import { Badge } from '../components/controls/Badge';
import type { ModelData } from '../engine/types';

const CLASS_COLORS = ['--accent', '--blue', '--danger', '--neutral'];

function softmax(logProbs: number[]): number[] {
  const max = Math.max(...logProbs);
  const exps = logProbs.map(v => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(v => v / sum);
}

function ModelCard({ model, index }: { model: ModelData; index: number }) {
  const priors = softmax(model.class_log_priors);

  // Top 4 words per class by probability
  const topWords = model.classes.map((_, ci) => {
    const withProbs = model.vocab.map((word, wi) => ({
      word,
      prob: Math.exp(model.log_probs[wi][ci]),
    }));
    withProbs.sort((a, b) => b.prob - a.prob);
    return withProbs.slice(0, 6);
  });

  const domainBadgeVariant: Record<string, 'spam' | 'ham' | 'active' | 'neutral'> = {
    spam: 'spam',
    news: 'active',
    sentiment: 'ham',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="card"
    >
      {/* Header */}
      <div className="panel-header">
        <span className="panel-header__title">{model.domain.toUpperCase()} MODEL</span>
        <Badge label={model.domain.toUpperCase()} variant={domainBadgeVariant[model.domain] ?? 'neutral'} />
      </div>

      {/* Meta row */}
      <div style={{
        display: 'flex',
        gap: 24,
        marginBottom: 20,
        paddingBottom: 16,
        borderBottom: '1px solid var(--border)',
      }}>
        {[
          { label: 'VOCAB SIZE', value: model.vocab_size.toString() },
          { label: 'CLASSES', value: model.n_classes.toString() },
          { label: 'VARIANT', value: 'MNB' },
        ].map(item => (
          <div key={item.label}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              marginBottom: 4,
            }}>{item.label}</div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1,
            }}>{item.value}</div>
          </div>
        ))}
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            marginBottom: 4,
          }}>TRAINING DATA</div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
          }}>{model.training_info}</div>
        </div>
      </div>

      {/* Class priors */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          fontWeight: 700,
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}>CLASS PRIORS</div>
        {model.classes.map((cls, ci) => {
          const color = CLASS_COLORS[ci % CLASS_COLORS.length];
          const pct = (priors[ci] * 100).toFixed(1);
          return (
            <div key={cls} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 700,
                color: `var(${color})`,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                minWidth: 100,
              }}>{cls}</span>
              <DotBar value={priors[ci]} color={color} dots={20} />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: `var(${color})`,
                minWidth: 42,
                textAlign: 'right',
              }}>{pct}%</span>
            </div>
          );
        })}
      </div>

      {/* Top words per class */}
      <div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          fontWeight: 700,
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}>TOP WORDS BY CLASS</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(model.classes.length, 4)}, 1fr)`,
          gap: 16,
        }}>
          {model.classes.map((cls, ci) => {
            const color = CLASS_COLORS[ci % CLASS_COLORS.length];
            return (
              <div key={cls}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  fontWeight: 700,
                  color: `var(${color})`,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 8,
                  paddingBottom: 4,
                  borderBottom: `1px solid var(--border)`,
                }}>{cls}</div>
                {topWords[ci].map(({ word, prob }) => (
                  <div key={word} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 5,
                    gap: 8,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--text-secondary)',
                    }}>{word}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <DotBar value={Math.min(1, prob * 8)} color={color} dots={6} />
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--text-muted)',
                        minWidth: 36,
                        textAlign: 'right',
                      }}>{(prob * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function LoadingCard({ domain }: { domain: string }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
      <motion.div
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em' }}
      >
        LOADING {domain.toUpperCase()} MODEL...
      </motion.div>
    </div>
  );
}

export function DomainsView() {
  const spam      = useModelLoader('spam');
  const news      = useModelLoader('news');
  const sentiment = useModelLoader('sentiment');

  const models = [
    { key: 'spam',      data: spam },
    { key: 'news',      data: news },
    { key: 'sentiment', data: sentiment },
  ];

  return (
    <>
      {/* Page header */}
      <div style={{ marginBottom: 4 }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          marginBottom: 4,
        }}>DOMAIN EXPLORER</div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
        }}>MODEL OVERVIEW</div>
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
          color: 'var(--text-muted)',
          marginTop: 6,
        }}>
          Pre-trained weights for all three classification domains. Each model uses Laplace-smoothed log-probabilities.
        </div>
      </div>

      {/* Stat summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 4 }}>
        {[
          { label: 'TOTAL DOMAINS',  value: '3', sub: 'SPAM · NEWS · SENTIMENT' },
          { label: 'TOTAL VOCAB',    value: '311', sub: '121 + 100 + 90 WORDS' },
          { label: 'TOTAL CLASSES',  value: '8', sub: '2 + 4 + 2 CLASSES' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card"
            style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Model cards */}
      {models.map(({ key, data }, i) =>
        data.loading ? (
          <LoadingCard key={key} domain={key} />
        ) : data.model ? (
          <ModelCard key={key} model={data.model} index={i} />
        ) : (
          <div key={key} className="card" style={{ color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            ERROR LOADING {key.toUpperCase()}: {data.error}
          </div>
        )
      )}
    </>
  );
}
