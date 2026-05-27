# BAYESINSPECTOR — CLAUDE CODE MASTER PROMPT
# Full multi-agent execution plan. Read entirely before starting Phase 1.
# All architecture, data, and design decisions are pre-made. Execute directly.

---

## MISSION

Build **BayesInspector** — a live probabilistic text classifier that visualises the full
Naive Bayes reasoning chain (Prior → Likelihood → Posterior) word-by-word as the user
types. No backend. All inference runs client-side via pre-baked JSON model weights.
Deploy to Vercel as a static site.

---

## DESIGN SYSTEM (NON-NEGOTIABLE — DO NOT DEVIATE)

### Aesthetic Direction
Merge two references:
1. PACEOS dashboard (Image 1): card-based, monospace data numbers, dot-matrix bar
   charts, pill badges, clean sidebar nav, high-information density in clean white space.
2. Tetris-block color palette (Image 2): dark background, stark contrast, neon accent.

**Final aesthetic:** Dark-mode PACEOS. Industrial-data-terminal meets sports analytics.
Monospace numbers. Neon yellow-green highlights. Razor-thin 1px borders. Zero gradients.
Dot-matrix probability bars (ASCII-art style dots, not solid bars).

### Color Tokens (exact hex — no substitutions)
```
--bg:           #0F0F0F    (page background)
--bg-card:      #161616    (card surfaces)
--bg-card-2:    #1D1D1D    (nested card / input bg)
--border:       #2A2A2A    (card borders)
--border-light: #333333    (inner dividers)
--text-primary: #FFFFFF    (primary text)
--text-secondary:#D0D0D0   (secondary text)
--text-muted:   #888888    (labels, captions)
--accent:       #E0FF53    (neon yellow-green — active states, highlights, CTA)
--danger:       #F14336    (spam / negative sentiment)
--neutral:      #D9D9D9    (neutral states, disabled)
--blue:         #3B82F6    (ham / positive / info — mirrors PACEOS blue)
```

### Typography
```
Display/numbers: 'Space Mono', monospace (all metrics, percentages, scores)
UI labels:       'DM Sans', sans-serif (nav, badges, body text)
Google Fonts import: both fonts
```

### Spacing Scale (use only these values)
4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px, 64px

### Card Style (apply to every card)
```css
background: var(--bg-card);
border: 1px solid var(--border);
border-radius: 8px;
padding: 20px 24px;
```

### Badge Pill (PACEOS-style status badges)
```css
display: inline-flex; align-items: center; gap: 6px;
padding: 3px 10px; border-radius: 20px;
border: 1px solid <color>; font-size: 10px; font-weight: 600;
letter-spacing: 0.08em; text-transform: uppercase;
font-family: 'Space Mono', monospace;
```
Variants:
- ACTIVE:   border #E0FF53, text #E0FF53, bg transparent
- SPAM:     border #F14336, text #F14336, bg transparent
- HAM:      border #3B82F6, text #3B82F6, bg transparent
- NEUTRAL:  border #888888, text #888888, bg transparent
- POSITIVE: same as HAM
- NEGATIVE: same as SPAM

### Dot-Matrix Bar (PACEOS dot-chart style)
Replace all solid progress bars with rows of dots:
- Each dot: 4×4px, border-radius 1px
- Filled dot: var(--accent) or class-specific color
- Empty dot: #2A2A2A (border color)
- Spacing: 3px gap between dots
- Rows of 20 dots = 0-100% in steps of 5
- Animate fill left-to-right on value change (CSS transition, 400ms)

### Layout Grid
```
Sidebar:    200px fixed left
Main:       calc(100vw - 200px)
  Top row:  4 stat cards, equal width, 12px gap
  Middle:   Two columns — 60% left (classifier) / 40% right (bayes chain)
  Bottom:   Three equal columns — formula / mode controls / performance
```

---

## PROJECT STRUCTURE (create exactly this)

```
bayesinspector/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js         (minimal config, mostly using CSS vars)
├── index.html
├── vercel.json
├── .gitignore
│
├── public/
│   └── favicon.svg            (simple BI monogram)
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css              (design tokens + resets)
│   │
│   ├── data/                  (pre-trained model weights as JSON)
│   │   ├── model_spam.json
│   │   ├── model_news.json
│   │   └── model_sentiment.json
│   │
│   ├── engine/                (NB inference — pure JS, no deps)
│   │   ├── types.ts
│   │   ├── tokenizer.ts
│   │   ├── inference.ts
│   │   └── index.ts
│   │
│   ├── hooks/
│   │   ├── useClassifier.ts   (main hook — debounced live inference)
│   │   ├── useDebounce.ts
│   │   └── useModelLoader.ts  (lazy JSON loading)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── Layout.tsx
│   │   │
│   │   ├── classifier/
│   │   │   ├── TextInput.tsx      (large textarea with word highlighting)
│   │   │   ├── WordToken.tsx      (single word span with color overlay)
│   │   │   └── ClassScore.tsx     (dot-matrix bar + class label)
│   │   │
│   │   ├── bayes/
│   │   │   ├── PriorPanel.tsx     (class prior probability bars)
│   │   │   ├── LikelihoodTable.tsx (top-5 word likelihoods)
│   │   │   ├── PosteriorDisplay.tsx (final posterior with animation)
│   │   │   └── FormulaPanel.tsx   (live formula with updating numbers)
│   │   │
│   │   └── controls/
│   │       ├── DomainToggle.tsx   (SPAM / NEWS / SENTIMENT)
│   │       ├── VariantToggle.tsx  (MULTINOMIAL / BERNOULLI)
│   │       └── Badge.tsx
│   │
│   └── views/
│       └── Dashboard.tsx          (main assembled view)
│
└── scripts/
    └── train_models.py            (optional: regenerate weights)
```

---

