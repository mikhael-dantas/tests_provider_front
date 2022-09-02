import { ChakraProvider } from '@chakra-ui/react'

import theme from '../theme'
import { AppProps } from 'next/app'
import './style.css';
import { UcfrsProvider } from '../UcfrsContext';
import { AlertStackProvider } from '../AlertStackContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AlertStackProvider>
        <UcfrsProvider>
          <Component {...pageProps} />
        </UcfrsProvider>
      </AlertStackProvider>
    </ChakraProvider>
  )
}

export default MyApp
