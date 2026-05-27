export type { ModelData, ClassificationResult, WordContribution } from './types';
export { classify } from './inference';
export { tokenize, countTokens } from './tokenizer';

import type { ModelData } from './types';

const modelLoaders = {
  spam: () => import('../data/model_spam.json'),
  news: () => import('../data/model_news.json'),
  sentiment: () => import('../data/model_sentiment.json'),
} as const;

export type Domain = keyof typeof modelLoaders;

export async function loadModel(domain: Domain): Promise<ModelData> {
  const mod = await modelLoaders[domain]();
  return mod.default as unknown as ModelData;
}
