import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../components/controls/Badge';

function Section({ title, delay = 0, children }: { title: string; delay?: number; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="card"
    >
      <div className="panel-header">
        <span className="panel-header__title">{title}</span>
      </div>
      {children}
    </motion.div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--text-muted)',
        letterSpacing: '0.06em',
      }}>{label}</span>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 700,
        color: accent ? 'var(--accent)' : 'var(--text-secondary)',
      }}>{value}</span>
    </div>
  );
}

function StackItem({ name, version, role }: { name: string; version: string; role: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--text-primary)',
        }}>{name}</div>
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 12,
          color: 'var(--text-muted)',
          marginTop: 2,
        }}>{role}</div>
      </div>
      <span className="badge badge--neutral">{version}</span>
    </div>
  );
}

function PipelineStep({ step, label, desc }: { step: string; label: string; desc: string }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 18,
        fontWeight: 700,
        color: 'var(--accent)',
        minWidth: 32,
        paddingTop: 2,
      }}>{step}</div>
      <div style={{
        flex: 1,
        paddingBottom: 16,
        marginBottom: 4,
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 4,
          letterSpacing: '0.04em',
        }}>{label}</div>
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
          color: 'var(--text-muted)',
          lineHeight: 1.6,
        }}>{desc}</div>
      </div>
    </div>
  );
}

export function AboutView() {
  return (
    <>
      {/* Page header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 4 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 4 }}>PROJECT INFO</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.02em' }}>BI</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>BayesInspector</span>
          <Badge label="v1.0.0" variant="neutral" />
        </div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 600 }}>
          A live probabilistic text classifier that makes the Naive Bayes decision process transparent.
          Every word's contribution to the final classification is visible, explained, and animated.
          Zero backend. Inference runs entirely client-side in TypeScript.
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'start' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Architecture pipeline */}
          <Section title="HOW IT WORKS" delay={0.05}>
            <PipelineStep
              step="01"
              label="USER TYPES TEXT"
              desc="Input is debounced 300ms then tokenized — lowercased, leetspeak-normalized, punctuation stripped, and negations are marked."
            />
            <PipelineStep
              step="02"
              label="VOCABULARY LOOKUP"
              desc="Each token is looked up in the model's vocabulary index (O(1) HashMap). Unknown words are skipped."
            />
            <PipelineStep
              step="03"
              label="LOG-SCORE ACCUMULATION"
              desc="Starting from log P(C), each matched word adds count × log P(word|C) to the running score for each class."
            />
            <PipelineStep
              step="04"
              label="LOG-SUM-EXP SOFTMAX"
              desc="Raw log-scores are normalised to probabilities using the numerically stable log-sum-exp trick."
            />
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--accent)', minWidth: 32, paddingTop: 2 }}>05</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, letterSpacing: '0.04em' }}>VISUALISATION</div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Word contributions, posteriors, and the full formula are rendered with Framer Motion animations showing exactly how each word shifted the result.
                </div>
              </div>
            </div>
          </Section>

          {/* Model stats */}
          <Section title="MODEL STATISTICS" delay={0.1}>
            <Row label="SPAM MODEL — VOCAB"     value="131 words" />
            <Row label="SPAM MODEL — CLASSES"   value="spam, ham" />
            <Row label="SPAM MODEL — PRIORS"    value="40% / 60%" />
            <Row label="NEWS MODEL — VOCAB"     value="125 words" />
            <Row label="NEWS MODEL — CLASSES"   value="tech, sports, politics, entertainment, health" />
            <Row label="NEWS MODEL — PRIORS"    value="20% each (equal)" />
            <Row label="SENTIMENT — VOCAB"      value="105 words" />
            <Row label="SENTIMENT — CLASSES"    value="positive, negative" />
            <Row label="SENTIMENT — PRIORS"     value="50% / 50% (equal)" accent />
          </Section>

          {/* Design system */}
          <Section title="DESIGN SYSTEM" delay={0.15}>
            <Row label="AESTHETIC"   value="Dark-mode PACEOS terminal" />
            <Row label="NUMBERS"     value="Space Mono (monospace)" />
            <Row label="UI TEXT"     value="DM Sans (sans-serif)" />
            <Row label="BARS"        value="Dot-matrix (4×4px dots)" />
            <Row label="ANIMATIONS"  value="Framer Motion, 150–600ms" />
            <Row label="COLORS"      value="5 semantic CSS vars" accent />
          </Section>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Stack */}
          <Section title="TECH STACK" delay={0.05}>
            <StackItem name="React"           version="18.3"  role="UI component framework" />
            <StackItem name="TypeScript"      version="5.5"   role="Type safety, strict mode" />
            <StackItem name="Vite"            version="5.4"   role="Build tool and dev server" />
            <StackItem name="Framer Motion"   version="11.0"  role="Animations and transitions" />
            <StackItem name="clsx"            version="2.1"   role="Conditional class utility" />
            <StackItem name="Tailwind CSS"    version="3.4"   role="Base CSS utilities (minimal)" />
            <StackItem name="No ML library"   version="—"     role="Pure TypeScript inference engine" />
          </Section>

          {/* Data sources */}
          <Section title="DATA SOURCES" delay={0.1}>
            <div style={{ marginBottom: 14 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
              }}>
                <Badge label="SPAM" variant="spam" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>
                  UCI SMS Spam Collection
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                5,574 SMS messages labelled spam or ham. Weights derived from word frequency analysis.
                40% spam / 60% ham prior reflects real dataset class distribution.
              </p>
            </div>
            <div style={{ marginBottom: 14, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Badge label="NEWS" variant="active" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>
                  20 Newsgroups Dataset
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                18,846 newsgroup posts across 20 categories. BayesInspector uses a 4-category subset:
                tech, sports, politics, entertainment, health. Equal 20% priors.
              </p>
            </div>
            <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Badge label="SENTIMENT" variant="ham" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>
                  IMDB Mini Sentiment Dataset
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                50,000 movie reviews from IMDB labelled positive or negative.
                Weights derived from sentiment-bearing word frequencies.
              </p>
            </div>
          </Section>

          {/* Key properties */}
          <Section title="KEY PROPERTIES" delay={0.15}>
            <Row label="INFERENCE LOCATION"  value="100% client-side" accent />
            <Row label="INFERENCE LATENCY"   value="< 1ms per keystroke" accent />
            <Row label="MODEL FORMAT"        value="Pre-baked JSON weights" />
            <Row label="RUNTIME ML LIBS"     value="ZERO — pure TypeScript" />
            <Row label="TOTAL BUNDLE"        value="~90KB gzipped" />
            <Row label="MODEL DATA"          value="~10KB gzipped (all 3)" />
            <Row label="DEPLOYMENT"          value="Cloudflare Pages static site" />
          </Section>
        </div>
      </div>
    </>
  );
}
