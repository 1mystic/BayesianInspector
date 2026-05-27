import { DotBar } from '../classifier/ClassScore';
import type { ClassificationResult } from '../../engine/types';
import { tokenize } from '../../engine/tokenizer';

interface LikelihoodTableProps {
  result: ClassificationResult | null;
  currentText: string;
}

const CLASS_COLORS = ['--accent', '--blue', '--danger', '--neutral'];

export function LikelihoodTable({ result, currentText }: LikelihoodTableProps) {
  if (!result) {
    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}>TOP WORD LIKELIHOODS</div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-muted)',
          textAlign: 'center',
          padding: '12px 0',
        }}>— START TYPING —</div>
      </div>
    );
  }

  const inputWords = new Set(tokenize(currentText));
  const nCols = Math.min(result.classes.length, 2);

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.1em',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        marginBottom: 10,
      }}>TOP WORD LIKELIHOODS</div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${nCols}, 1fr)`, gap: 12 }}>
        {result.classes.slice(0, nCols).map((cls, ci) => {
          const color = CLASS_COLORS[ci % CLASS_COLORS.length];
          return (
            <div key={cls}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 700,
                color: `var(${color})`,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 6,
                borderBottom: '1px solid var(--border)',
                paddingBottom: 4,
              }}>{cls}</div>

              {result.top_words_per_class[ci].map(({ word, prob }) => {
                const isActive = inputWords.has(word);
                const barVal = Math.min(1, prob * 10);
                return (
                  <div key={word} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 4,
                    opacity: isActive ? 1 : 0.5,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: isActive ? `var(${color})` : 'var(--text-muted)',
                      minWidth: 60,
                    }}>{word}</span>
                    <DotBar value={barVal} color={color} dots={8} />
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--text-muted)',
                      minWidth: 36,
                      textAlign: 'right',
                    }}>{(prob * 100).toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
