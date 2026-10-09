import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AlertController, IonButton, IonIcon, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { downloadOutline, printOutline } from 'ionicons/icons';

import { CsvExportService } from '../../../../core/services/csv-export.service';
import { ReportStateService } from '../../../../core/services/report-state.service';
import { ReportUiService } from '../../../../core/services/report-ui.service';
import { SUITES } from '../../../../core/suites/suite.providers';

@Component({
  selector: 'app-report-toolbar',
  imports: [IonToolbar, IonButton, IonIcon, RouterLink, RouterLinkActive],
  templateUrl: './report-toolbar.component.html',
  styleUrl: './report-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportToolbarComponent {
  protected readonly state = inject(ReportStateService);
  private readonly ui = inject(ReportUiService);
  private readonly csv = inject(CsvExportService);
  private readonly alerts = inject(AlertController);

  protected readonly suites = SUITES;

  constructor() {
    addIcons({ downloadOutline, printOutline });
  }

  protected onFecha(event: Event): void {
    this.state.setFecha((event.target as HTMLInputElement).value);
  }

  protected async confirmReset(): Promise<void> {
    const alert = await this.alerts.create({
      header: 'Reiniciar',
      message: 'Se perderán los valores capturados en este navegador para ' + this.state.suite.nombre + '. ¿Continuar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Reiniciar', role: 'destructive', handler: () => this.state.reset() },
      ],
    });
    await alert.present();
  }

  protected exportCsv(): void {
    this.csv.download();
  }

  protected print(): void {
    this.ui.setAllOpen(true);
    // espera un frame para que los <details> se abran antes de imprimir
    requestAnimationFrame(() => window.print());
  }
}
