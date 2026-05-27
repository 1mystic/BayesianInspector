import { useState, useEffect } from 'react';
import type { ModelData } from '../engine/types';
import { loadModel, type Domain } from '../engine';

const cache = new Map<Domain, ModelData>();

export function useModelLoader(domain: Domain) {
  const [model, setModel] = useState<ModelData | null>(cache.get(domain) ?? null);
  const [loading, setLoading] = useState(!cache.has(domain));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache.has(domain)) {
      setModel(cache.get(domain)!);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    loadModel(domain)
      .then(m => {
        cache.set(domain, m);
        setModel(m);
        setLoading(false);
      })
      .catch(err => {
        setError(String(err));
        setLoading(false);
      });
  }, [domain]);

  return { model, loading, error };
}
