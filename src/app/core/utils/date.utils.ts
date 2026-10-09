/** Fecha de hoy en formato ISO (YYYY-MM-DD), igual que un <input type="date">. */
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
