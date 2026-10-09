export function planKey(code: string, plan: string): string {
  return code + '||' + plan;
}

export function matchesPlan(plan: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  return !q || plan.toLowerCase().includes(q);
}

/** El filtro también acepta el código o nombre del grupo (sucursal / país). */
export function matchesGroup(code: string, nombre: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  return !!q && (code.toLowerCase().includes(q) || nombre.toLowerCase().includes(q));
}