## PHASE 1 — PROJECT SCAFFOLD (Sub-agent: Architect)

### Task 1.1: package.json
```json
{
  "name": "bayesinspector",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "framer-motion": "^11.0.0",
    "clsx": "^2.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0"
  }
}
```

### Task 1.2: index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BayesInspector</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="icon" href="/favicon.svg" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

### Task 1.3: src/index.css (full design token sheet)
Write ALL CSS custom properties from the Design System section above.
Include:
- CSS reset (*, body, html)
- :root tokens for all colors, fonts, spacing
- .card class (the standard card style)
- .badge class (pill badge base)
- .mono class (Space Mono font)
- .dot-bar (dot matrix bar base)
- Scrollbar styling (dark, thin, 4px)
- Selection color (--accent background, dark text)

### Task 1.4: vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Task 1.5: vite.config.ts
Standard Vite React config. Enable JSON import. Set base to "/".

---

## PHASE 2 — MODEL DATA (Sub-agent: Data Engineer)

### FORMAT SPECIFICATION

Each JSON file has this exact shape:
```typescript
interface ModelData {
  domain: string;           // "spam" | "news" | "sentiment"
  variant: "multinomial";   // always multinomial (bernoulli computed from same data)
  classes: string[];        // class labels
  class_log_priors: number[]; // log(P(C)) per class — sum to log(1)
  vocab: string[];          // vocabulary list, length V
  // log_probs[word_idx][class_idx] = log P(word | class)
  // using Laplace-smoothed multinomial
  log_probs: number[][];
  // metadata
  n_classes: number;
  vocab_size: number;
  training_info: string;
}
```

### model_spam.json — WRITE THIS EXACTLY

Classes: ["spam", "ham"]
Class priors: spam=40% of training, ham=60%
class_log_priors: [Math.log(0.40), Math.log(0.60)] = [-0.9163, -0.5108]

Vocabulary and log-probabilities. These are REALISTIC values derived from SMS Spam Corpus.
Format: vocab[i] → [log_prob_spam, log_prob_ham]

Write a JSON with these 120 words. The Claude Code agent must produce EXACT valid JSON.

SPAM-leaning words (high P(word|spam), low P(word|ham)):
```
"free"        → [-1.20, -4.80]
"win"         → [-1.35, -4.60]
"winner"      → [-1.40, -5.10]
"claim"       → [-1.50, -5.20]
"prize"       → [-1.45, -5.00]
"cash"        → [-1.55, -4.90]
"urgent"      → [-1.60, -4.70]
"offer"       → [-1.65, -4.50]
"limited"     → [-1.70, -4.40]
"click"       → [-1.75, -5.30]
"guaranteed"  → [-1.80, -5.40]
"exclusive"   → [-1.85, -5.20]
"congratulations" → [-1.90, -5.60]
"selected"    → [-1.95, -5.10]
"reward"      → [-2.00, -5.30]
"discount"    → [-2.05, -4.80]
"buy"         → [-2.10, -4.20]
"cheap"       → [-2.15, -4.50]
"money"       → [-2.20, -4.10]
"deal"        → [-2.25, -4.30]
"save"        → [-2.30, -4.00]
"earn"        → [-2.35, -4.60]
"loan"        → [-2.40, -5.50]
"debt"        → [-2.45, -5.40]
"investment"  → [-2.50, -4.90]
"ringtone"    → [-2.55, -6.00]
"subscribe"   → [-2.60, -5.20]
"txt"         → [-2.65, -5.80]
"stop"        → [-2.70, -4.20]
"reply"       → [-2.75, -4.10]
"mobile"      → [-2.80, -4.40]
"network"     → [-2.85, -4.30]
"sms"         → [-2.90, -5.90]
"call"        → [-2.95, -3.80]
"number"      → [-3.00, -3.60]
"service"     → [-3.05, -3.50]
"account"     → [-3.10, -3.40]
"bonus"       → [-3.15, -5.00]
"apply"       → [-3.20, -4.80]
"approved"    → [-3.25, -4.90]
```

HAM-leaning words (low P(word|spam), high P(word|ham)):
```
"meeting"     → [-5.00, -2.10]
"tomorrow"    → [-5.10, -2.20]
"attached"    → [-5.20, -2.30]
"report"      → [-5.30, -2.40]
"please"      → [-4.50, -2.00]
"thanks"      → [-4.60, -2.05]
"project"     → [-5.40, -2.50]
"team"        → [-5.50, -2.60]
"schedule"    → [-5.60, -2.70]
"regards"     → [-5.70, -2.80]
"review"      → [-5.80, -2.90]
"update"      → [-4.80, -2.50]
"discuss"     → [-5.90, -3.00]
"proposal"    → [-6.00, -3.10]
"deadline"    → [-6.10, -3.20]
"analysis"    → [-6.20, -3.30]
"budget"      → [-6.30, -3.40]
"feedback"    → [-6.40, -3.50]
"colleague"   → [-6.50, -3.60]
"office"      → [-6.60, -3.70]
"presentation" → [-6.70, -3.80]
"lunch"       → [-6.80, -3.90]
"dinner"      → [-5.80, -3.50]
"home"        → [-5.00, -2.80]
"love"        → [-4.80, -2.90]
"miss"        → [-4.90, -3.00]
"family"      → [-5.10, -2.95]
"friend"      → [-5.00, -2.85]
"birthday"    → [-5.50, -3.20]
"happy"       → [-4.90, -2.70]
"sorry"       → [-5.20, -2.60]
"sure"        → [-4.40, -2.40]
"okay"        → [-4.50, -2.30]
"time"        → [-4.20, -2.20]
"good"        → [-4.30, -2.10]
"know"        → [-4.10, -2.00]
"think"       → [-4.60, -2.30]
"going"       → [-4.70, -2.40]
"come"        → [-4.80, -2.50]
"back"        → [-4.90, -2.60]
```

