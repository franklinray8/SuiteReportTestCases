import { ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ActionSheetController, AlertController, IonButton, IonIcon, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronDownOutline, cloudDownloadOutline, cloudUploadOutline, codeSlashOutline, downloadOutline,
  printOutline, refreshOutline,
} from 'ionicons/icons';

import { CsvExportService } from '../../../../core/services/csv-export.service';
import { ReportBackupService } from '../../../../core/services/report-backup.service';
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
  private readonly backup = inject(ReportBackupService);
  private readonly alerts = inject(AlertController);
  private readonly sheets = inject(ActionSheetController);

  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  protected readonly suites = SUITES;

  constructor() {
    addIcons({
      chevronDownOutline, cloudDownloadOutline, cloudUploadOutline, codeSlashOutline, downloadOutline,
      printOutline, refreshOutline,
    });
  }

  protected onFecha(event: Event): void {
    this.state.setFecha((event.target as HTMLInputElement).value);
  }

  protected async openDataMenu(): Promise<void> {
    const sheet = await this.sheets.create({
      header: 'Datos de ' + this.state.suite.nombre,
      buttons: [
        { text: 'Exportar respaldo (.json)', icon: 'cloud-download-outline', handler: () => this.backup.exportJson() },
        { text: 'Importar respaldo…', icon: 'cloud-upload-outline', handler: () => this.pickBackup() },
        { text: 'Copiar como semilla (código)', icon: 'code-slash-outline', handler: () => void this.copySeed() },
        { text: 'Reiniciar', icon: 'refresh-outline', role: 'destructive', handler: () => void this.confirmReset() },
        { text: 'Cancelar', role: 'cancel' },
      ],
    });
    await sheet.present();
  }

  protected async onBackupFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = ''; // permite volver a elegir el mismo archivo
    if (!file) return;

    try {
      const preview = await this.backup.readBackup(file);
      const extra = preview.descartados
        ? ` Se ignorarán ${preview.descartados} plan(es) que ya no existen en la suite.`
        : '';
      await this.confirm(
        'Importar respaldo',
        `Se reemplazarán TODOS los valores de ${this.state.suite.nombre} en este navegador por los del respaldo `
          + `(período ${preview.fecha}, ${preview.planes} planes).${extra} ¿Continuar?`,
        'Importar',
        () => this.backup.applyBackup(preview),
      );
    } catch (err) {
      await this.info('No se pudo importar', err instanceof Error ? err.message : 'Archivo no válido.');
    }
  }

  protected exportCsv(): void {
    this.csv.download();
  }

  protected print(): void {
    this.ui.setAllOpen(true);
    // espera un frame para que los <details> se abran antes de imprimir
    requestAnimationFrame(() => window.print());
  }

  private pickBackup(): void {
    this.fileInput().nativeElement.click();
  }

  private async copySeed(): Promise<void> {
    const { file } = this.state.suite.seedSource;
    const how = await this.backup.copySeed();
    const where = how === 'copied' ? 'Se copió al portapapeles' : 'Se descargó como seed.data.ts';
    await this.info(
      'Semilla generada',
      `${where}. Reemplaza todo el contenido de ${file} con ese texto, guarda y haz commit. `
        + 'Será el punto de partida para quien abra la app sin datos propios o pulse Reiniciar.',
    );
  }

  private confirmReset(): Promise<void> {
    return this.confirm(
      'Reiniciar',
      'Se perderán los valores capturados en este navegador para ' + this.state.suite.nombre + '. ¿Continuar?',
      'Reiniciar',
      () => this.state.reset(),
    );
  }

  private async confirm(header: string, message: string, okText: string, onOk: () => void): Promise<void> {
    const alert = await this.alerts.create({
      header,
      message,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: okText, role: 'destructive', handler: onOk },
      ],
    });
    await alert.present();
  }

  private async info(header: string, message: string): Promise<void> {
    const alert = await this.alerts.create({ header, message, buttons: ['Entendido'] });
    await alert.present();
  }
}
