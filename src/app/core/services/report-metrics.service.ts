import { Injectable, computed, inject } from '@angular/core';

import { BranchSummary, ReportTotals, TipoTotals } from '../models/report.models';
import { ValueLookup, summarizeBranch, summarizeTotals, tipoActualTotal } from '../utils/report-calculations.utils';
import { ReportStateService } from './report-state.service';

/** Totales derivados del estado; se recalculan solos cuando cambia un valor o el tipo. */
@Injectable()
export class ReportMetricsService {
  private readonly state = inject(ReportStateService);

  // getValue() lee el signal `values`, así que los computed lo registran como dependencia.
  private readonly lookup: ValueLookup = (tipo, code, plan) => this.state.getValue(tipo, code, plan);

  readonly branchSummaries = computed<BranchSummary[]>(() => {
    const tipo = this.state.currentTipo();
    return this.state.branches.map((b) => summarizeBranch(b, tipo, this.lookup));
  });

  readonly totals = computed<ReportTotals>(() => summarizeTotals(this.branchSummaries()));

  /** Casos actuales por tipo (siempre visibles, independiente del tipo seleccionado). */
  readonly tipoTotals = computed<TipoTotals>(() => {
    const items = this.state.tipos.map((t) => ({
      key: t.key,
      label: t.label,
      actual: tipoActualTotal(this.state.branches, t.key, this.lookup),
    }));
    return { items, total: items.reduce((sum, i) => sum + i.actual, 0) };
  });
}