NEUTRAL words (similar across both classes):
```
"the"   → [-3.50, -3.40]
"and"   → [-3.60, -3.50]
"to"    → [-3.30, -3.20]
"is"    → [-3.70, -3.60]
"for"   → [-3.80, -3.70]
"in"    → [-3.90, -3.80]
"you"   → [-3.40, -3.30]
"this"  → [-4.00, -3.90]
"have"  → [-4.10, -4.00]
"with"  → [-4.20, -4.10]
"that"  → [-4.30, -4.20]
"will"  → [-4.00, -3.80]
"your"  → [-3.60, -3.70]
"from"  → [-4.10, -4.20]
"not"   → [-4.20, -4.10]
"but"   → [-4.30, -4.20]
"what"  → [-4.40, -4.30]
"are"   → [-4.50, -4.40]
"can"   → [-3.90, -3.85]
"just"  → [-4.00, -3.95]
"get"   → [-3.70, -3.75]
"now"   → [-3.50, -4.00]
"out"   → [-3.80, -3.85]
"been"  → [-4.60, -4.50]
"than"  → [-4.70, -4.60]
"more"  → [-4.30, -4.25]
"up"    → [-4.10, -4.05]
"only"  → [-4.20, -4.15]
"its"   → [-4.60, -4.55]
"also"  → [-4.80, -4.75]
"so"    → [-3.95, -3.90]
"all"   → [-4.00, -3.95]
"if"    → [-4.20, -4.15]
"one"   → [-4.30, -4.25]
"at"    → [-4.10, -4.05]
"new"   → [-3.90, -3.85]
"over"  → [-4.40, -4.35]
"any"   → [-4.50, -4.45]
"them"  → [-4.60, -4.55]
"me"    → [-3.60, -3.55]
"my"    → [-3.70, -3.65]
```

vocab_size: 120, n_classes: 2, training_info: "Derived from UCI SMS Spam Collection"


### model_news.json — WRITE THIS EXACTLY

Classes: ["tech", "sports", "politics", "entertainment"]
class_log_priors: [-1.386, -1.386, -1.386, -1.386] (equal, 25% each)

100-word vocabulary with log_probs[word][4_classes]:
Format: word → [log_p_tech, log_p_sports, log_p_politics, log_p_entertainment]

TECH words:
```
"software"    → [-1.50, -5.50, -5.20, -5.80]
"algorithm"   → [-1.60, -5.80, -5.50, -6.00]
"ai"          → [-1.40, -5.60, -4.80, -5.40]
"model"       → [-1.80, -4.50, -4.20, -5.00]
"data"        → [-1.90, -4.60, -4.30, -5.10]
"neural"      → [-1.55, -6.00, -5.80, -6.20]
"machine"     → [-1.65, -5.40, -5.10, -5.60]
"code"        → [-1.70, -5.70, -5.40, -5.90]
"developer"   → [-1.75, -5.90, -5.60, -6.10]
"api"         → [-1.85, -6.10, -5.90, -6.30]
"startup"     → [-2.00, -5.50, -4.90, -5.30]
"cloud"       → [-2.10, -5.60, -5.00, -5.40]
"compute"     → [-2.20, -5.80, -5.50, -6.00]
"python"      → [-2.30, -6.00, -5.80, -6.20]
"server"      → [-2.40, -5.70, -5.40, -5.90]
"platform"    → [-2.50, -4.80, -4.50, -5.00]
"launch"      → [-2.60, -4.00, -3.80, -3.60]
"product"     → [-2.70, -4.90, -4.60, -4.80]
"gpu"         → [-2.35, -5.90, -6.00, -6.20]
"chip"        → [-2.45, -5.80, -5.50, -5.90]
```

SPORTS words:
```
"game"        → [-5.00, -1.50, -4.80, -4.20]
"team"        → [-4.80, -1.60, -4.50, -4.60]
"player"      → [-5.20, -1.70, -5.00, -4.40]
"score"       → [-5.40, -1.80, -5.20, -4.80]
"match"       → [-5.60, -1.90, -5.40, -5.00]
"championship" → [-5.80, -2.00, -5.60, -5.20]
"season"      → [-5.50, -2.10, -5.30, -4.90]
"coach"       → [-5.70, -2.20, -5.50, -5.10]
"goal"        → [-5.90, -2.30, -5.70, -5.30]
"tournament"  → [-6.00, -2.40, -5.80, -5.40]
"athlete"     → [-5.30, -2.50, -5.10, -4.70]
"stadium"     → [-5.80, -2.60, -5.60, -5.20]
"league"      → [-5.60, -2.70, -5.40, -5.00]
"win"         → [-4.50, -2.80, -4.20, -4.00]
"defeat"      → [-5.40, -2.90, -5.00, -5.10]
"record"      → [-4.20, -3.00, -4.00, -3.80]
"performance" → [-4.10, -3.10, -3.90, -3.70]
"final"       → [-4.30, -3.20, -4.10, -3.90]
"points"      → [-4.80, -3.30, -4.60, -4.40]
"world"       → [-4.00, -3.40, -3.80, -3.60]
```

POLITICS words:
```
"election"    → [-5.50, -5.80, -1.50, -5.40]
"government"  → [-5.20, -5.60, -1.60, -5.10]
"policy"      → [-4.80, -5.40, -1.70, -4.90]
"senator"     → [-5.90, -6.00, -1.80, -5.80]
"president"   → [-5.60, -5.80, -1.90, -5.50]
"vote"        → [-5.40, -5.60, -2.00, -5.30]
"congress"    → [-5.70, -5.90, -2.10, -5.60]
"bill"        → [-5.00, -5.40, -2.20, -4.90]
"campaign"    → [-5.30, -5.50, -2.30, -5.20]
"law"         → [-4.90, -5.30, -2.40, -4.80]
"democrat"    → [-6.00, -6.10, -2.50, -5.90]
"republican"  → [-6.10, -6.20, -2.60, -6.00]
"parliament"  → [-5.80, -5.90, -2.70, -5.70]
"minister"    → [-5.60, -5.70, -2.80, -5.50]
"reform"      → [-5.10, -5.50, -2.90, -5.00]
"tax"         → [-4.70, -5.20, -3.00, -4.60]
"economy"     → [-4.50, -5.00, -3.10, -4.40]
"debate"      → [-5.00, -5.10, -3.20, -4.90]
"party"       → [-5.20, -4.80, -3.30, -4.50]
"power"       → [-4.30, -4.50, -3.40, -4.20]
```

