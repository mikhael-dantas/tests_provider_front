import { ChakraProvider, theme } from "@chakra-ui/react"
import { AlertStackProvider } from "@myContexts/AlertStackContext"
import { UcfrsProvider } from "@myContexts/UcfrsContext"
import { AppProps } from "next/app"

import './styles.css'

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
