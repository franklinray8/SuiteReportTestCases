import { Branch, PlanValues, Tipo, TipoKey } from './report.models';

export type SuiteId = 'vida' | 'salud';

/**
 * Todo lo que distingue a una suite (Vida, Salud…). El motor del reporte
 * (estado, cálculos, persistencia, componentes) es el mismo para todas.
 */
export interface SuiteConfig {
  id: SuiteId;
  /** Nombre corto para la navegación: "Vida". */
  nombre: string;
  titulo: string;
  subtitulo: string;
  /** Cómo se llama el agrupador de planes en la UI. */
  grupo: { singular: string; plural: string };
  grupos: readonly Branch[];
  /** Al menos uno. Con uno solo se ocultan el selector y el resumen por tipo. */
  tipos: readonly Tipo[];
  seed: Partial<Record<TipoKey, PlanValues>>;
  /** Dónde vive la semilla en el código; lo usa "Copiar como semilla". */
  seedSource: { file: string; constName: string };
  storage: {
    key: string;
    version: string;
    /** Versión del modelo plano anterior (sin tipo); se migra al primer tipo. */
    legacyVersion?: string;
  };
  /** Prefijo de los archivos descargados (CSV y respaldo). */
  filePrefix: string;
}