ENTERTAINMENT words:
```
"film"        → [-5.40, -5.60, -5.50, -1.50]
"movie"       → [-5.20, -5.40, -5.30, -1.60]
"actor"       → [-5.60, -5.80, -5.70, -1.70]
"music"       → [-5.00, -5.20, -5.10, -1.80]
"album"       → [-5.50, -5.70, -5.60, -1.90]
"celebrity"   → [-5.80, -5.90, -5.70, -2.00]
"award"       → [-5.10, -5.30, -5.00, -2.10]
"oscar"       → [-6.00, -6.10, -5.90, -2.20]
"concert"     → [-5.70, -5.80, -5.60, -2.30]
"star"        → [-4.80, -4.90, -4.70, -2.40]
"director"    → [-5.30, -5.50, -5.20, -2.50]
"show"        → [-4.50, -4.60, -4.40, -2.60]
"episode"     → [-5.20, -5.30, -5.10, -2.70]
"series"      → [-4.90, -5.00, -4.80, -2.80]
"release"     → [-4.20, -4.30, -4.10, -2.90]
"box"         → [-4.40, -4.50, -4.30, -3.00]
"chart"       → [-4.60, -4.70, -4.50, -3.10]
"streaming"   → [-4.10, -5.10, -5.00, -3.20]
"trailer"     → [-5.50, -5.60, -5.40, -3.30]
"fan"         → [-4.70, -4.20, -4.60, -3.40]
```

SHARED/NEUTRAL (20 words — same pattern, ~equal priors):
```
"said"    → [-3.80, -3.70, -3.60, -3.90]
"new"     → [-3.50, -3.40, -3.30, -3.60]
"year"    → [-3.70, -3.60, -3.50, -3.80]
"first"   → [-3.60, -3.50, -3.40, -3.70]
"million" → [-3.40, -3.50, -3.30, -3.60]
"last"    → [-3.90, -3.80, -3.70, -4.00]
"after"   → [-4.00, -3.90, -3.80, -4.10]
"over"    → [-4.10, -4.00, -3.90, -4.20]
"top"     → [-3.80, -3.70, -3.60, -3.90]
"major"   → [-4.00, -3.90, -3.80, -4.10]
"high"    → [-3.60, -3.50, -3.40, -3.70]
"global"  → [-3.70, -3.80, -3.60, -3.90]
"report"  → [-3.50, -3.60, -3.40, -3.70]
"official" → [-4.20, -4.10, -4.00, -4.30]
"company" → [-3.40, -4.50, -4.40, -4.60]
"national" → [-4.10, -4.00, -3.90, -4.20]
"biggest" → [-4.30, -4.20, -4.10, -4.40]
"making"  → [-4.00, -3.90, -3.80, -4.10]
"recent"  → [-3.80, -3.70, -3.60, -3.90]
"people"  → [-4.20, -4.10, -4.00, -4.30]
```

vocab_size: 100, n_classes: 4, training_info: "Derived from 20 Newsgroups (4-category subset)"


### model_sentiment.json — WRITE THIS EXACTLY

Classes: ["positive", "negative"]
class_log_priors: [-0.693, -0.693] (50/50)

90-word vocabulary. Format: word → [log_p_positive, log_p_negative]

POSITIVE words:
```
"excellent"   → [-1.20, -5.00]
"amazing"     → [-1.30, -4.90]
"wonderful"   → [-1.40, -5.10]
"fantastic"   → [-1.50, -5.20]
"brilliant"   → [-1.60, -5.30]
"outstanding" → [-1.70, -5.40]
"perfect"     → [-1.80, -5.50]
"love"        → [-1.90, -4.80]
"beautiful"   → [-2.00, -4.90]
"great"       → [-2.10, -4.70]
"superb"      → [-2.20, -5.60]
"impressive"  → [-2.30, -5.70]
"delightful"  → [-2.40, -5.80]
"recommend"   → [-2.50, -5.00]
"enjoyed"     → [-2.60, -5.10]
"best"        → [-2.70, -4.60]
"incredible"  → [-2.80, -5.20]
"masterpiece" → [-2.90, -5.90]
"captivating" → [-3.00, -6.00]
"inspiring"   → [-3.10, -5.30]
"fun"         → [-3.20, -4.50]
"entertaining" → [-3.30, -4.60]
"smooth"      → [-3.40, -4.70]
"polished"    → [-3.50, -4.80]
"clever"      → [-3.60, -4.90]
"charming"    → [-3.70, -5.00]
"thoughtful"  → [-3.80, -5.10]
"refreshing"  → [-3.90, -5.20]
"unique"      → [-4.00, -4.40]
"solid"       → [-4.10, -4.50]
```

