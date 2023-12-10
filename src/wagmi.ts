import { alchemyProvider } from 'wagmi/providers/alchemy'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig } from 'wagmi'
import { sepolia, mainnet } from 'wagmi/chains'

import { publicProvider } from 'wagmi/providers/public'

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "" }),
    publicProvider(),
  ],
)

const { connectors } = getDefaultWallets({
  appName: 'Voting System',
  chains,
  projectId: walletConnectProjectId,
})

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export { chains }