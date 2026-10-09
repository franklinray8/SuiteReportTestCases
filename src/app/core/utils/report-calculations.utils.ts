import { Branch, BranchSummary, PlanValue, ReportTotals, TipoKey } from '../models/report.models';

export type ValueLookup = (tipo: TipoKey, code: string, plan: string) => PlanValue;

/** Actual = Anterior + Nuevos. */
export function planActual(v: PlanValue): number {
  return v.a + v.nu;
}

export function summarizeBranch(branch: Branch, tipo: TipoKey, lookup: ValueLookup): BranchSummary {
  const s: BranchSummary = {
    code: branch.code, nombre: branch.nombre, planes: branch.productos.length,
    a: 0, ac: 0, up: 0, net: 0, newPos: 0,
  };
  for (const plan of branch.productos) {
    const v = lookup(tipo, branch.code, plan);
    const net = v.nu;
    s.a += v.a;
    s.ac += planActual(v);
    s.up += v.up;
    s.net += net;
    if (net > 0) s.newPos += net;
  }
  return s;
}

export function summarizeTotals(rows: readonly BranchSummary[]): ReportTotals {
  const t = rows.reduce(
    (acc, r) => ({
      ant: acc.ant + r.a,
      act: acc.act + r.ac,
      upd: acc.upd + r.up,
      newPos: acc.newPos + r.newPos,
      planes: acc.planes + r.planes,
    }),
    { ant: 0, act: 0, upd: 0, newPos: 0, planes: 0 },
  );
  return {
    ...t,
    net: t.act - t.ant,
    trabajados: t.newPos + t.upd,
    sucursales: rows.length,
  };
}

/** Total de casos actuales de un tipo, en todas las sucursales. */
export function tipoActualTotal(branches: readonly Branch[], tipo: TipoKey, lookup: ValueLookup): number {
  return branches.reduce((sum, b) => sum + summarizeBranch(b, tipo, lookup).ac, 0);
}
