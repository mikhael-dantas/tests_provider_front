import { extendTheme } from '@chakra-ui/react'

const fonts = { mono: `'Menlo', monospace` }

const cTheme = extendTheme({
  semanticTokens: {
    colors: {
      text: {
        default: '#16161D',
        _dark: '#ade3b8',
      },
      heroGradientStart: {
        default: '#7928CA',
        _dark: '#e3a7f9',
      },
      heroGradientEnd: {
        default: '#FF0080',
        _dark: '#fbec8f',
      },
    },
    radii: {
      button: '12px',
    },
  },
  colors: {
    black: '#16161D',
  },
  fonts,
})

export default cTheme

export const customTheme = {
  colors: {
    lightGreen5: '#a0ffb0',
    lightGreen6: '#00e676',
    darkGreen5: '#4CAF50',
    darkGreen5hover: '#3e8e41',
  }
} as {
  colors: {
    lightGreen5: string;
    lightGreen6: string;
    darkGreen5: string;
    darkGreen5hover: string;
  }
}