import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/angular/standalone';

import { ReportStateService } from '../../../../core/services/report-state.service';
import { ReportUiService, ReportView } from '../../../../core/services/report-ui.service';

/** Selector de tipo de producto y de vista (Resumen / Detallado). */
@Component({
  selector: 'app-report-tabs',
  imports: [IonSegment, IonSegmentButton, IonLabel],
  templateUrl: './report-tabs.component.html',
  styleUrl: './report-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportTabsComponent {
  protected readonly state = inject(ReportStateService);
  protected readonly ui = inject(ReportUiService);

  protected onTipo(value: unknown): void {
    if (typeof value === 'string') this.state.setTipo(value);
  }

  protected onView(value: unknown): void {
    if (value === 'res' || value === 'det') this.ui.view.set(value as ReportView);
  }
}
