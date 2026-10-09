import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FmtPipe } from '../../pipes/format.pipes';

export type StatIndicator = 'ant' | 'act' | 'upd' | 'work';

/** Tarjeta de KPI: rótulo, número grande y una línea de detalle proyectada. */
@Component({
  selector: 'app-stat-card',
  imports: [FmtPipe],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.hl]': 'highlight()' },
})
export class StatCardComponent {
  readonly caption = input.required<string>();
  readonly value = input.required<number>();
  readonly indicator = input<StatIndicator>('ant');
  readonly highlight = input(false);
}
