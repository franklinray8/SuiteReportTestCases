import { Tipo, ValuesByTipo } from '../models/report.models';

/** Literal de string TS con comillas simples. */
function quote(s: string): string {
  return "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

/**
 * Genera el contenido completo de un archivo `seed.data.ts` con los planes que
 * tienen algún valor distinto de cero. Listo para reemplazar el archivo existente.
 */
export function buildSeedFile(
  constName: string,
  suiteNombre: string,
  tipos: readonly Tipo[],
  values: ValuesByTipo,
  fecha: string,
): string {
  const lines = [
    "import { PlanValues, TipoKey } from '../../models/report.models';",
    '',
    `/** Valores iniciales de ${suiteNombre}. Generado desde la app (Datos → Copiar como semilla), período ${fecha}. */`,
    `export const ${constName}: Partial<Record<TipoKey, PlanValues>> = {`,
  ];
  for (const t of tipos) {
    const entries = Object.entries(values[t.key] ?? {}).filter(([, v]) => v.a || v.nu || v.up);
    if (!entries.length) continue;
    lines.push(`  ${t.key}: {`);
    for (const [k, v] of entries) lines.push(`    ${quote(k)}: { a: ${v.a}, nu: ${v.nu}, up: ${v.up} },`);
    lines.push('  },');
  }
  lines.push('};', '');
  return lines.join('\n');
}
