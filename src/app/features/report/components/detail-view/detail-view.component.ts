import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AlertController, IonButton, IonSearchbar } from '@ionic/angular/standalone';

import { ReportMetricsService } from '../../../../core/services/report-metrics.service';
import { ReportStateService } from '../../../../core/services/report-state.service';
import { ReportUiService } from '../../../../core/services/report-ui.service';
import { BranchDetailComponent } from '../branch-detail/branch-detail.component';

/** Pestaña Detallado: filtro, cierre de período y lista de sucursales / países. */
@Component({
  selector: 'app-detail-view',
  imports: [IonSearchbar, IonButton, BranchDetailComponent],
  templateUrl: './detail-view.component.html',
  styleUrl: './detail-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailViewComponent {
  protected readonly state = inject(ReportStateService);
  protected readonly ui = inject(ReportUiService);
  private readonly metrics = inject(ReportMetricsService);
  private readonly alerts = inject(AlertController);

  protected readonly query = signal('');

  /** Grupo + su resumen, en el mismo orden que la configuración de la suite. */
  protected readonly items = computed(() => {
    const summaries = this.metrics.branchSummaries();
    return this.state.branches.map((branch, i) => ({ branch, summary: summaries[i] }));
  });

  protected onSearch(value: string | null | undefined): void {
    this.query.set(value ?? '');
  }

  protected async confirmRoll(): Promise<void> {
    const alert = await this.alerts.create({
      header: 'Cerrar período',
      message: 'El Actual de cada plan pasa a Anterior y se limpian Nuevos y Actualizado'
        + (this.state.hasTipos ? ' (en todos los tipos)' : '') + '. ¿Continuar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Cerrar período', role: 'confirm', handler: () => this.state.rollForward() },
      ],
    });
    await alert.present();
  }
}
