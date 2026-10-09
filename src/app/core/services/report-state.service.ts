import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';

import { AUTOSAVE_DELAY_MS } from '../data/storage.config';
import { PlanField, PlanValue, ReportState, TipoKey, ValuesByTipo } from '../models/report.models';
import { SUITE_CONFIG } from '../suites/suite.token';
import { todayIso } from '../utils/date.utils';
import { planKey } from '../utils/plan.utils';
import { ReportStorageService, emptyValues } from './report-storage.service';

const ZERO: PlanValue = { a: 0, nu: 0, up: 0 };

/** Fuente única de verdad de una suite: valores por plan, período y tipo activo. */
@Injectable()
export class ReportStateService {
  private readonly storage = inject(ReportStorageService);
  private saveTimer?: ReturnType<typeof setTimeout>;

  readonly suite = inject(SUITE_CONFIG);
  readonly branches = this.suite.grupos;
  readonly tipos = this.suite.tipos;
  /** Con un solo tipo, la UI no muestra selector ni desglose por tipo. */
  readonly hasTipos = this.tipos.length > 1;

  readonly currentTipo = signal<TipoKey>(this.tipos[0].key);
  readonly currentTipoLabel = computed(() => this.tipoLabel(this.currentTipo()));
  readonly fecha = signal<string>(todayIso());
  readonly values = signal(emptyValues(this.tipos));
  readonly status = signal<string>('');

  constructor() {
    const s = this.storage.load();
    this.fecha.set(s.fecha || todayIso());
    this.values.set(s.values);
    // no perder la última edición si se cierra la pestaña antes del autosave
    const win = inject(DOCUMENT).defaultView;
    const flush = () => this.flushPendingSave();
    win?.addEventListener('pagehide', flush);
    inject(DestroyRef).onDestroy(() => {
      win?.removeEventListener('pagehide', flush);
      flush();
    });
  }

  /** Valor guardado del plan o, si nunca se editó, su semilla. */
  getValue(tipo: TipoKey, code: string, plan: string): PlanValue {
    const k = planKey(code, plan);
    return this.values()[tipo]?.[k] ?? this.suite.seed[tipo]?.[k] ?? ZERO;
  }

  setField(code: string, plan: string, field: PlanField, value: number): void {
    const tipo = this.currentTipo();
    const k = planKey(code, plan);
    const current = this.getValue(tipo, code, plan);
    this.values.update((all) => ({
      ...all,
      [tipo]: { ...all[tipo], [k]: { ...current, [field]: value } },
    }));
    this.scheduleSave();
  }

  setTipo(tipo: TipoKey): void {
    if (this.tipos.some((t) => t.key === tipo)) this.currentTipo.set(tipo);
  }

  setFecha(fecha: string): void {
    this.fecha.set(fecha);
    this.scheduleSave();
  }

  /** Descarta lo guardado y vuelve a los datos semilla. */
  reset(): void {
    this.values.set(emptyValues(this.tipos));
    this.fecha.set(todayIso());
    this.saveNow('Reiniciado');
  }

  /** Cerrar período: Actual pasa a Anterior y se limpian Nuevos / Actualizado en todos los tipos. */
  rollForward(): void {
    const next = this.effectiveValues();
    for (const plans of Object.values(next)) {
      for (const [k, v] of Object.entries(plans)) plans[k] = { a: v.a + v.nu, nu: 0, up: 0 };
    }
    this.values.set(next);
    this.fecha.set(todayIso());
    this.saveNow('Período cerrado');
  }

  /** Reemplaza valores y período de una vez (p. ej. al importar un respaldo). */
  replaceAll(state: ReportState, message: string): void {
    this.values.set(state.values);
    this.fecha.set(state.fecha);
    this.saveNow(message);
  }

  /** Valor efectivo (guardado o semilla) de cada plan de la suite, en todos los tipos. */
  effectiveValues(): ValuesByTipo {
    const out = emptyValues(this.tipos);
    for (const t of this.tipos) {
      for (const b of this.branches) {
        for (const plan of b.productos) out[t.key][planKey(b.code, plan)] = { ...this.getValue(t.key, b.code, plan) };
      }
    }
    return out;
  }

  notify(message: string): void {
    this.status.set(message);
  }

  private tipoLabel(key: TipoKey): string {
    return this.tipos.find((t) => t.key === key)?.label ?? key;
  }

  private snapshot(): ReportState {
    return { version: this.suite.storage.version, fecha: this.fecha(), values: this.values() };
  }

  private scheduleSave(): void {
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      this.saveTimer = undefined;
      const ok = this.storage.save(this.snapshot());
      this.notify(ok ? 'Guardado' : 'Sin guardar (el navegador bloqueó el almacenamiento)');
    }, AUTOSAVE_DELAY_MS);
  }

  private saveNow(message: string): void {
    clearTimeout(this.saveTimer);
    this.saveTimer = undefined;
    this.storage.save(this.snapshot());
    this.notify(message);
  }

  private flushPendingSave(): void {
    if (this.saveTimer === undefined) return;
    clearTimeout(this.saveTimer);
    this.saveTimer = undefined;
    this.storage.save(this.snapshot());
  }
}
