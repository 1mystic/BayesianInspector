import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../components/controls/Badge';
import { DotBar } from '../components/classifier/ClassScore';

function Section({ title, badge, children }: { title: string; badge?: string; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="panel-header">
        <span className="panel-header__title">{title}</span>
        {badge && <Badge label={badge} variant="active" />}
      </div>
      {children}
    </motion.div>
  );
}

function FormulaBlock({ children }: { children: ReactNode }) {
  return (
    <div style={{
      background: 'var(--bg-card-2)',
      border: '1px solid var(--border-light)',
      borderRadius: 6,
      padding: '14px 18px',
      fontFamily: 'var(--font-mono)',
      fontSize: 14,
      color: 'var(--accent)',
      letterSpacing: '0.04em',
      lineHeight: 2,
      marginBottom: 12,
    }}>
      {children}
    </div>
  );
}

function Explain({ children }: { children: ReactNode }) {
  return (
    <p style={{
      fontFamily: 'var(--font-ui)',
      fontSize: 13,
      color: 'var(--text-secondary)',
      lineHeight: 1.7,
      marginBottom: 10,
    }}>
      {children}
    </p>
  );
}

function Term({ label, color, desc }: { label: string; color: string; desc: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      marginBottom: 10,
      paddingBottom: 10,
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        fontWeight: 700,
        color,
        minWidth: 120,
        paddingTop: 1,
      }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 13,
        color: 'var(--text-muted)',
        lineHeight: 1.6,
      }}>{desc}</div>
    </div>
  );
}

