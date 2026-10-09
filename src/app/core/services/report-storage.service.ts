import { Injectable, inject } from '@angular/core';

import { PlanValue, PlanValues, ReportState, Tipo, ValuesByTipo } from '../models/report.models';
import { SUITE_CONFIG } from '../suites/suite.token';
import { todayIso } from '../utils/date.utils';

export function emptyValues(tipos: readonly Tipo[]): ValuesByTipo {
  const values: ValuesByTipo = {};
  for (const t of tipos) values[t.key] = {};
  return values;
}

/** Persistencia en localStorage de la suite activa, con migración del modelo anterior. */
@Injectable()
export class ReportStorageService {
  private readonly suite = inject(SUITE_CONFIG);

  freshState(): ReportState {
    return { version: this.suite.storage.version, fecha: todayIso(), values: emptyValues(this.suite.tipos) };
  }

  load(): ReportState {
    const raw = this.read();
    const state = this.parse(raw);
    if (!state) return this.freshState();
    // si venía del modelo anterior, se guarda ya migrado
    if ((raw as { version?: unknown }).version !== state.version) this.save(state);
    return state;
  }

  /**
   * Valida y normaliza un estado guardado (localStorage o archivo de respaldo).
   * Devuelve null si no es de una versión conocida. Solo conserva enteros >= 0.
   */
  parse(saved: unknown): ReportState | null {
    if (!saved || typeof saved !== 'object') return null;
    const raw = saved as { version?: unknown; fecha?: unknown; values?: unknown };
    const fecha = typeof raw.fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.fecha) ? raw.fecha : todayIso();
    const { version, legacyVersion } = this.suite.storage;

    if (raw.version === version) {
      const values = emptyValues(this.suite.tipos);
      const src = (raw.values && typeof raw.values === 'object' ? raw.values : {}) as Record<string, unknown>;
      for (const t of this.suite.tipos) values[t.key] = sanitizeValues(src[t.key]);
      return { version, fecha, values };
    }

    if (legacyVersion && raw.version === legacyVersion) {
      // modelo plano anterior (sin tipo): va al primer tipo de la suite
      const values = { ...emptyValues(this.suite.tipos), [this.suite.tipos[0].key]: sanitizeValues(raw.values) };
      return { version, fecha, values };
    }

    return null;
  }

  save(state: ReportState): boolean {
    try {
      localStorage.setItem(this.suite.storage.key, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  }

  private read(): unknown {
    try {
      const r = localStorage.getItem(this.suite.storage.key);
      return r ? JSON.parse(r) : null;
    } catch {
      return null;
    }
  }
}

/** Descarta entradas mal formadas: solo enteros >= 0 en a / nu / up. */
function sanitizeValues(input: unknown): PlanValues {
  const out: PlanValues = {};
  if (!input || typeof input !== 'object') return out;
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (!v || typeof v !== 'object') continue;
    const pv = v as Record<string, unknown>;
    out[k] = { a: toCount(pv['a']), nu: toCount(pv['nu']), up: toCount(pv['up']) } satisfies PlanValue;
  }
  return out;
}

function toCount(n: unknown): number {
  return typeof n === 'number' && Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}
