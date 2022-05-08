import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { ChakraProvider, extendTheme, Flex } from '@chakra-ui/react'
import '@fontsource/courier-prime'
import '@fontsource/lato'
import {
    apiProvider,
    configureChains,
    darkTheme,
    getDefaultWallets,
    RainbowKitProvider,
    Theme,
} from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { chain, createClient, WagmiProvider } from 'wagmi'

import { ALCHEMY_PROJECT_ID } from 'utils/constants'

// import Layout from 'components/Layout';
// import EthereumProvider from '../providers/EthereumProvider';
import '../styles/globals.css'
import { theme } from '../styles/theme'

const { provider, chains } = configureChains(
    [chain.mainnet],
    [apiProvider.alchemy(ALCHEMY_PROJECT_ID), apiProvider.fallback()],
)

const { connectors } = getDefaultWallets({ appName: 'Onoma', chains })

const wagmiClient = createClient({
    autoConnect: true,
    provider,
    connectors,
})

const myTheme = darkTheme({
    accentColor: '#2C5282', // brand.700
    accentColorForeground: '#EBF8FF', // brand.50
    borderRadius: 'large',
})

myTheme.colors.connectButtonBackground = '#2C5282' // brand.700
myTheme.colors.connectButtonText = '#EBF8FF' // brand.50
myTheme.colors.modalText = '#EBF8FF' // brand.50
myTheme.colors.modalBackground = '#1A365D' // brand.900
myTheme.colors.modalTextSecondary = '#EBF8FF' // brand.50
myTheme.radii.connectButton = '100px'
// myTheme.colors.modalBackdrop = 'red'

const bgSize = ['100px', '120px', '220px', '300px']

function App({ Component, pageProps }: AppProps): JSX.Element {
    const { route } = useRouter()

    const Layout = dynamic(() => import('components/Layout'))

    return (
        <ChakraProvider theme={theme}>
            <WagmiProvider client={wagmiClient}>
                <RainbowKitProvider chains={chains} theme={myTheme}>
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
