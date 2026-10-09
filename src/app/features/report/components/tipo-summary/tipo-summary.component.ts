import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ReportMetricsService } from '../../../../core/services/report-metrics.service';
import { StatCardComponent, StatIndicator } from '../../../../shared/components/stat-card/stat-card.component';

/** Casos actuales por tipo de producto, independiente del tipo seleccionado. */
@Component({
  selector: 'app-tipo-summary',
  imports: [StatCardComponent],
  templateUrl: './tipo-summary.component.html',
  styleUrl: './tipo-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TipoSummaryComponent {
  protected readonly tt = inject(ReportMetricsService).tipoTotals;
  protected readonly indicators: readonly StatIndicator[] = ['ant', 'act', 'upd'];
}
