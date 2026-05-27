# BayesInspector

Live probabilistic text classifier. Visualises the full Naive Bayes reasoning chain (Prior → Likelihood → Posterior) word-by-word as you type.

## Stack

- React 18 + TypeScript + Vite
- Framer Motion (animations)
- Custom NB inference engine in TypeScript (no ML libs)
- Model weights: pre-trained on SMS Spam, 20 Newsgroups, IMDB Mini

## Running Locally

```bash
npm install && npm run dev
```

## Deploy

```bash
vercel --prod
```

## How It Works

BayesInspector implements **Multinomial Naive Bayes** (and the Bernoulli variant) entirely in TypeScript:

```
log P(C|X) ∝ log P(C) + Σ count(xᵢ) × log P(xᵢ|C)
```

1. **Prior** — `log P(C)` from training class frequencies
2. **Likelihood** — `log P(word|class)` from Laplace-smoothed word counts
3. **Posterior** — normalised via log-sum-exp for numerical stability

The model weights are pre-baked JSON files (no server, no runtime training). Inference runs in <1ms on the client.
