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
  log_probs: number[];
  contribution: number[];
  delta_score: number;
  direction: 'positive' | 'negative' | 'neutral';
}

export interface ClassificationResult {
  domain: string;
  variant: 'multinomial' | 'bernoulli';
  classes: string[];
  log_scores: number[];
  scores: number[];
  predicted_class: number;
  predicted_label: string;
  word_contributions: WordContribution[];
  top_words_per_class: Array<{ word: string; prob: number }>[];
  prior_probs: number[];
  class_log_priors: number[];
  n_words_found: number;
  processing_ms: number;
}
