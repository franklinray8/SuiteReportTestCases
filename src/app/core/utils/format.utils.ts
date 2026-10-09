const LOCALE = 'es-DO';

export function fmt(n: number | null | undefined): string {
  return (n || 0).toLocaleString(LOCALE);
}

/** Número con signo (+, − tipográfico o nada para cero). */
export function signed(n: number): string {
  const sign = n > 0 ? '+' : n < 0 ? '−' : '';
  return sign + fmt(Math.abs(n));
}

export function pctTxt(part: number, base: number): string {
  return base > 0 ? (part / base * 100).toFixed(1) + '%' : '—';
}

export type Trend = 'up' | 'dn' | 'zero';

export function trend(n: number): Trend {
  return n > 0 ? 'up' : n < 0 ? 'dn' : 'zero';
}
