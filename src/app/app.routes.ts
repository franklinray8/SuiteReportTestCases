import { Routes } from '@angular/router';

import { SuiteConfig } from './core/models/suite.models';
import { SALUD_SUITE } from './core/suites/salud.suite';
import { provideSuite } from './core/suites/suite.providers';
import { VIDA_SUITE } from './core/suites/vida.suite';
import { ReportPage } from './features/report/report.page';

/** Cada suite es una página propia con su estado aislado (proveedores a nivel de ruta). */
function suiteRoute(suite: SuiteConfig) {
  return { path: suite.id, title: suite.titulo, component: ReportPage, providers: provideSuite(suite) };
}

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: VIDA_SUITE.id },
  suiteRoute(VIDA_SUITE),
  suiteRoute(SALUD_SUITE),
  { path: '**', redirectTo: VIDA_SUITE.id },
];
