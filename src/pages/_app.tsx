import { ChakraProvider } from '@chakra-ui/react'

import theme from '../theme'
import { AppProps } from 'next/app'
import '../style.css';
import { UcfrsProvider } from '../ucfrsContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <UcfrsProvider>
        <Component {...pageProps} />
      </UcfrsProvider>
    </ChakraProvider>
  )
}

export default MyApp
