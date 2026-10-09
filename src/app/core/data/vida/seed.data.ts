import { PlanValues, TipoKey } from '../../models/report.models';

/**
 * Semillas iniciales por tipo:
 * 36 Best Indexed NASDAQ + 36 Best Indexed S&P 500 en LAF para Suma Asegurada.
 */
export const SEED_VIDA: Partial<Record<TipoKey, PlanValues>> = {
  CONTRIBUCION: {
    'LAF||TERM NRC': { a: 5, nu: 0, up: 0 },
  },
  SUMA_ASEGURADA: {
    'LAF||Best Indexed BMII S&P 500': { a: 36, nu: 0, up: 0 },
    'LAF||Best Indexed BMII NASDAQ': { a: 36, nu: 0, up: 0 },
  },
};