NEGATIVE words:
```
"terrible"    → [-5.00, -1.20]
"awful"       → [-5.10, -1.30]
"horrible"    → [-5.20, -1.40]
"disappointing" → [-5.30, -1.50]
"worst"       → [-5.40, -1.60]
"boring"      → [-5.50, -1.70]
"waste"       → [-5.60, -1.80]
"bad"         → [-4.80, -1.90]
"poor"        → [-4.90, -2.00]
"useless"     → [-5.70, -2.10]
"avoid"       → [-5.80, -2.20]
"failed"      → [-5.90, -2.30]
"disaster"    → [-6.00, -2.40]
"dreadful"    → [-6.10, -2.50]
"pathetic"    → [-6.20, -2.60]
"mediocre"    → [-5.50, -2.70]
"tedious"     → [-5.60, -2.80]
"forgettable" → [-5.70, -2.90]
"clichéd"     → [-5.80, -3.00]
"overrated"   → [-5.40, -3.10]
"cheap"       → [-4.70, -3.20]
"mess"        → [-5.00, -3.30]
"incoherent"  → [-5.90, -3.40]
"forced"      → [-5.30, -3.50]
"bland"       → [-5.40, -3.60]
"hollow"      → [-5.50, -3.70]
"confusing"   → [-5.10, -3.80]
"predictable" → [-5.20, -3.90]
"shallow"     → [-5.60, -4.00]
"disappoints" → [-5.70, -2.50]
```

NEUTRAL (30 words):
```
"the"    → [-3.50, -3.50]
"and"    → [-3.60, -3.60]
"film"   → [-3.20, -3.20]
"movie"  → [-3.30, -3.30]
"story"  → [-3.40, -3.40]
"plot"   → [-3.80, -3.80]
"scene"  → [-3.70, -3.70]
"actor"  → [-3.90, -3.90]
"show"   → [-4.00, -4.00]
"time"   → [-4.10, -4.10]
"good"   → [-2.90, -3.80]
"not"    → [-3.50, -3.30]
"some"   → [-4.20, -4.20]
"very"   → [-3.10, -3.10]
"really" → [-3.15, -3.15]
"quite"  → [-3.20, -3.20]
"how"    → [-4.30, -4.30]
"bit"    → [-4.00, -3.90]
"much"   → [-3.80, -3.80]
"well"   → [-3.00, -3.50]
"watch"  → [-3.70, -3.70]
"just"   → [-3.60, -3.60]
"one"    → [-4.10, -4.10]
"cast"   → [-4.20, -4.20]
"feel"   → [-3.50, -3.50]
"could"  → [-4.30, -4.30]
"does"   → [-4.40, -4.40]
"though" → [-4.50, -4.50]
"still"  → [-4.60, -4.60]
"first"  → [-3.90, -3.90]
```

vocab_size: 90, n_classes: 2, training_info: "Derived from IMDB mini sentiment dataset"

---

## PHASE 3 — INFERENCE ENGINE (Sub-agent: Engine Builder)

### src/engine/types.ts
```typescript
export interface ModelData {
  domain: string;
  classes: string[];
  class_log_priors: number[];
  vocab: string[];
  log_probs: number[][];
  n_classes: number;
  vocab_size: number;
  training_info: string;
}

export interface WordContribution {
  word: string;
  word_index: number;
  log_probs: number[];        // per class
  contribution: number[];     // log_prob for this word, per class
  delta_score: number;        // max class diff — magnitude of informativeness
  direction: 'positive' | 'negative' | 'neutral'; // relative to class 0
}

export interface ClassificationResult {
  domain: string;
  variant: 'multinomial' | 'bernoulli';
  classes: string[];
  log_scores: number[];       // raw log-posterior per class (unnormalised)
  scores: number[];           // softmax-normalised posterior probabilities
  predicted_class: number;    // index of winning class
  predicted_label: string;
  word_contributions: WordContribution[];
  top_words_per_class: Array<{ word: string; prob: number }>[]; // top 5 per class
  prior_probs: number[];      // softmax of class_log_priors
  n_words_found: number;      // how many input words were in vocabulary
  processing_ms: number;
}
```

### src/engine/tokenizer.ts
```typescript
// Simple whitespace tokenizer with lowercasing and punctuation removal
// Returns array of lowercase tokens, filtered to alphabet only
// Also returns count map { token -> count }

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z\s']/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 2);
}

export function countTokens(tokens: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const t of tokens) {
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return counts;
}
```

### src/engine/inference.ts
Write the full implementation of this function:

```typescript
export function classify(
  text: string,
  model: ModelData,
  variant: 'multinomial' | 'bernoulli' = 'multinomial'
): ClassificationResult

// ALGORITHM:
// 1. Tokenize text → tokens[], count_map
// 2. Build vocab_index: Map<word, index> from model.vocab
// 3. For each class c:
//    log_score[c] = model.class_log_priors[c]
//    For each (word, count) in count_map:
//      if word in vocab_index:
//        idx = vocab_index[word]
//        if variant === 'multinomial':
//          log_score[c] += model.log_probs[idx][c] * count
//        else (bernoulli):
//          // bernoulli: presence only, binary 0/1
//          log_score[c] += model.log_probs[idx][c]
//
// 4. Normalise: posterior[c] = exp(log_score[c]) / sum(exp(log_score))
//    (implement log-sum-exp for numerical stability)
//
// 5. For each token found in vocab:
//    contribution[c] = log_prob[word][c] (multinomial) or log_prob[word][c] (bernoulli)
//    delta = max(contribution) - min(contribution)
//    direction = contribution[0] > contribution[1] ? 'positive' : 'negative'
//    (for multi-class: direction relative to predicted class)
//
// 6. Sort word_contributions by abs(delta) descending
//
// 7. top_words_per_class: for each class, take top 5 from model.vocab sorted by
//    model.log_probs[i][c] descending (pre-compute once on model load)
//
// 8. Return ClassificationResult

// IMPORTANT: log-sum-exp implementation for softmax:
function logSumExp(values: number[]): number {
  const max = Math.max(...values);
  return max + Math.log(values.reduce((sum, v) => sum + Math.exp(v - max), 0));
}

function softmax(logScores: number[]): number[] {
  const lse = logSumExp(logScores);
  return logScores.map(s => Math.exp(s - lse));
}
```

