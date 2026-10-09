import { Provider } from '@angular/core';

import { SuiteConfig } from '../models/suite.models';
import { CsvExportService } from '../services/csv-export.service';
import { ReportMetricsService } from '../services/report-metrics.service';
import { ReportStateService } from '../services/report-state.service';
import { ReportStorageService } from '../services/report-storage.service';
import { ReportUiService } from '../services/report-ui.service';
import { SALUD_SUITE } from './salud.suite';
import { SUITE_CONFIG } from './suite.token';
import { VIDA_SUITE } from './vida.suite';

/** Suites disponibles, en el orden en que aparecen en la navegación. */
export const SUITES: readonly SuiteConfig[] = [VIDA_SUITE, SALUD_SUITE];

/**
 * Proveedores de una suite. Se registran en la ruta, así cada suite tiene su
 * propia instancia de estado, persistencia y UI, aislada de las demás.
 */
export function provideSuite(config: SuiteConfig): Provider[] {
  return [
    { provide: SUITE_CONFIG, useValue: config },
    ReportStorageService,
    ReportStateService,
    ReportMetricsService,
    CsvExportService,
    ReportUiService,
  ];
}
