import {
  ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, input, viewChild,
} from '@angular/core';

import { Branch, BranchSummary, PlanField } from '../../../../core/models/report.models';
import { ReportStateService } from '../../../../core/services/report-state.service';
import { ReportUiService } from '../../../../core/services/report-ui.service';
import { matchesGroup, matchesPlan } from '../../../../core/utils/plan.utils';
import { planActual } from '../../../../core/utils/report-calculations.utils';
import { DeltaChipComponent } from '../../../../shared/components/delta-chip/delta-chip.component';
import { FmtPipe, PctPipe, SignedPipe } from '../../../../shared/pipes/format.pipes';

/** Una sucursal / país desplegable con sus planes editables. */
@Component({
  selector: 'app-branch-detail',
  imports: [DeltaChipComponent, FmtPipe, PctPipe, SignedPipe],
  templateUrl: './branch-detail.component.html',
  styleUrl: './branch-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': 'hasMatches() ? null : "none"' },
})
export class BranchDetailComponent {
  private readonly state = inject(ReportStateService);
  private readonly ui = inject(ReportUiService);

  readonly branch = input.required<Branch>();
  readonly summary = input.required<BranchSummary>();
  readonly query = input('');

  private readonly details = viewChild.required<ElementRef<HTMLDetailsElement>>('details');

  protected readonly rows = computed(() => {
    const b = this.branch();
    const tipo = this.state.currentTipo();
    const q = this.query();
    // si el filtro coincide con el grupo, se muestran todos sus planes
    const groupHit = matchesGroup(b.code, b.nombre, q);
    return b.productos.map((plan) => {
      const v = this.state.getValue(tipo, b.code, plan);
      return { plan, v, actual: planActual(v), visible: groupHit || matchesPlan(plan, q) };
    });
  });

  protected readonly hasMatches = computed(() => this.rows().some((r) => r.visible));

  constructor() {
    effect(() => this.setOpen(this.ui.openCommand().open));
    effect(() => {
      if (this.query().trim()) this.setOpen(true);
    });
  }

  protected onInput(plan: string, field: PlanField, event: Event): void {
    let val = parseInt((event.target as HTMLInputElement).value, 10);
    if (isNaN(val) || val < 0) val = 0;
    this.state.setField(this.branch().code, plan, field, val);
  }

  private setOpen(open: boolean): void {
    this.details().nativeElement.open = open;
  }
}
