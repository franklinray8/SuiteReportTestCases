# SuiteReportTestCases

Reportes de Casos Automatizados por suite, cada una en su propia página:

- **Vida** (`#/vida`): por sucursal, plan y tipo de producto (Contribución, Suma Asegurada, Acumulación).
- **Salud** (`#/salud`): por país y plan.

Ionic 8 + Angular 21 (standalone, signals, router), TypeScript, SCSS.

## Comandos

```bash
npm install
npm start          # http://localhost:4200
npm run build      # salida en www/
```

Requiere Node 22.12+ o 24+.

## Arquitectura

Un solo motor de reporte (estado, cálculos, persistencia y componentes) que se configura por suite.
Cada ruta registra los servicios de su suite con `provideSuite()`, así cada una tiene su estado y su
clave de `localStorage` aislados: editar o cerrar el período en Salud no toca Vida, y al revés.

```
src/
├── main.ts                      arranque (Ionic + Angular + router con hash)
├── index.html
├── global.scss                  CSS base de Ionic, botones, reglas de impresión
├── theme/variables.scss         paleta y variables de Ionic
└── app/
    ├── app.component.ts         <ion-app> + <router-outlet>
    ├── app.routes.ts            una ruta por suite
    ├── core/                    lógica, sin UI
    │   ├── models/              interfaces: reporte (report.models) y suite (suite.models)
    │   ├── suites/              configuración de cada suite + provideSuite() + token
    │   │   ├── vida.suite.ts
    │   │   └── salud.suite.ts
    │   ├── data/
    │   │   ├── vida/            sucursales, planes, tipos y semillas de Vida
    │   │   └── salud/           países y planes de Salud
    │   ├── utils/               funciones puras: cálculos, formato, CSV, fechas
    │   └── services/            una instancia por suite
    │       ├── report-state     estado (signals) y acciones: editar, reiniciar, cerrar período
    │       ├── report-metrics   totales derivados (computed)
    │       ├── report-storage   localStorage + migración del modelo anterior
    │       ├── csv-export       descarga del CSV
    │       └── report-ui        vista activa y abrir/cerrar grupos
    ├── shared/
    │   ├── pipes/               fmt, signed, pct
    │   └── components/          stat-card, delta-chip
    └── features/report/
        ├── report.page.*        compone la pantalla (la misma para todas las suites)
        └── components/          toolbar, hero, totals-strip, tipo-summary,
                                 report-tabs, summary-table, detail-view, branch-detail
```

## Cálculos (iguales en todas las suites)

Definidos en `core/utils/report-calculations.utils.ts`:

- **Actual** = Anterior + Nuevos
- **Crecimiento** = Nuevos / Anterior
- **Mantenimiento** = Actualizado / Anterior
- **Casos trabajados** = Nuevos + Actualizado

## Tareas comunes

| Quiero… | Edito |
|---|---|
| Agregar/quitar una sucursal o plan de Vida | `core/data/vida/branches.data.ts` |
| Agregar/quitar un país o plan de Salud | `core/data/salud/paises.data.ts` |
| Cambiar títulos, etiquetas o tipos de una suite | `core/suites/<suite>.suite.ts` |
| Agregar una suite nueva | crear `core/suites/<nueva>.suite.ts`; sumarla a `SUITES` en `suite.providers.ts`, a `SuiteId` en `suite.models.ts` y a `app.routes.ts` |

> Los datos se guardan solo en el `localStorage` del navegador (claves `reporteSuiteBMI_v1` para Vida y
> `reporteSuiteBMI_salud_v1` para Salud). No cambies `storage.key` ni `storage.version` de una suite
> existente: el navegador dejaría de encontrar lo ya capturado. Usa **CSV** como respaldo.
