import { Branch } from '../../models/report.models';

const SIN_EEUU = '(Sin Cobertura en EE.UU.)';

/** Portafolio estándar: la mayoría de los países. */
const ESTANDAR = ['Azure', 'Flexi Plan III America Latina', 'Ideal', 'Meridian II', 'Serie 3000'];

/** Estándar + Core Advantage. */
const CON_CORE_ADVANTAGE = ['Azure', 'Core Advantage', 'Flexi Plan III America Latina', 'Ideal', 'Meridian II', 'Serie 3000'];

/** Sin Flexi Plan. */
const BASICO = ['Azure', 'Ideal', 'Meridian II', 'Serie 3000'];

/** Estándar + variantes sin cobertura en EE.UU. */
const CON_SIN_EEUU = [
  'Azure', `Azure${SIN_EEUU}`, 'Flexi Plan III America Latina',
  'Ideal', `Ideal ${SIN_EEUU}`, 'Meridian II', `Meridian II ${SIN_EEUU}`,
  'Serie 3000', `Serie 3000 ${SIN_EEUU}`,
];

/** México: MediProtect en lugar de Flexi Plan, con variantes sin cobertura en EE.UU. */
const MEXICO = [
  'Azure', `Azure${SIN_EEUU}`, 'MediProtect',
  'Ideal', `Ideal ${SIN_EEUU}`, 'Meridian II', `Meridian II ${SIN_EEUU}`,
  'Serie 3000', `Serie 3000 ${SIN_EEUU}`,
];

const PERU = [
  'Azure', `Azure${SIN_EEUU}`, 'Core Advantage', 'Flexi Plan III America Latina',
  'Ideal', `Ideal ${SIN_EEUU}`, 'Meridian II', `Meridian II ${SIN_EEUU}`,
  'Serie 3000', `Serie 3000 ${SIN_EEUU}`,
];

const VENEZUELA = [
  'Azure', 'Core', 'Flexi Plan III America Latina', 'Ideal',
  'MediPlan 100', 'MediPlan 250', 'Meridian II', 'Serie 3000',
];

function pais(code: string, productos: readonly string[]): Branch {
  return { code, nombre: '', productos: [...productos] };
}

/** Países de Salud y sus planes, en orden alfabético. */
export const PAISES_SALUD: readonly Branch[] = [
  pais('ANGUILA', ESTANDAR),
  pais('ANTIGUA Y BARBUDA', ESTANDAR),
  pais('ARGENTINA', ESTANDAR),
  pais('ARUBA', ESTANDAR),
  pais('BAHAMAS', ESTANDAR),
  pais('BARBADOS', ESTANDAR),
  pais('BELICE', ESTANDAR),
  pais('BERMUDAS', ESTANDAR),
  pais('BOLIVIA', ESTANDAR),
  pais('BONAIRE', ESTANDAR),
  pais('CHILE', CON_CORE_ADVANTAGE),
  pais('CURAZAO', ESTANDAR),
  pais('DOMINICA', ESTANDAR),
  pais('EL SALVADOR', CON_SIN_EEUU),
  pais('GRANADA', ESTANDAR),
  pais('GUADALUPE', ESTANDAR),
  pais('GUAYANA FRANCESA', ESTANDAR),
  pais('GUYANA', ESTANDAR),
  pais('HAITI', BASICO),
  pais('HONDURAS', CON_SIN_EEUU),
  pais('ISLAS CAIMAN', ESTANDAR),
  pais('ISLAS TURCAS Y CAICOS', ESTANDAR),
  pais('ISLAS VIRGENES BRITANICAS', ESTANDAR),
  pais('JAMAICA', ESTANDAR),
  pais('MARTINICA', ESTANDAR),
  pais('MEXICO', MEXICO),
  pais('MEXICO-JALISCO', MEXICO),
  pais('MEXICO-QUINTANA ROO', MEXICO),
  pais('MONTSERRAT', ESTANDAR),
  pais('NICARAGUA', CON_SIN_EEUU),
  pais('PANAMA', ESTANDAR),
  pais('PARAGUAY', CON_CORE_ADVANTAGE),
  pais('PERU', PERU),
  pais('RELOCATION', BASICO),
  pais('SAN BARTOLOME', ESTANDAR),
  pais('SAN CRISTOBAL Y NIEVES', ESTANDAR),
  pais('SAN MARTIN', ESTANDAR),
  pais('SAN VICENTE Y LAS GRANADINAS', ESTANDAR),
  pais('SANTA LUCIA', ESTANDAR),
  pais('SURINAM', ESTANDAR),
  pais('TRINIDAD Y TOBAGO', ESTANDAR),
  pais('URUGUAY', ESTANDAR),
  pais('VENEZUELA', VENEZUELA),
];
