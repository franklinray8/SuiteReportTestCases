import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ReportMetricsService } from '../../../../core/services/report-metrics.service';
import { SUITE_CONFIG } from '../../../../core/suites/suite.token';
import { DeltaChipComponent } from '../../../../shared/components/delta-chip/delta-chip.component';
import { FmtPipe, PctPipe, SignedPipe } from '../../../../shared/pipes/format.pipes';

/** Pestaña Resumen: una fila por sucursal / país + total general. */
@Component({
  selector: 'app-summary-table',
  imports: [DeltaChipComponent, FmtPipe, PctPipe, SignedPipe],
  templateUrl: './summary-table.component.html',
  styleUrl: './summary-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryTableComponent {
  private readonly metrics = inject(ReportMetricsService);
  protected readonly rows = this.metrics.branchSummaries;
  protected readonly t = this.metrics.totals;
  protected readonly grupo = inject(SUITE_CONFIG).grupo.singular;
}
