import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ReportMetricsService } from '../../../../core/services/report-metrics.service';
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card.component';
import { PctPipe, SignedPipe } from '../../../../shared/pipes/format.pipes';

/** Anterior / Actual / Actualizado / Trabajados del tipo seleccionado. */
@Component({
  selector: 'app-totals-strip',
  imports: [StatCardComponent, PctPipe, SignedPipe],
  templateUrl: './totals-strip.component.html',
  styleUrl: './totals-strip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalsStripComponent {
  protected readonly t = inject(ReportMetricsService).totals;
  protected readonly absNet = computed(() => Math.abs(this.t().net));
}