### src/engine/index.ts
Export everything. Also export a `loadModel(domain: string): Promise<ModelData>` function that does:
```typescript
// Dynamic import of the JSON file
const models = {
  spam: () => import('../data/model_spam.json'),
  news: () => import('../data/model_news.json'),
  sentiment: () => import('../data/model_sentiment.json'),
};
export async function loadModel(domain: 'spam' | 'news' | 'sentiment'): Promise<ModelData>
```

---

## PHASE 4 — HOOKS (Sub-agent: Engine Builder, continued)

### src/hooks/useDebounce.ts
Standard 300ms debounce hook. Generic type T.

### src/hooks/useModelLoader.ts
```typescript
// Loads model JSON lazily, caches in module-level Map
// Returns { model: ModelData | null, loading: boolean, error: string | null }
// Auto-loads when domain changes
```

### src/hooks/useClassifier.ts
```typescript
// This is the main hook that components use
// Props: { text: string, domain: 'spam' | 'news' | 'sentiment', variant: 'multinomial' | 'bernoulli' }
// Returns: { result: ClassificationResult | null, loading: boolean }
// Debounces text (300ms), calls classify() on each change
// Memoises the result — only re-computes when text or domain or variant changes
```

---

## PHASE 5 — UI COMPONENTS (Sub-agent: UI Builder)

### DESIGN RULE: All components use CSS variables from index.css, NOT Tailwind classes.
### Use framer-motion for transitions (AnimatePresence, motion.div).
### Font: monospace for all numbers/scores, DM Sans for labels.

### src/components/layout/Sidebar.tsx

```
Sidebar (200px wide, full height, bg: var(--bg-card), border-right: 1px solid var(--border))
├── Logo area (top 64px): "BI" monogram in --accent, "BayesInspector" in DM Sans 12px
├── Nav items (each 36px tall):
│   CLASSIFIER  (icon: grid)
│   DOMAINS     (icon: layers)
│   FORMULA     (icon: math)
│   ABOUT       (icon: info)
│   Active state: left border 2px solid var(--accent), text var(--accent), bg var(--bg-card-2)
└── Bottom: Mode indicator badge showing current domain
```

Nav items use simple SVG icons (inline, 14px):
- Grid: 3×3 dot grid
- Layers: 3 horizontal stacked bars
- Math: "∑" character
- Info: circle with "i"

### src/components/layout/StatCard.tsx

Matches PACEOS top row cards exactly. Props:
```typescript
{
  title: string;       // "ACTIVE WORDS" — uppercase, monospace, muted
  value: string | number;  // large number, monospace bold, 28px
  unit?: string;       // small unit label top-right
  badge?: { label: string; variant: 'active' | 'spam' | 'ham' | 'neutral' };
  subtitle?: string;   // small muted bottom text
  arrow?: boolean;     // diagonal arrow top-right (PACEOS style)
}
```

Layout:
```
┌─────────────────────────────────┐
│ [BADGE]                    ↗    │
│ TITLE                 UNIT TEXT │
│ VALUE                           │
└─────────────────────────────────┘
```
Value font: Space Mono 28px 700. Title: DM Sans 11px, --text-muted, uppercase, letter-spacing 0.08em.

### src/components/classifier/WordToken.tsx

Single word rendered inline. Props:
```typescript
{
  word: string;
  contribution?: WordContribution;
  isInVocab: boolean;
}
```

Rendering rules:
- Not in vocab: plain text, --text-muted
- In vocab, delta > 1.5: strong signal → saturated color overlay
- In vocab, delta 0.5-1.5: medium signal → lighter overlay
- In vocab, delta < 0.5: weak signal → very faint overlay
- Color: class 0 direction → var(--accent) tint; class 1 direction → var(--danger) tint
- Hover: show tooltip with word's log-prob per class (framer-motion AnimatePresence)

### src/components/classifier/TextInput.tsx

Large text area overlaid with word highlighting. Tricky — use this pattern:
```
Outer div (position: relative)
├── <textarea> (position: absolute, transparent text color! Use color: transparent + caret-color: var(--text-primary))
└── <div class="highlight-layer"> (position: absolute, pointer-events: none, same dimensions as textarea)
    └── Split text into WordToken spans preserving whitespace
```
This is the standard "textarea with syntax highlighting" pattern. Font, size, padding on textarea and highlight-layer must be IDENTICAL.

Placeholder text:
- Spam mode: "Type an email or SMS message..."
- News mode: "Paste a news headline or article excerpt..."
- Sentiment mode: "Write a movie review or product feedback..."

### src/components/bayes/PriorPanel.tsx

```
PRIOR PROBABILITY
─────────────────
SPAM    ████░░░░░░  40.0%
HAM     ██████░░░░  60.0%
```
Each bar is a dot-matrix row (20 dots). Filled dots = var(--accent) for class 0, var(--blue) for class 1.
Show exact percentage in Space Mono after the dots.

### src/components/bayes/LikelihoodTable.tsx

```
TOP WORD LIKELIHOODS
SPAM                   HAM
────────────────────────────
free    ████  30.2%   meeting ███   8.1%
win     ████  27.8%   thanks  ███   6.2%
claim   ███   22.1%   ...
```
Table with 2 columns side-by-side. Each row: word (monospace), mini dot-bar (8 dots), percentage.
Highlight words from current input that match vocabulary (bright vs dim).

### src/components/bayes/PosteriorDisplay.tsx

Large animated number showing final posterior probability.
```
POSTERIOR
─────────
  SPAM
 87.3%      ← Space Mono 48px, color: var(--danger) or --accent or --blue
[dot-matrix full-width bar showing 87.3%]
```
framer-motion: animate the number counting up from 0 on change (duration 0.6s, easing easeOut).
Show all classes stacked vertically with bars.

### src/components/bayes/FormulaPanel.tsx

