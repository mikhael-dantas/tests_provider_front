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
    10: '#ececec',
    20: '#d1d1d1',
    30: '#b0b0b0',
    45: '#858585',
    60: '#5f5f5f',
    80: '#2d2d2d',
    95: '#101010',
  }
} as {
  colors: {
    10: string,
    20: string,
    30: string,
    45: string,
    60: string,
    80: string,
    95: string,
  }
}