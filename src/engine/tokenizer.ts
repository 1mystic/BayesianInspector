const L33T_MAP: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '2': 'z',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '6': 'g',
  '7': 't',
  '8': 'b',
  '9': 'g',
  '@': 'a',
  '$': 's',
  '!': 'i',
  '+': 't',
  '|': 'i',
};

const NEGATORS = new Set(['not', 'no', 'never', 'without', 'hardly', 'scarcely']);

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/n['’]t\b/g, ' not')
    .replace(/[013456789@+$!|]/g, char => L33T_MAP[char] ?? char)
    .replace(/['’]/g, '');
}

export function tokenize(text: string): string[] {
  const tokens = normalizeText(text)
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 2);

  const output: string[] = [];
  let negationWindow = 0;

  for (const token of tokens) {
    if (NEGATORS.has(token)) {
      output.push(token);
      negationWindow = 3;
      continue;
    }

    output.push(negationWindow > 0 ? `not_${token}` : token);
    if (negationWindow > 0) negationWindow--;
  }

  return output;
}

export function countTokens(tokens: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const t of tokens) {
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return counts;
}
