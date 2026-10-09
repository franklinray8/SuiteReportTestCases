import { PAISES_SALUD } from '../data/salud/paises.data';
import { SEED_SALUD } from '../data/salud/seed.data';
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
  seed: SEED_SALUD,
  seedSource: { file: 'src/app/core/data/salud/seed.data.ts', constName: 'SEED_SALUD' },
  storage: {
    key: 'reporteSuiteBMI_salud_v1',
    version: 'salud-2026-10-09',
  },
  filePrefix: 'reporte-suite-salud',
};