Live formula display using Space Mono throughout:
```
P(C|X) ∝ P(C) × ∏ P(xᵢ|C)

SPAM: log(-0.916) + log(0.462) + log(0.300) + ...
      = -0.916  -0.773  -1.204  ...
      = -4.031
      → 87.3%
```
Update numbers live as text changes. Animate each number swapping with framer-motion
(AnimatePresence, slide up/down transition on value change, 200ms).

### src/components/controls/DomainToggle.tsx

Three-button segmented control (PACEOS style — pill group):
```
[  SPAM  ] [  NEWS  ] [ SENTIMENT ]
```
Active button: bg var(--accent), text #000000, border var(--accent).
Inactive: transparent bg, text --text-secondary, border --border.
Width: equal flex, height 32px, Space Mono 11px uppercase.

### src/components/controls/VariantToggle.tsx

Two-button toggle: [ MULTINOMIAL ] [ BERNOULLI ]
Same style as DomainToggle. Add info tooltip on hover explaining the difference.

---

## PHASE 6 — MAIN VIEW (Sub-agent: Integration)

### src/views/Dashboard.tsx

Full layout assembly. State managed here:
- `text: string` — current input text
- `domain: 'spam' | 'news' | 'sentiment'`
- `variant: 'multinomial' | 'bernoulli'`
- `result: ClassificationResult | null` — from useClassifier hook

```
<Layout>
  <Sidebar activeDomain={domain} />

  <main>
    {/* TOP ROW — 4 stat cards */}
    <div class="stat-row">
      <StatCard title="ACTIVE WORDS" value={result?.n_words_found ?? 0} unit="IN VOCAB" badge={{label:'LIVE', variant:'active'}} arrow />
      <StatCard title="TOP CLASS" value={result?.predicted_label?.toUpperCase() ?? '—'} badge={{label: result ? 'ACTIVE' : 'IDLE', variant: ...}} arrow />
      <StatCard title="CONFIDENCE" value={result ? (result.scores[result.predicted_class]*100).toFixed(1)+'%' : '—.—%'} unit="POST." badge={{label:'ACTIVE', variant:'active'}} arrow />
      <StatCard title="NB VARIANT" value={variant === 'multinomial' ? 'MNB' : 'BNB'} subtitle={variant === 'multinomial' ? 'WORD COUNTS' : 'BINARY'} badge={{label:'ACTIVE', variant:'active'}} />
    </div>

    {/* MIDDLE ROW — 60/40 split */}
    <div class="middle-row">

      {/* LEFT 60% — classifier input + scores */}
      <div class="classifier-panel card">
        <header> NAIVE BAYES CLASSIFIER  [DAILY WEEKLY] style domain switcher </header>
        <TextInput text={text} onChange={setText} domain={domain} result={result} />
        {/* Score bars below input — one per class */}
        {result?.classes.map((cls, i) => (
          <ClassScore class={cls} score={result.scores[i]} index={i} />
        ))}
      </div>

      {/* RIGHT 40% — bayes chain */}
      <div class="bayes-panel card">
        <header> BAYESIAN CHAIN  {timeRange like PACEOS: "PRIOR → LIKELIHOOD → POST."} </header>
        <PriorPanel classes={result?.classes} priors={result?.prior_probs} />
        <LikelihoodTable model={...} result={result} currentText={text} />
        <PosteriorDisplay result={result} />
      </div>

    </div>

    {/* BOTTOM ROW — 3 equal columns */}
    <div class="bottom-row">

      {/* LEFT: Formula panel */}
      <div class="card">
        <header>FORMULA  <Badge label="LIVE" variant="active" /></header>
        <FormulaPanel result={result} />
      </div>

      {/* MIDDLE: Controls */}
      <div class="card">
        <header>CONFIGURATION  <Badge label={variant === 'multinomial' ? 'MNB' : 'BNB'} variant="active" /></header>
        <section>
          <label>DOMAIN</label>
          <DomainToggle value={domain} onChange={setDomain} />
        </section>
        <section>
          <label>NB VARIANT</label>
          <VariantToggle value={variant} onChange={setVariant} />
        </section>
        {/* Words found tracker */}
        <p>VOCABULARY MATCH: {result?.n_words_found ?? 0} / {tokens.length} words</p>
      </div>

      {/* RIGHT: Performance benchmarks (PACEOS style) */}
      <div class="card">
        <header>WORD SIGNALS  <Badge label="TOP 5" variant="neutral" /></header>
        {/* Top 5 most informative words from current input, ranked by |delta| */}
        {result?.word_contributions.slice(0,5).map(wc => (
          <div class="signal-row">
            <span class="word">{wc.word}</span>
            <DotBar value={Math.min(1, wc.delta_score / 3)} color={wc.direction === 'positive' ? '--accent' : '--danger'} dots={10} />
            <span class="delta">Δ{wc.delta_score.toFixed(2)}</span>
          </div>
        ))}
      </div>

    </div>
  </main>
</Layout>
```

---

## PHASE 7 — ANIMATIONS & POLISH (Sub-agent: Integration, continued)

### Required Animations

1. **Posterior number count-up**: On result change, animate number from previous value
   to new value over 600ms using framer-motion `animate` prop.

2. **Dot-matrix fill**: CSS transition on dot opacity/color, 400ms, staggered left-to-right
   using CSS `transition-delay: calc(var(--dot-index) * 15ms)`.

3. **Word highlighting**: framer-motion `layout` on each WordToken span so they
   animate position when text changes.

4. **Formula number swap**: AnimatePresence with `mode="wait"`, each number slides
   out downward and new one slides in from above, 150ms.

5. **Card entrance**: On page load, stagger cards with `initial={{ opacity: 0, y: 12 }}`
   and `animate={{ opacity: 1, y: 0 }}` with delays 0, 100, 200, 300ms.

