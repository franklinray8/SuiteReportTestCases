import { Branch } from '../../models/report.models';

/** Sucursales de Vida y sus planes. */
export const SUCURSALES_VIDA: readonly Branch[] = [
  {
    code: 'LAF',
    nombre: 'Latin America Financial',
    productos: [
      'Best Indexed BMII S&P 500', 'Best Indexed BMII NASDAQ',
      'Best Indexed 100 BMII S&P 500', 'Best Indexed 100 BMII NASDAQ',
      'Lifetime', 'NOVA II', 'TERM NRNC', 'TERM NRC', 'TERM R&C', 'TERM 95', 'TERM 100', 'HORIZON',
    ],
  },
  {
    code: 'COF',
    nombre: 'Colombia Financial',
    productos: [
      'Temporal Deudor', 'Best Indexed BMI S&P 500', 'Best Indexed BMI NASDAQ',
      'NOVA', 'TERM 100', 'HORIZON',
    ],
  },
  {
    code: 'ASF',
    nombre: 'Asia Financial',
    productos: [
      'Best Indexed BMII S&P 500', 'Best Indexed BMII NASDAQ',
      'Best Indexed Plus S&P 500', 'Best Indexed Plus NASDAQ',
      'LifeTime', 'NOVA II', 'HORIZON',
      'Single Contribution Annuity', 'Regular Contribution Annuity',
    ],
  },
  {
    code: 'CRF',
    nombre: 'Caribbean Financial',
    productos: [
      'NOVA II', 'TermPlus 100',
      'Best Indexed BMI S&P 500', 'Best Indexed BMI NASDAQ',
      'Best Indexed 100 BMI S&P 500', 'Best Indexed 100 BMI NASDAQ',
    ],
  },
  {
    code: 'GTF',
    nombre: 'Guatemala Financial',
    productos: ['LifeTime', 'NOVA II', 'Term 100(LB)', 'Term 100(HB)', 'Term 50'],
  },
  {
    code: 'BRZL',
    nombre: 'Brazil',
    productos: ['Best Indexed Shield S&P 500', 'Best Indexed Shield NASDAQ'],
  },
];
