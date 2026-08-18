import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { providePrimeNG } from 'primeng/config';

import { faroPreset } from './faro.preset';

export function provideFaroPrimeNG(): EnvironmentProviders {
  return makeEnvironmentProviders([
    providePrimeNG({
      ripple: true,
      theme: {
        preset: faroPreset,
        options: {
          darkModeSelector: 'none',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng, components, utilities'
          }
        }
      }
    })
  ]);
}
