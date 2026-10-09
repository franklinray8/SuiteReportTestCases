/** Clave de un tipo de producto (p. ej. `CONTRIBUCION`). Cada suite define los suyos. */
export type TipoKey = string;

export interface Tipo {
  key: TipoKey;
  label: string;
}

/** Agrupador de planes: una sucursal en Vida, un país en Salud. */
export interface Branch {
  code: string;
  /** Nombre descriptivo; vacío cuando el código ya es el nombre (p. ej. un país). */
  nombre: string;
  productos: string[];
}

/** Campos editables de un plan: Anterior, Nuevos y Actualizado. */
export interface PlanValue {
  a: number;
  nu: number;
  up: number;
}

export type PlanField = keyof PlanValue;

/** Valores por plan, indexados por `CODIGO||Plan`. */
export type PlanValues = Record<string, PlanValue>;

export type ValuesByTipo = Record<TipoKey, PlanValues>;

export interface ReportState {
  version: string;
  fecha: string;
  values: ValuesByTipo;
}

export interface BranchSummary {
  code: string;
  nombre: string;
  planes: number;
  a: number;
  ac: number;
  up: number;
  net: number;
  newPos: number;
}

export interface ReportTotals {
  ant: number;
  act: number;
  upd: number;
  newPos: number;
  planes: number;
  net: number;
  trabajados: number;
  sucursales: number;
}

export interface TipoTotal {
  key: TipoKey;
  label: string;
  actual: number;
}

export interface TipoTotals {
  items: TipoTotal[];
  total: number;
}
