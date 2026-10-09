import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

import { ReportState } from '../models/report.models';
import { downloadFile } from '../utils/download.utils';
import { planKey } from '../utils/plan.utils';
import { buildSeedFile } from '../utils/seed.utils';
import { ReportStateService } from './report-state.service';
import { ReportStorageService } from './report-storage.service';

/** Tamaño máximo aceptado al importar; un respaldo real pesa unos pocos KB. */
const MAX_BACKUP_BYTES = 2 * 1024 * 1024;
const BACKUP_FORMAT = 'suite-report-backup';

export interface BackupPreview {
  state: ReportState;
  fecha: string;
  planes: number;
  /** Entradas del archivo que no corresponden a ningún plan actual (se descartan). */
  descartados: number;
}

/** Respaldo (exportar / importar JSON) y generación del archivo de semilla de una suite. */
@Injectable()
export class ReportBackupService {
  private readonly state = inject(ReportStateService);
  private readonly storage = inject(ReportStorageService);
  private readonly document = inject(DOCUMENT);

  exportJson(): void {
    const { suite } = this.state;
    const backup = {
      format: BACKUP_FORMAT,
      suite: suite.id,
      version: suite.storage.version,
      exportedAt: new Date().toISOString(),
      fecha: this.state.fecha(),
      values: this.state.effectiveValues(),
    };
    const name = `${suite.filePrefix}-respaldo-${this.state.fecha() || 'periodo'}.json`;
    downloadFile(this.document, name, JSON.stringify(backup, null, 2), 'application/json');
    this.state.notify('Respaldo descargado');
  }

  /** Lee y valida un archivo de respaldo. Lanza un Error con un mensaje para el usuario si no sirve. */
  async readBackup(file: File): Promise<BackupPreview> {
    const { suite } = this.state;
    if (file.size > MAX_BACKUP_BYTES) throw new Error('El archivo es demasiado grande para ser un respaldo.');

    let raw: unknown;
    try {
      raw = JSON.parse(await file.text());
    } catch {
      throw new Error('El archivo no es un respaldo válido (JSON ilegible).');
    }

    const meta = (raw ?? {}) as { format?: unknown; suite?: unknown };
    if (meta.format !== BACKUP_FORMAT) throw new Error('El archivo no es un respaldo de este reporte.');
    if (meta.suite !== suite.id) {
      throw new Error(`Este respaldo es de la suite "${String(meta.suite)}", no de ${suite.nombre}.`);
    }

    const parsed = this.storage.parse(raw);
    if (!parsed) throw new Error('El respaldo es de una versión que esta app no reconoce.');

    // solo se aceptan planes que existen hoy en la suite
    const known = new Set(this.state.branches.flatMap((b) => b.productos.map((p) => planKey(b.code, p))));
    let descartados = 0;
    let planes = 0;
    for (const values of Object.values(parsed.values)) {
      for (const k of Object.keys(values)) {
        if (known.has(k)) {
          planes++;
        } else {
          delete values[k];
          descartados++;
        }
      }
    }
    return { state: parsed, fecha: parsed.fecha, planes, descartados };
  }

  applyBackup(preview: BackupPreview): void {
    this.state.replaceAll(preview.state, 'Respaldo importado');
  }

  /** Contenido completo del archivo de semilla con los valores actuales. */
  seedFile(): string {
    const { suite } = this.state;
    return buildSeedFile(suite.seedSource.constName, suite.nombre, suite.tipos, this.state.effectiveValues(), this.state.fecha());
  }

  /** Copia la semilla al portapapeles; si el navegador no lo permite, la descarga como archivo. */
  async copySeed(): Promise<'copied' | 'downloaded'> {
    const content = this.seedFile();
    try {
      await navigator.clipboard.writeText(content);
      this.state.notify('Semilla copiada');
      return 'copied';
    } catch {
      downloadFile(this.document, 'seed.data.ts', content, 'text/plain;charset=utf-8');
      this.state.notify('Semilla descargada');
      return 'downloaded';
    }
  }
}
