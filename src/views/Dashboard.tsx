import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { StatCard } from '../components/layout/StatCard';
import { TextInput } from '../components/classifier/TextInput';
import { ClassScore, DotBar } from '../components/classifier/ClassScore';
import { PriorPanel } from '../components/bayes/PriorPanel';
import { LikelihoodTable } from '../components/bayes/LikelihoodTable';
import { PosteriorDisplay } from '../components/bayes/PosteriorDisplay';
import { FormulaPanel } from '../components/bayes/FormulaPanel';
import { DomainToggle } from '../components/controls/DomainToggle';
import { VariantToggle } from '../components/controls/VariantToggle';
import { Badge } from '../components/controls/Badge';
import { useClassifier } from '../hooks/useClassifier';
import { tokenize } from '../engine/tokenizer';
import type { Domain } from '../engine';

const CARD_VARIANTS = {
  hidden:  { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.3 } }),
};

function classColor(label: string): 'active' | 'spam' | 'ham' | 'neutral' | 'positive' | 'negative' {
  const l = label.toLowerCase();
  if (l === 'spam')     return 'spam';
  if (l === 'ham')      return 'ham';
  if (l === 'positive') return 'positive';
  if (l === 'negative') return 'negative';
  return 'active';
}

export function Dashboard() {
  const [text, setText] = useState('');
  const [domain, setDomain] = useState<Domain>('spam');
  const [variant, setVariant] = useState<'multinomial' | 'bernoulli'>('multinomial');

  const { result, loading } = useClassifier({ text, domain, variant });

  const tokens = tokenize(text);
  const confidence = result
    ? `${(result.scores[result.predicted_class] * 100).toFixed(1)}%`
    : '—.—%';

  const topLabel = result?.predicted_label?.toUpperCase() ?? '—';
  const topBadge = result ? classColor(result.predicted_label) : 'neutral';

  return (
    <Layout activeDomain={domain}>
      {/* TOP ROW — 4 stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
      }}>
        {[
          <StatCard
            title="ACTIVE WORDS"
            value={result?.n_words_found ?? 0}
            unit="IN VOCAB"
            badge={{ label: loading ? 'LOADING' : 'LIVE', variant: 'active' }}
            arrow
          />,
          <StatCard
            title="TOP CLASS"
            value={topLabel}
            badge={{ label: result ? 'ACTIVE' : 'IDLE', variant: result ? topBadge : 'neutral' }}
            arrow
          />,
          <StatCard
            title="CONFIDENCE"
            value={confidence}
            unit="POST."
            badge={{ label: 'ACTIVE', variant: 'active' }}
            arrow
          />,
          <StatCard
            title="NB VARIANT"
            value={variant === 'multinomial' ? 'MNB' : 'BNB'}
            subtitle={variant === 'multinomial' ? 'WORD COUNTS' : 'BINARY'}
            badge={{ label: 'ACTIVE', variant: 'active' }}
          />,
        ].map((card, i) => (
          <motion.div key={i} custom={i} variants={CARD_VARIANTS} initial="hidden" animate="visible">
            {card}
          </motion.div>
        ))}
      </div>

      {/* MIDDLE ROW — 60/40 */}
      <div style={{ display: 'grid', gridTemplateColumns: '60fr 40fr', gap: 12 }}>

        {/* LEFT — classifier */}
        <motion.div
          key={domain}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="card"
        >
          <div className="panel-header">
            <span className="panel-header__title">NAIVE BAYES CLASSIFIER</span>
            <Badge label={domain.toUpperCase()} variant="active" />
          </div>

          <TextInput text={text} onChange={setText} domain={domain} result={result} />

          {result ? (
            <div style={{ marginTop: 8 }}>
              {result.classes.map((cls, i) => (
                <ClassScore key={cls} label={cls} score={result.scores[i]} index={i} />
              ))}
            </div>
          ) : (
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text-muted)',
              marginTop: 8,
            }}>
              {loading ? 'LOADING MODEL...' : 'TYPE TO CLASSIFY'}
            </div>
          )}
        </motion.div>

        {/* RIGHT — bayes chain */}
        <div className="card">
          <div className="panel-header">
            <span className="panel-header__title">BAYESIAN CHAIN</span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
              letterSpacing: '0.06em',
            }}>PRIOR → LIKELIHOOD → POST.</span>
          </div>

          <PriorPanel classes={result?.classes} priors={result?.prior_probs} />
          <div className="divider" />
          <LikelihoodTable result={result} currentText={text} />
          <div className="divider" />
          <PosteriorDisplay result={result} />
        </div>
      </div>

      {/* BOTTOM ROW — 3 equal columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>

        {/* Formula */}
        <div className="card">
          <div className="panel-header">
            <span className="panel-header__title">FORMULA</span>
            <Badge label="LIVE" variant="active" />
          </div>
          <FormulaPanel result={result} />
        </div>

        {/* Configuration */}
        <div className="card">
          <div className="panel-header">
            <span className="panel-header__title">CONFIGURATION</span>
            <Badge label={variant === 'multinomial' ? 'MNB' : 'BNB'} variant="active" />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}>DOMAIN</div>
            <DomainToggle value={domain} onChange={setDomain} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}>NB VARIANT</div>
            <VariantToggle value={variant} onChange={setVariant} />
          </div>

          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--border)',
            paddingTop: 10,
          }}>
            VOCABULARY MATCH:{' '}
            <span style={{ color: 'var(--accent)' }}>{result?.n_words_found ?? 0}</span>
            {' / '}
            <span style={{ color: 'var(--text-secondary)' }}>{tokens.length}</span>
            {' '}WORDS
          </div>
        </div>

        {/* Word Signals */}
        <div className="card">
          <div className="panel-header">
            <span className="panel-header__title">WORD SIGNALS</span>
            <Badge label="TOP 5" variant="neutral" />
          </div>

          {result && result.word_contributions.length > 0 ? (
            result.word_contributions.slice(0, 5).map(wc => (
              <div key={wc.word} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 8,
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: wc.direction === 'positive' ? 'var(--accent)' : wc.direction === 'negative' ? 'var(--danger)' : 'var(--text-muted)',
                  minWidth: 80,
                }}>{wc.word}</span>
                <DotBar
                  value={Math.min(1, wc.delta_score / 3)}
                  color={wc.direction === 'positive' ? '--accent' : wc.direction === 'negative' ? '--danger' : '--neutral'}
                  dots={10}
                />
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  minWidth: 40,
                  textAlign: 'right',
                }}>Δ{wc.delta_score.toFixed(2)}</span>
              </div>
            ))
          ) : (
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text-muted)',
              textAlign: 'center',
              padding: '12px 0',
            }}>— NO SIGNALS YET —</div>
          )}
        </div>
      </div>
    </Layout>
  );
}
