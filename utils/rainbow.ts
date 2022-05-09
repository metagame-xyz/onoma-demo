import { apiProvider, configureChains, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { chain, createClient } from 'wagmi'

import { ALCHEMY_PROJECT_ID } from 'utils/constants'

const { provider, chains } = configureChains(
    [chain.mainnet],
    [apiProvider.alchemy(ALCHEMY_PROJECT_ID), apiProvider.fallback()],
)

const { connectors } = getDefaultWallets({ appName: 'Onoma', chains })

const wagmiClient = createClient({
    autoConnect: false,
    provider,
    connectors,
})

export { wagmiClient, chains }
