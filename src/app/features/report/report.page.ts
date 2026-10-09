import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonContent, IonHeader } from '@ionic/angular/standalone';

import { ReportStateService } from '../../core/services/report-state.service';
import { ReportUiService } from '../../core/services/report-ui.service';
import { DetailViewComponent } from './components/detail-view/detail-view.component';
import { ReportHeroComponent } from './components/report-hero/report-hero.component';
import { ReportTabsComponent } from './components/report-tabs/report-tabs.component';
import { ReportToolbarComponent } from './components/report-toolbar/report-toolbar.component';
import { SummaryTableComponent } from './components/summary-table/summary-table.component';
import { TipoSummaryComponent } from './components/tipo-summary/tipo-summary.component';
import { TotalsStripComponent } from './components/totals-strip/totals-strip.component';

/** Página de una suite (Vida, Salud…). La suite la define la ruta con `provideSuite()`. */
@Component({
  selector: 'app-report-page',
  imports: [
    IonHeader, IonContent,
    ReportToolbarComponent, ReportHeroComponent, TotalsStripComponent, TipoSummaryComponent,
    ReportTabsComponent, SummaryTableComponent, DetailViewComponent,
  ],
  templateUrl: './report.page.html',
  styleUrl: './report.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ion-page' },
})
export class ReportPage {
  protected readonly state = inject(ReportStateService);
  protected readonly ui = inject(ReportUiService);
}