// ── Interactive worked example ──
function WorkedExample() {
  const [text, setText] = useState('free win prize');

  // Hardcoded spam model subset for illustration
  const prior = { spam: -0.916, ham: -0.511 };
  const wordMap: Record<string, [number, number]> = {
    free:  [-1.20, -4.80],
    win:   [-1.35, -4.60],
    prize: [-1.45, -5.00],
    claim: [-1.50, -5.20],
    meeting: [-5.00, -2.10],
    please:  [-4.50, -2.00],
    thanks:  [-4.60, -2.05],
  };

  const tokens = text.toLowerCase().replace(/[^a-z\s]/g,' ').split(/\s+/).filter(t=>t.length>=2);
  const counts: Record<string, number> = {};
  tokens.forEach(t => { counts[t] = (counts[t] || 0) + 1; });

  let spamScore = prior.spam;
  let hamScore  = prior.ham;
  const steps: { word: string; count: number; spamLP: number; hamLP: number }[] = [];

  Object.entries(counts).forEach(([word, count]) => {
    if (wordMap[word]) {
      const [sp, hp] = wordMap[word];
      spamScore += sp * count;
      hamScore  += hp * count;
      steps.push({ word, count, spamLP: sp * count, hamLP: hp * count });
    }
  });

  const maxScore = Math.max(spamScore, hamScore);
  const expSpam = Math.exp(spamScore - maxScore);
  const expHam  = Math.exp(hamScore  - maxScore);
  const total   = expSpam + expHam;
  const pSpam   = expSpam / total;
  const pHam    = expHam  / total;

  return (
    <Section title="WORKED EXAMPLE" badge="INTERACTIVE">
      <Explain>
        Type words from the spam vocabulary to see the log-space calculation update live.
        Only recognized words are shown (try: free, win, prize, claim, meeting, please, thanks).
      </Explain>

      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type words..."
        style={{
          width: '100%',
          background: 'var(--bg-card-2)',
          border: '1px solid var(--border-light)',
          borderRadius: 6,
          padding: '10px 14px',
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          color: 'var(--text-primary)',
          outline: 'none',
          marginBottom: 16,
        }}
      />

      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--text-muted)',
        marginBottom: 8,
      }}>LOG-SCORE ACCUMULATION</div>

      <div style={{
        background: 'var(--bg-card-2)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        padding: '12px 14px',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        lineHeight: 1.9,
      }}>
        {/* Prior row */}
        <div style={{ display: 'flex', gap: 16, color: 'var(--text-muted)', paddingBottom: 6, marginBottom: 6, borderBottom: '1px solid var(--border)' }}>
          <span style={{ minWidth: 80 }}>PRIOR</span>
          <span style={{ color: 'var(--accent)', minWidth: 70 }}>{prior.spam.toFixed(3)}</span>
          <span style={{ color: 'var(--blue)',   minWidth: 70 }}>{prior.ham.toFixed(3)}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>log P(C)</span>
        </div>

        {/* Word contribution rows */}
        {steps.map(s => (
          <div key={s.word} style={{ display: 'flex', gap: 16, color: 'var(--text-secondary)' }}>
            <span style={{ minWidth: 80 }}>
              {s.word}{s.count > 1 ? <span style={{ color: 'var(--text-muted)' }}>×{s.count}</span> : ''}
            </span>
            <span style={{ color: 'var(--accent)', minWidth: 70 }}>+{s.spamLP.toFixed(3)}</span>
            <span style={{ color: 'var(--blue)',   minWidth: 70 }}>+{s.hamLP.toFixed(3)}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>log P(word|C) × count</span>
          </div>
        ))}

        {steps.length === 0 && (
          <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>— no known words typed —</div>
        )}

        {/* Totals */}
        <div style={{ display: 'flex', gap: 16, marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)', fontWeight: 700 }}>
          <span style={{ minWidth: 80, color: 'var(--text-muted)' }}>LOG SUM</span>
          <span style={{ color: 'var(--accent)', minWidth: 70 }}>{spamScore.toFixed(3)}</span>
          <span style={{ color: 'var(--blue)',   minWidth: 70 }}>{hamScore.toFixed(3)}</span>
        </div>

        {/* Posterior */}
        <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
          <span style={{ minWidth: 80, color: 'var(--text-muted)' }}>POSTERIOR</span>
          <span style={{ color: 'var(--accent)', minWidth: 70, fontWeight: 700 }}>{(pSpam * 100).toFixed(1)}%</span>
          <span style={{ color: 'var(--blue)',   minWidth: 70, fontWeight: 700 }}>{(pHam  * 100).toFixed(1)}%</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>via log-sum-exp softmax</span>
        </div>
      </div>

      {/* Posterior bars */}
      <div style={{ marginTop: 14 }}>
        {[{ label: 'SPAM', val: pSpam, color: '--accent' }, { label: 'HAM', val: pHam, color: '--blue' }].map(r => (
          <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: `var(${r.color})`, minWidth: 50 }}>{r.label}</span>
            <DotBar value={r.val} color={r.color} dots={20} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: `var(${r.color})`, fontWeight: 700, minWidth: 46 }}>{(r.val * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function FormulaView() {
  return (
    <>
      {/* Page header */}
      <div style={{ marginBottom: 4 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 4 }}>MATH REFERENCE</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>NAIVE BAYES FORMULA</div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
          Full derivation of the Multinomial and Bernoulli Naive Bayes classifiers.
        </div>
      </div>

      {/* Bayes Theorem */}
      <Section title="BAYES' THEOREM" badge="FOUNDATION">
        <FormulaBlock>
          P(C | X) = P(X | C) × P(C) / P(X)
        </FormulaBlock>
        <Term label="P(C | X)" color="var(--accent)"  desc="Posterior — probability of class C given the observed input X. This is what we want to compute." />
        <Term label="P(X | C)" color="var(--blue)"    desc="Likelihood — how probable is the input X if it came from class C? Computed from word frequencies." />
        <Term label="P(C)"     color="var(--neutral)"  desc="Prior — baseline probability of class C before seeing any input. Estimated from class frequencies in training data." />
        <Term label="P(X)"     color="var(--text-muted)" desc="Evidence — normalisation constant, same for all classes. We drop it and just compare unnormalised scores." />
        <Explain>
          Since P(X) is constant across classes, we compare <strong style={{ color: 'var(--accent)' }}>P(X|C) × P(C)</strong> directly
          (the proportionality ∝ symbol). The class with the highest product wins.
        </Explain>
      </Section>

      {/* Naive assumption */}
      <Section title="THE NAIVE ASSUMPTION" badge="KEY INSIGHT">
        <FormulaBlock>
          P(X | C) ≈ P(x₁|C) × P(x₂|C) × ... × P(xₙ|C) = ∏ P(xᵢ|C)
        </FormulaBlock>
        <Explain>
          "Naive" means we assume all words are <strong style={{ color: 'var(--accent)' }}>conditionally independent</strong> given
          the class. This is factually wrong (words co-occur), but dramatically simplifies the computation
          and works surprisingly well in practice.
        </Explain>
        <Explain>
          With this assumption, the joint likelihood of all words is just the <em>product</em> of individual word likelihoods.
          We estimate each P(word|class) from word counts in the training data with Laplace smoothing.
        </Explain>
      </Section>

      {/* Log space */}
      <Section title="LOG-SPACE COMPUTATION" badge="NUMERICAL STABILITY">
        <FormulaBlock>
          log P(C|X) ∝ log P(C) + Σ count(xᵢ) × log P(xᵢ|C)
        </FormulaBlock>
        <Explain>
          Computing many small probabilities multiplied together causes <strong style={{ color: 'var(--danger)' }}>floating-point underflow</strong> —
          the result rounds to exactly 0 before we can compare classes.
          Taking logs turns products into sums, which are numerically stable.
        </Explain>
        <div style={{
          background: 'var(--bg-card-2)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          padding: '12px 16px',
          marginBottom: 12,
        }}>
          {[
            { step: '1. Start with',   expr: 'log P(C)                    (class log-prior)' },
            { step: '2. For each word', expr: '+= count × log P(word|C)   (add log-likelihood)' },
            { step: '3. Normalise',     expr: 'softmax via log-sum-exp     (convert to probabilities)' },
          ].map(r => (
            <div key={r.step} style={{ display: 'flex', gap: 16, marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', minWidth: 120 }}>{r.step}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)' }}>{r.expr}</span>
            </div>
          ))}
        </div>
        <FormulaBlock>
          log-sum-exp: LSE(s) = max(s) + log Σ exp(sᵢ - max(s))
        </FormulaBlock>
        <Explain>
          The log-sum-exp trick subtracts the maximum score before exponentiating, keeping all values in a
          numerically safe range. This is how softmax is implemented in BayesInspector's inference engine.
        </Explain>
      </Section>

      {/* MNB vs BNB */}
      <Section title="MNB VS BNB" badge="VARIANTS">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 }}>
          {[
            {
              label: 'MULTINOMIAL NB',
              badge: 'MNB',
              color: 'var(--accent)',
              formula: 'log P(C|X) ∝ log P(C) + Σ count(xᵢ) × log P(xᵢ|C)',
              desc: 'Uses word counts. Repeating a strong spam word like "free free free" increases the spam score proportionally. More sensitive to word frequency.',
              when: 'Text classification, spam filtering, news categorisation.',
            },
            {
              label: 'BERNOULLI NB',
              badge: 'BNB',
              color: 'var(--blue)',
              formula: 'log P(C|X) ∝ log P(C) + Σ presence(xᵢ) × log P(xᵢ|C)',
              desc: 'Binary presence only — a word contributes its log-probability exactly once regardless of how many times it appears. Not affected by repetition.',
              when: 'Short texts, binary feature vectors, spam detection on short SMS.',
            },
          ].map(v => (
            <div key={v.label} style={{
              background: 'var(--bg-card-2)',
              border: `1px solid var(--border)`,
              borderRadius: 6,
              padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: v.color }}>{v.label}</span>
                <Badge label={v.badge} variant={v.badge === 'MNB' ? 'active' : 'ham'} />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: v.color, background: 'var(--bg)', padding: '8px 10px', borderRadius: 4, marginBottom: 10 }}>
                {v.formula}
              </div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 8 }}>{v.desc}</p>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                USE WHEN: <span style={{ color: 'var(--text-secondary)' }}>{v.when}</span>
              </div>
            </div>
          ))}
        </div>
        <Explain>
          Switch between variants using the NB VARIANT control on the CLASSIFIER page.
          You will see the posterior probabilities change, especially when a word is repeated.
        </Explain>
      </Section>

      {/* Laplace smoothing */}
      <Section title="LAPLACE SMOOTHING" badge="TRAINING">
        <FormulaBlock>
          P(word | C) = (count(word, C) + 1) / (count(C) + |V|)
        </FormulaBlock>
        <Term label="|V|"           color="var(--accent)"   desc="Vocabulary size. Dividing by this prevents any single word from dominating." />
        <Term label="count(word,C)" color="var(--blue)"     desc="Number of times word appeared in training documents of class C." />
        <Term label="+1 (add-one)"  color="var(--neutral)"  desc="Laplace add-one smoothing — ensures no word has zero probability, which would zero out the entire product." />
        <Explain>
          Without smoothing, any word not seen during training would give P(word|C) = 0,
          making the entire posterior 0 for that class. Laplace smoothing assigns a small
          non-zero probability to all unseen words.
          The weights in BayesInspector's JSON models are pre-computed with this smoothing applied.
        </Explain>
      </Section>

      {/* Worked interactive example */}
      <WorkedExample />
    </>
  );
}
