import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { ChakraProvider, Flex } from '@chakra-ui/react'
import '@fontsource/courier-prime'
import '@fontsource/lato'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { WagmiProvider } from 'wagmi'

import { chains, wagmiClient } from 'utils/rainbow'

import 'styles/globals.css'
import { rainbowTheme, theme } from 'styles/theme'

function App({ Component, pageProps }: AppProps): JSX.Element {
    const { route } = useRouter()

    const Layout = dynamic(() => import('components/Layout'))

    return (
        <ChakraProvider theme={theme}>
            <WagmiProvider client={wagmiClient}>
                <RainbowKitProvider chains={chains} theme={rainbowTheme}>
                    <Flex bgColor="brand.100opaque" width="100%" minH="100vh">
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </Flex>
                </RainbowKitProvider>
            </WagmiProvider>
        </ChakraProvider>
    )
}

export default App
