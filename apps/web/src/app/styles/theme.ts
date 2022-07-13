import { extendTheme, Theme } from '@chakra-ui/react';
import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools';
import { theme } from '@chakra-ui/theme';

export default extendTheme({
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
    disableTransitionOnChange: false,
  },
  semanticTokens: {
    colors: {
      background: {
        default: 'white',
        _dark: 'gray.900',
      },
    },
  },
  colors: {
    primary: '#00B5D8',
    secondary: '#C395D5',
    dark: '#334A52',
    light: '#96AFB8',
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      'html, body': {
        margin: 0,
        boxSizing: 'border-box',
        bg: 'background',
        height: '100vh',
        fontFamily: 'Roboto, sans-serif',

        transitionProperty: 'background-color',
        transitionDuration: 'normal',
        lineHeight: 'base',
      },
      '#root': {
        height: '100%',
      },
    }),
  },
});
