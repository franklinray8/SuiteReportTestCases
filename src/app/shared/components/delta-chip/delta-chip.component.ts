import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { trend } from '../../../core/utils/format.utils';
import { SignedPipe } from '../../pipes/format.pipes';

/** Pastilla verde / roja / gris con el valor con signo. */
@Component({
  selector: 'app-delta-chip',
  imports: [SignedPipe],
  template: `<span class="chip" [class]="trend()">{{ value() | signed }}</span>`,
  styleUrl: './delta-chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeltaChipComponent {
  readonly value = input.required<number>();
  protected readonly trend = computed(() => trend(this.value()));
}
