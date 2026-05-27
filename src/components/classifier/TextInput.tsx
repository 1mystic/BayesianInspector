import React, { useRef, useEffect } from 'react';
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

const SHARED_STYLE: React.CSSProperties = {
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
};

export function TextInput({ text, onChange, domain, result }: TextInputProps) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  }, [text]);

  // Build a word→contribution map from result
  const contribMap = new Map(
    result?.word_contributions.map(wc => [wc.word, wc]) ?? []
  );
  const vocabSet = new Set(result?.word_contributions.map(wc => wc.word) ?? []);

  // Split text into tokens preserving whitespace
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
      {/* Highlight layer — rendered beneath textarea text */}
      <div
        aria-hidden="true"
        style={{
          ...SHARED_STYLE,
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          background: 'transparent',
          zIndex: 1,
          color: 'transparent',
        }}
      >
        {parts.map((p, i) => {
          if (!p.isWord) return <span key={i}>{p.token}</span>;
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

      {/* Actual textarea */}
      <textarea
        ref={taRef}
        value={text}
        onChange={e => onChange(e.target.value)}
        placeholder={PLACEHOLDERS[domain]}
        spellCheck={false}
        style={{
          ...SHARED_STYLE,
          position: 'relative',
          zIndex: 2,
          display: 'block',
          background: 'var(--bg-card-2)',
          border: '1px solid var(--border-light)',
          borderRadius: 6,
          color: 'transparent',
          caretColor: 'var(--text-primary)',
          resize: 'none',
          outline: 'none',
          overflow: 'hidden',
        }}
      />

      {/* Visible text layer on top of highlight */}
      <div
        style={{
          ...SHARED_STYLE,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 3,
          pointerEvents: 'none',
          color: 'transparent',
        }}
      />
    </div>
  );
}
