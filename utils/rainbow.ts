import { apiProvider, configureChains, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { chain, createClient, WagmiProvider } from 'wagmi'

import { ALCHEMY_PROJECT_ID } from 'utils/constants'

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

export { wagmiClient, chains }