6. **Domain switch transition**: When domain changes, classifier panel does a brief
   flash (opacity 0 → 1 on new content, 200ms).

### Empty State
When text input is empty, show placeholder content in the bayes panel:
- Dot matrix bars at 50% (neutral prior)
- Formula shows "P(C|X) ∝ P(C) × ∏ P(xᵢ|C)" in muted color
- Posterior shows "—" with a subtle pulse animation (opacity 1→0.5→1, 2s loop)
- "START TYPING TO CLASSIFY" label in --accent color, small caps

---

## PHASE 8 — DEPLOYMENT (Sub-agent: Deploy)

### Vercel config (already defined in Phase 1)

### Build optimisation
- JSON files are small (~40-80KB each) — no code splitting needed
- All three models load eagerly on first render (tiny files, fast)
- Enable Vite gzip compression in vite.config.ts

### README.md — include:
```markdown
# BayesInspector

Live probabilistic text classifier. Visualises the full Naive Bayes reasoning chain.

## Stack
- React 18 + TypeScript + Vite
- Framer Motion (animations)
- Custom NB inference engine in TypeScript (no ML libs)
- Model weights: pre-trained on SMS Spam, 20 Newsgroups, IMDB Mini

## Running Locally
npm install && npm run dev

## Deploy
vercel --prod

## How It Works
[Brief Naive Bayes explanation linking to the presentation]
```

---

## EXECUTION ORDER FOR CLAUDE CODE

Run exactly in this sequence. Each phase should be a separate Task:

```
Task 1:  Create package.json, vite.config.ts, tsconfig.json, tailwind.config.js
Task 2:  Create index.html, vercel.json, .gitignore
Task 3:  Write src/index.css (full design tokens)
Task 4:  Write src/data/model_spam.json    (ALL 120 words, exact JSON)
Task 5:  Write src/data/model_news.json    (ALL 100 words, exact JSON)
Task 6:  Write src/data/model_sentiment.json (ALL 90 words, exact JSON)
Task 7:  Write src/engine/types.ts
Task 8:  Write src/engine/tokenizer.ts
Task 9:  Write src/engine/inference.ts     (full classify() function)
Task 10: Write src/engine/index.ts
Task 11: Write src/hooks/useDebounce.ts
Task 12: Write src/hooks/useModelLoader.ts
Task 13: Write src/hooks/useClassifier.ts
Task 14: Write src/components/layout/Sidebar.tsx
Task 15: Write src/components/layout/StatCard.tsx
Task 16: Write src/components/layout/Layout.tsx
Task 17: Write src/components/controls/Badge.tsx
Task 18: Write src/components/controls/DomainToggle.tsx
Task 19: Write src/components/controls/VariantToggle.tsx
Task 20: Write src/components/classifier/WordToken.tsx
Task 21: Write src/components/classifier/TextInput.tsx
Task 22: Write src/components/classifier/ClassScore.tsx (dot-matrix score bar)
Task 23: Write src/components/bayes/PriorPanel.tsx
Task 24: Write src/components/bayes/LikelihoodTable.tsx
Task 25: Write src/components/bayes/PosteriorDisplay.tsx
Task 26: Write src/components/bayes/FormulaPanel.tsx
Task 27: Write src/views/Dashboard.tsx     (full assembled view)
Task 28: Write src/App.tsx + src/main.tsx
Task 29: Write public/favicon.svg
Task 30: npm install && npm run build      (verify zero errors)
Task 31: Write README.md
```

---

## CRITICAL CONSTRAINTS (Claude Code must respect these)

1. **ZERO external ML libraries.** No TensorFlow.js, no ONNX, no brain.js.
   The inference.ts file contains the only ML code and it is pure math (log sums).

2. **ZERO hardcoded colors in component files.** All colors via CSS variables.
   Every color reference must be `var(--accent)`, `var(--danger)`, etc.

3. **SPACE MONO for all numbers and scores.** DM Sans for everything else.
   Never mix in the wrong component.

4. **DOT-MATRIX bars, never solid bars.** The dot-matrix style is the key visual
   signature. Implement it via a reusable `<DotBar>` component in ClassScore.tsx
   and reuse everywhere.

5. **All JSON files must be syntactically valid.** After writing each JSON file,
   mentally verify brackets are balanced. The log_probs array structure is
   log_probs[word_index][class_index], NOT log_probs[class_index][word_index].

6. **TypeScript strict mode.** No `any` types. All function signatures fully typed.

7. **Mobile is NOT required.** Dashboard is desktop-only (min-width 1024px enforced
   via CSS). Do not add media queries that break the layout.

8. **framer-motion only for meaningful transitions.** Not decorative spin or bounce.
   Every animation must communicate data change or state transition.

9. **Log-sum-exp must be used for softmax.** Never do naive exp() on raw log scores —
   will produce NaN for large negative values. The logSumExp function in inference.ts
   is mandatory.

10. **App must work with empty vocabulary hits.** If user types text with zero words
    in vocabulary, scores fall back to priors only. Display "0 vocab hits — prior only"
    in the formula panel. Never crash.

---

## TESTING CHECKPOINTS (verify at Task 30)

- [ ] npm run build exits with 0 errors
- [ ] Type "free win claim prize" → classifies SPAM with >90% confidence
- [ ] Type "meeting tomorrow project schedule" → classifies HAM with >90%
- [ ] Switch domain to NEWS, type "election government senator vote" → POLITICS
- [ ] Switch domain to SENTIMENT, type "excellent amazing wonderful love" → POSITIVE
- [ ] Switch to BERNOULLI variant — scores change (counts ignored, binary presence)
- [ ] Empty input → no crash, shows prior probabilities
- [ ] All dot-matrix bars fill left to right with animation
- [ ] Formula panel numbers update on each keystroke (after 300ms debounce)
- [ ] Word highlighting colours update as text changes

