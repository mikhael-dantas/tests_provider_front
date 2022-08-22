import { ChakraProvider } from '@chakra-ui/react'

import theme from '../theme'
import { AppProps } from 'next/app'
import './style.css';
import { UcfrsProvider } from '../UcfrsContext';
import { PopupProvider } from '../PopupContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <PopupProvider>
        <UcfrsProvider>
          <Component {...pageProps} />
        </UcfrsProvider>
      </PopupProvider>
    </ChakraProvider>
  )
}

export default MyApp
