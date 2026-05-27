import { useRef, useEffect, type CSSProperties } from 'react';
import type { ClassificationResult } from '../../engine/types';
import { tokenize } from '../../engine/tokenizer';
import { WordToken } from './WordToken';
import type { Domain } from '../../engine';

interface TextInputProps {
  text: string;
  onChange: (t: string) => void;
  domain: Domain;
  result: ClassificationResult | null;
}

const PLACEHOLDERS: Record<Domain, string> = {
  spam:      'Type an email or SMS message...',
  news:      'Paste a news headline or article excerpt...',
  sentiment: 'Write a movie review or product feedback...',
};

const SHARED: CSSProperties = {
  fontFamily: 'var(--font-ui)',
  fontSize: 15,
  lineHeight: 1.7,
  padding: '12px 14px',
  width: '100%',
  minHeight: 120,
  boxSizing: 'border-box',
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
  margin: 0,
};

export function TextInput({ text, onChange, domain, result }: TextInputProps) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  }, [text]);

  const contribMap = new Map(
    result?.word_contributions.map(wc => [wc.word, wc]) ?? []
  );
  const vocabSet = new Set(result?.word_contributions.map(wc => wc.word) ?? []);

  const parts: { token: string; isWord: boolean }[] = [];
  const regex = /(\S+)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ token: text.slice(lastIndex, match.index), isWord: false });
    }
    parts.push({ token: match[1], isWord: true });
    lastIndex = match.index + match[1].length;
  }
  if (lastIndex < text.length) {
    parts.push({ token: text.slice(lastIndex), isWord: false });
  }

  return (
    <div style={{ position: 'relative', marginBottom: 16 }}>
      {/* Outer box provides background + border */}
      <div style={{
        position: 'relative',
        background: 'var(--bg-card-2)',
        border: '1px solid var(--border-light)',
        borderRadius: 6,
        overflow: 'hidden',
      }}>
        {/* Highlight layer — sits behind the transparent textarea */}
        <div
          aria-hidden="true"
          style={{
            ...SHARED,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            pointerEvents: 'none',
            zIndex: 1,
            // No color: transparent here — WordTokens render their own colors
          }}
        >
          {parts.map((p, i) => {
            if (!p.isWord) return <span key={i} style={{ color: 'var(--text-primary)' }}>{p.token}</span>;
            const lower = tokenize(p.token)[0] ?? p.token.toLowerCase();
            const inVocab = vocabSet.has(lower);
            const contrib = contribMap.get(lower);
            return (
              <WordToken
                key={i}
                word={p.token}
                contribution={contrib}
                classes={result?.classes}
                isInVocab={inVocab}
              />
            );
          })}
        </div>

        {/* Textarea — transparent text+bg so highlight layer shows through */}
        <textarea
          ref={taRef}
          value={text}
          onChange={e => onChange(e.target.value)}
          placeholder={PLACEHOLDERS[domain]}
          spellCheck={false}
          style={{
            ...SHARED,
            position: 'relative',
            zIndex: 2,
            display: 'block',
            background: 'transparent',
            border: 'none',
            color: 'transparent',
            caretColor: 'var(--text-primary)',
            resize: 'none',
            outline: 'none',
            overflow: 'hidden',
          }}
        />
      </div>
    </div>
  );
}
