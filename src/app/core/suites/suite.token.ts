import { InjectionToken } from '@angular/core';

import { SuiteConfig } from '../models/suite.models';

/** Configuración de la suite activa; la provee cada ruta con `provideSuite()`. */
export const SUITE_CONFIG = new InjectionToken<SuiteConfig>('SUITE_CONFIG');
