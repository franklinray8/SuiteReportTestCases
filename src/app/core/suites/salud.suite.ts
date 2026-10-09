import { PAISES_SALUD } from '../data/salud/paises.data';
import { SuiteConfig } from '../models/suite.models';

export const SALUD_SUITE: SuiteConfig = {
  id: 'salud',
  nombre: 'Salud',
  titulo: 'Reporte de Casos Automatizados de Salud',
  subtitulo: 'Por país y plan',
  grupo: { singular: 'País', plural: 'países' },
  grupos: PAISES_SALUD,
  // Salud no se divide por tipo de producto.
  tipos: [{ key: 'GENERAL', label: 'Salud' }],
  seed: {},
  storage: {
    key: 'reporteSuiteBMI_salud_v1',
    version: 'salud-2026-10-09',
  },
  csvPrefix: 'reporte-suite-salud',
};
