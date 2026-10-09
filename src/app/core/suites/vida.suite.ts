import { SUCURSALES_VIDA } from '../data/vida/branches.data';
import { SEED_VIDA } from '../data/vida/seed.data';
import { TIPOS_VIDA } from '../data/vida/tipos.data';
import { SuiteConfig } from '../models/suite.models';

export const VIDA_SUITE: SuiteConfig = {
  id: 'vida',
  nombre: 'Vida',
  titulo: 'Reporte de Casos Automatizados de Vida',
  subtitulo: 'Por sucursal y plan',
  grupo: { singular: 'Sucursal', plural: 'sucursales' },
  grupos: SUCURSALES_VIDA,
  tipos: TIPOS_VIDA,
  seed: SEED_VIDA,
  // Claves heredadas: no cambiarlas o se pierde lo ya capturado en el navegador.
  storage: {
    key: 'reporteSuiteBMI_v1',
    version: 'modelo-tipos-2026-09-21',
    legacyVersion: 'modelo-nuevos-2026-08-06',
  },
  csvPrefix: 'reporte-suite-vida',
};
