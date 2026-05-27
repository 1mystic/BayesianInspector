import { useMemo } from 'react';
import type { ClassificationResult } from '../engine/types';
import { classify } from '../engine';
import { useDebounce } from './useDebounce';
import { useModelLoader } from './useModelLoader';
import type { Domain } from '../engine';

interface UseClassifierProps {
  text: string;
  domain: Domain;
  variant: 'multinomial' | 'bernoulli';
}

interface UseClassifierResult {
  result: ClassificationResult | null;
  loading: boolean;
}

export function useClassifier({ text, domain, variant }: UseClassifierProps): UseClassifierResult {
  const debouncedText = useDebounce(text, 300);
  const { model, loading } = useModelLoader(domain);

  const result = useMemo<ClassificationResult | null>(() => {
    if (!model || debouncedText.trim().length === 0) return null;
    return classify(debouncedText, model, variant);
  }, [debouncedText, model, variant]);

  return { result, loading };
}
