export type CsvCell = string | number;

/** Neutraliza celdas que Excel interpretaría como fórmula (CSV injection). */
function guardFormula(s: string): string {
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function escapeCell(c: CsvCell): string {
  const s = typeof c === 'number' ? String(c) : guardFormula(c);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

export function toCsv(rows: readonly CsvCell[][]): string {
  return rows.map((r) => r.map(escapeCell).join(',')).join('\n');
}
