import { Pipe, PipeTransform } from '@angular/core';

import { fmt, pctTxt, signed } from '../../core/utils/format.utils';

/** `{{ 1234 | fmt }}` → "1,234" (locale es-DO). */
@Pipe({ name: 'fmt' })
export class FmtPipe implements PipeTransform {
  transform(n: number | null | undefined): string {
    return fmt(n);
  }
}

/** `{{ -3 | signed }}` → "−3". */
@Pipe({ name: 'signed' })
export class SignedPipe implements PipeTransform {
  transform(n: number): string {
    return signed(n);
  }
}

/** `{{ part | pct: base }}` → "12.5%" o "—" si la base es 0. */
@Pipe({ name: 'pct' })
export class PctPipe implements PipeTransform {
  transform(part: number, base: number): string {
    return pctTxt(part, base);
  }
}
