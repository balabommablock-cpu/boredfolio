import { useState, useEffect, useCallback, useRef } from "react";

/*
 * DATA HOOKS
 * ──────────
 * Custom React hooks for fetching Boredfolio API data.
 * Handles loading, error, and caching states.
 */

/* ── Generic fetch hook ── */
export function useFetch<T>(url: string | null, options?: { enabled?: boolean }) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url || options?.enabled === false) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [url, options?.enabled]);

  return { data, loading, error };
}

/* ── Search autocomplete hook ── */
export function useSchemeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ code: number; name: string; plan: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const search = useCallback((q: string) => {
    setQuery(q);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (q.length < 2) { setResults([]); return; }

    setLoading(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce
  }, []);

  return { query, search, results, loading, setQuery };
}

/* ── Scheme detail hook ── */
export function useSchemeDetail(schemeCode: number | null) {
  return useFetch<{
    meta: { schemeCode: number; schemeName: string; fundHouse: string; schemeType: string; schemeCategory: string };
    nav: { current: number; date: string; previousClose: number; dayChange: number; dayChangePercent: number };
    returns: Record<string, number | null>;
    risk: { stdDev3Y: number; sharpe3Y: number; maxDrawdown: number; maxDrawdownDate: string; recoveryDays: number | null };
    rollingStats: { best: number; worst: number; median: number; current: number; percentNegative: number } | null;
    sip: { monthlyAmount: number; totalInvested: number; currentValue: number; xirr: number };
    chartData: { date: string; nav: number }[];
    drawdownData: { date: string; drawdown: number }[];
    rollingData: { date: string; fund: number }[];
  }>(
    schemeCode ? `/api/scheme/${schemeCode}` : null
  );
}

/* ── Watchlist hook (localStorage) ── */
export function useWatchlist() {
  const [items, setItems] = useState<{ code: number; name: string; addedAt: string }[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("boredfolio_watchlist");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  const add = useCallback((code: number, name: string) => {
    setItems((prev) => {
      if (prev.find((i) => i.code === code)) return prev;
      const next = [...prev, { code, name, addedAt: new Date().toISOString() }];
      localStorage.setItem("boredfolio_watchlist", JSON.stringify(next));
      return next;
    });
  }, []);

  const remove = useCallback((code: number) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.code !== code);
      localStorage.setItem("boredfolio_watchlist", JSON.stringify(next));
      return next;
    });
  }, []);

  const isWatched = useCallback((code: number) => items.some((i) => i.code === code), [items]);

  return { items, add, remove, isWatched };
}

/* ── Compare list hook ── */
export function useCompareList(maxItems = 5) {
  const [items, setItems] = useState<{ id: string; name: string; code?: number }[]>([]);

  const add = useCallback((item: { id: string; name: string; code?: number }) => {
    setItems((prev) => {
      if (prev.length >= maxItems) return prev;
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }, [maxItems]);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const has = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  return { items, add, remove, clear, has, isFull: items.length >= maxItems };
}

/* ── Local storage preference hook ── */
export function usePreference<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`boredfolio_${key}`);
      if (saved !== null) setValue(JSON.parse(saved));
    } catch {}
  }, [key]);

  const set = useCallback((newValue: T) => {
    setValue(newValue);
    try {
      localStorage.setItem(`boredfolio_${key}`, JSON.stringify(newValue));
    } catch {}
  }, [key]);

  return [value, set];
}
