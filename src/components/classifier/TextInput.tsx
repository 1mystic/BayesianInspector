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

// Styles that MUST be pixel-identical on both textarea and highlight layer
const SHARED_TEXT: CSSProperties = {
  fontFamily: 'var(--font-ui)',
  fontSize: 15,
  lineHeight: '1.7',
  letterSpacing: 'normal',
  wordSpacing: 'normal',
  padding: '12px 14px',
  boxSizing: 'border-box',
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
  tabSize: 4,
  margin: 0,
  border: 'none',
  resize: 'none',
  outline: 'none',
};

export function TextInput({ text, onChange, domain, result }: TextInputProps) {
  const taRef        = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea and keep highlight layer height in sync
  useEffect(() => {
    const ta = taRef.current;
    const hl = highlightRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    const h = `${ta.scrollHeight}px`;
    ta.style.height = h;
    if (hl) hl.style.minHeight = h;
  }, [text]);

  // Sync scroll position so highlighted text tracks textarea scroll exactly
  function syncScroll() {
    const ta = taRef.current;
    const hl = highlightRef.current;
    if (!ta || !hl) return;
    hl.scrollTop  = ta.scrollTop;
    hl.scrollLeft = ta.scrollLeft;
  }

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
    <div style={{
      position: 'relative',
      marginBottom: 16,
      background: 'var(--bg-card-2)',
      border: '1px solid var(--border-light)',
      borderRadius: 6,
      overflow: 'hidden',
      minHeight: 120,
    }}>
      {/*
        Highlight layer — sits BELOW the transparent textarea.
        overflow:hidden + scrollTop sync means it always mirrors the textarea's viewport.
      */}
      <div
        ref={highlightRef}
        aria-hidden="true"
        style={{
          ...SHARED_TEXT,
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          overflow: 'hidden',
          background: 'transparent',
          color: 'var(--text-primary)',
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

      {/*
        Textarea — on top, transparent text so the highlight layer shows through.
        caret-color keeps the cursor visible.
        overflow:auto allows natural scrolling which we mirror to the highlight layer.
      */}
      <textarea
        ref={taRef}
        value={text}
        onChange={e => onChange(e.target.value)}
        onScroll={syncScroll}
        placeholder={PLACEHOLDERS[domain]}
        spellCheck={false}
        style={{
          ...SHARED_TEXT,
          position: 'relative',
          zIndex: 2,
          display: 'block',
          width: '100%',
          minHeight: 120,
          background: 'transparent',
          color: 'transparent',
          caretColor: 'var(--text-primary)',
          overflow: 'hidden',
        }}
      />
    </div>
  );
}
