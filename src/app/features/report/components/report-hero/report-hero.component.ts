import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ReportMetricsService } from '../../../../core/services/report-metrics.service';
import { ReportStateService } from '../../../../core/services/report-state.service';
import { FmtPipe, PctPipe, SignedPipe } from '../../../../shared/pipes/format.pipes';

@Component({
  selector: 'app-report-hero',
  imports: [FmtPipe, PctPipe, SignedPipe],
  templateUrl: './report-hero.component.html',
  styleUrl: './report-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportHeroComponent {
  protected readonly state = inject(ReportStateService);
  protected readonly t = inject(ReportMetricsService).totals;

  protected readonly eyebrow = computed(() => {
    const fecha = this.state.fecha();
    const tipo = this.state.hasTipos ? ' · ' + this.state.currentTipoLabel() : '';
    return 'Resumen del período' + tipo + (fecha ? ' · ' + fecha : '');
  });

  protected readonly isEmpty = computed(() => this.t().ant === 0 && this.t().act === 0);
}
