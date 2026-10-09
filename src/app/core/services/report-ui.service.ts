import { Injectable, signal } from '@angular/core';

export type ReportView = 'res' | 'det';

/** Estado de interfaz de una suite (vista activa, abrir/cerrar sucursales). */
@Injectable()
export class ReportUiService {
  readonly view = signal<ReportView>('res');
  readonly expanded = signal(true);

  /**
   * Orden de abrir/cerrar todas las sucursales. Se emite un objeto nuevo en cada
   * orden para que los `<details>` reaccionen aunque el valor se repita.
   */
  readonly openCommand = signal<{ open: boolean }>({ open: true });

  setAllOpen(open: boolean): void {
    this.openCommand.set({ open });
  }

  toggleExpanded(): void {
    this.expanded.update((e) => !e);
    this.setAllOpen(this.expanded());
  }
}
