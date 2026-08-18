import { definePreset } from '@primeuix/themes';
import type { BaseTokenSections } from '@primeuix/themes/types/base';
import aura from '@primeuix/themes/aura';

const shadowXs = '0 1px 2px rgba(14, 34, 93, 0.06)';
const shadowSm = '0 1px 3px rgba(14, 34, 93, 0.08), 0 2px 10px rgba(14, 34, 93, 0.05)';
const shadowMd = '0 4px 12px rgba(14, 34, 93, 0.1), 0 8px 24px rgba(14, 34, 93, 0.08)';
const shadowLg = '0 8px 20px rgba(14, 34, 93, 0.12), 0 16px 48px rgba(14, 34, 93, 0.1)';
const shadowFocus = '0 0 0 4px rgba(14, 34, 93, 0.12)';

const blue = {
  50: '#EDF7FF',
  100: '#D6EAFF',
  200: '#B5DCFF',
  300: '#83C8FF',
  400: '#48A9FF',
  500: '#0660FF',
  600: '#0046EF',
  700: '#083AC5',
  800: '#0D369B',
  900: '#0E225D',
  950: '#07112F'
};

const neutral = {
  0: '#FCFDFD',
  50: '#F4F6F7',
  100: '#D9D9D9',
  200: '#CAD2D7',
  300: '#A4B1BC',
  400: '#627485',
  500: '#4F5B6B',
  600: '#363B43',
  700: '#2C3037',
  800: '#272B31',
  900: '#21252B',
  950: '#15181C'
};

const success = {
  50: '#E6F6EC',
  100: '#B8ECCD',
  200: '#93E3B5',
  300: '#6EDB9C',
  400: '#4AD283',
  500: '#2ECC71',
  600: '#26B564',
  700: '#1E9E57',
  800: '#156F3D',
  900: '#115730',
  950: '#0C3F23'
};

const error = {
  50: '#FDECEA',
  100: '#F7BFBD',
  200: '#F29B99',
  300: '#ED7874',
  400: '#E95450',
  500: '#E53935',
  600: '#CE2B29',
  700: '#B71C1C',
  800: '#801414',
  900: '#650F0F',
  950: '#490B0B'
};

const warning = {
  50: '#FFF4E5',
  100: '#FDDFAF',
  200: '#FBCD83',
  300: '#F9BC57',
  400: '#F7AB2C',
  500: '#F59E0B',
  600: '#D5790A',
  700: '#B45309',
  800: '#7E3A06',
  900: '#632E05',
  950: '#482104'
};

const info = {
  50: '#EDF7FF',
  100: '#D6EAFF',
  200: '#B5DCFF',
  300: '#83C8FF',
  400: '#48A9FF',
  500: '#0660FF',
  600: '#0046EF',
  700: '#083AC5',
  800: '#0D369B',
  900: '#0E225D',
  950: '#07112F'
};

const cyan = {
  50: '#DCF9FD',
  100: '#B9F2FB',
  200: '#84E7F6',
  300: '#66E1F4',
  400: '#48DBF1',
  500: '#22D3EE',
  600: '#18BCDA',
  700: '#0EA5C6',
  800: '#0A748B',
  900: '#085B6D',
  950: '#06424F'
};

const purple = {
  50: '#E7E2FD',
  100: '#CFC5FB',
  200: '#B2A5F4',
  300: '#A193EF',
  400: '#9181EB',
  500: '#7C6AE6',
  600: '#6C5BD5',
  700: '#5B4BC4',
  800: '#403589',
  900: '#32296C',
  950: '#241E4E'
};

const lime = {
  50: '#ECF9DC',
  100: '#D9F2B8',
  200: '#BBE57F',
  300: '#AADD5F',
  400: '#99D63F',
  500: '#84CC16',
  600: '#75B812',
  700: '#65A30D',
  800: '#477209',
  900: '#385A07',
  950: '#284105'
};

const terracotta = {
  50: '#F1E4DC',
  100: '#E2C9B8',
  200: '#D2A07B',
  300: '#C98858',
  400: '#C07135',
  500: '#B45309',
  600: '#9F4908',
  700: '#8A3F06',
  800: '#612C04',
  900: '#4C2303',
  950: '#371902'
};

const palettes = {
  blue,
  neutral,
  green: success,
  red: error,
  orange: warning,
  yellow: warning,
  sky: info,
  cyan,
  purple,
  lime,
  terracotta
} as unknown as BaseTokenSections.Primitive;

export const faroPreset = definePreset(aura, {
  primitive: palettes,
  semantic: {
    typography: {
      lineHeight: '1.5',
      fontFamily: "'Montserrat', ui-sans-serif, system-ui, sans-serif",
      fontWeight: '400',
      fontSize: '0.9375rem'
    },
    transitionDuration: '0.2s',
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{blue.500}',
      offset: '2px',
      shadow: shadowFocus
    },
    disabledOpacity: '0.6',
    iconSize: '0.875rem',
    anchorGutter: '2px',
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
      color: '{blue.500}',
      contrastColor: '#FFFFFF',
      hoverColor: '{blue.600}',
      activeColor: '{blue.700}'
    },
    surface: {
      0: '{neutral.0}',
      50: '{neutral.50}',
      100: '{neutral.100}',
      200: '{neutral.200}',
      300: '{neutral.300}',
      400: '{neutral.400}',
      500: '{neutral.500}',
      600: '{neutral.600}',
      700: '{neutral.700}',
      800: '{neutral.800}',
      900: '{neutral.900}',
      950: '{neutral.950}'
    },
    highlight: {
      background: '{blue.50}',
      focusBackground: '{blue.100}',
      color: '{blue.700}',
      focusColor: '{blue.800}'
    },
    text: {
      color: '{neutral.900}',
      hoverColor: '{neutral.900}',
      mutedColor: '{neutral.500}',
      hoverMutedColor: '{neutral.600}'
    },
    content: {
      borderRadius: '8px',
      background: '{surface.0}',
      hoverBackground: '{surface.50}',
      borderColor: '{surface.200}',
      color: '{text.color}',
      hoverColor: '{text.hover.color}'
    },
    formField: {
      borderRadius: '8px'
    },
    overlay: {
      select: {
        shadow: shadowSm
      },
      popover: {
        shadow: shadowMd
      },
      modal: {
        borderRadius: '16px',
        shadow: shadowLg
      }
    }
  },
  components: {
    button: {
      root: {
        borderRadius: '9999px',
        roundedBorderRadius: '9999px',
        raisedShadow: shadowSm,
        label: {
          fontWeight: '600'
        }
      }
    },
    card: {
      root: {
        borderRadius: '16px',
        shadow: shadowSm
      }
    },
    chip: {
      root: {
        borderRadius: '8px'
      }
    },
    tag: {
      root: {
        borderRadius: '8px'
      }
    }
  }
});
