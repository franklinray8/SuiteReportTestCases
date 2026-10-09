import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

import { CsvCell, toCsv } from '../utils/csv.utils';
import { planActual } from '../utils/report-calculations.utils';
import { ReportStateService } from './report-state.service';

const VALUE_HEADER: CsvCell[] = ['Plan', 'Anterior', 'Nuevos', 'Actualizado', 'Actual', 'Crecimiento%', 'Mantenimiento%'];

/** Exporta el detalle de la suite (todos sus tipos) a CSV (UTF-8 con BOM para Excel). */
@Injectable()
export class CsvExportService {
  private readonly state = inject(ReportStateService);
  private readonly document = inject(DOCUMENT);

  buildRows(): CsvCell[][] {
    const { suite, hasTipos } = this.state;
    const header: CsvCell[] = [...(hasTipos ? ['Tipo'] : []), suite.grupo.singular, ...VALUE_HEADER];
    const rows: CsvCell[][] = [header];
    for (const t of this.state.tipos) {
      for (const b of this.state.branches) {
        for (const plan of b.productos) {
          const v = this.state.getValue(t.key, b.code, plan);
          rows.push([
            ...(hasTipos ? [t.label] : []), b.code, plan, v.a, v.nu, v.up, planActual(v),
            v.a > 0 ? (v.nu / v.a * 100).toFixed(1) : '',
            v.a > 0 ? (v.up / v.a * 100).toFixed(1) : '',
          ]);
        }
      }
    }
    return rows;
  }

  download(): void {
    const blob = new Blob(['﻿' + toCsv(this.buildRows())], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = this.document.createElement('a');
    a.href = url;
    a.download = this.state.suite.csvPrefix + '-' + (this.state.fecha() || 'periodo') + '.csv';
    this.document.body.appendChild(a);
    a.click();
    this.document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.state.notify('CSV descargado');
  }
}
