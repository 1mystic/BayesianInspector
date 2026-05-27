import type { ModelData, ClassificationResult, WordContribution } from './types';
import { tokenize, countTokens } from './tokenizer';

function logSumExp(values: number[]): number {
  const max = Math.max(...values);
  return max + Math.log(values.reduce((sum, v) => sum + Math.exp(v - max), 0));
}

function softmax(logScores: number[]): number[] {
  const lse = logSumExp(logScores);
  return logScores.map(s => Math.exp(s - lse));
}

// Pre-compute top-5 words per class sorted by log_prob descending
function computeTopWordsPerClass(
  model: ModelData
): Array<{ word: string; prob: number }>[] {
  return model.classes.map((_, ci) => {
    const indexed = model.vocab.map((word, wi) => ({
      word,
      prob: Math.exp(model.log_probs[wi][ci]),
    }));
    indexed.sort((a, b) => b.prob - a.prob);
    return indexed.slice(0, 5);
  });
}

export function classify(
  text: string,
  model: ModelData,
  variant: 'multinomial' | 'bernoulli' = 'multinomial'
): ClassificationResult {
  const t0 = performance.now();

  const tokens = tokenize(text);
  const countMap = countTokens(tokens);

  // Build vocab index lookup O(1)
  const vocabIndex = new Map<string, number>();
  model.vocab.forEach((w, i) => vocabIndex.set(w, i));

  const nClasses = model.n_classes;

  // Initialize log-scores from priors
  const logScores: number[] = [...model.class_log_priors];

  const wordContributions: WordContribution[] = [];
  let wordsFound = 0;

  for (const [word, count] of countMap.entries()) {
    const idx = vocabIndex.get(word);
    if (idx === undefined) continue;

    wordsFound++;
    const wordLogProbs = model.log_probs[idx]; // [nClasses]
    const contribution: number[] = new Array(nClasses);

    for (let c = 0; c < nClasses; c++) {
      const contrib =
        variant === 'multinomial'
          ? wordLogProbs[c] * count
          : wordLogProbs[c]; // bernoulli: presence only
      logScores[c] += contrib;
      contribution[c] = contrib;
    }

    const maxContrib = Math.max(...contribution);
    const minContrib = Math.min(...contribution);
    const delta = maxContrib - minContrib;

    // Direction relative to class 0 (first class)
    let direction: WordContribution['direction'];
    if (delta < 0.3) {
      direction = 'neutral';
    } else if (contribution[0] >= maxContrib) {
      direction = 'positive';
    } else {
      direction = 'negative';
    }

    wordContributions.push({
      word,
      word_index: idx,
      log_probs: [...wordLogProbs],
      contribution,
      delta_score: delta,
      direction,
    });
  }

  // Sort by informativeness descending
  wordContributions.sort((a, b) => b.delta_score - a.delta_score);

  const scores = softmax(logScores);
  const predictedClass = scores.indexOf(Math.max(...scores));
  const priorProbs = softmax(model.class_log_priors);
  const topWordsPerClass = computeTopWordsPerClass(model);

  return {
    domain: model.domain,
    variant,
    classes: model.classes,
    log_scores: logScores,
    scores,
    predicted_class: predictedClass,
    predicted_label: model.classes[predictedClass],
    word_contributions: wordContributions,
    top_words_per_class: topWordsPerClass,
    prior_probs: priorProbs,
    n_words_found: wordsFound,
    processing_ms: performance.now() - t0,
  };
}
