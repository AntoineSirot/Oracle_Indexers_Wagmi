import { ConnectButton } from '../components/ConnectButton'
import { Connected } from '../components/Connected'
import { Swap } from '../components/Swap'
import { Tokens } from '../components/Tokens'
import { TokenDashboard } from '../components/TokenDashboard'
import React from 'react'

const Page: React.FC = () => {
  return (
    <>

      <div className="text-center pt-6 pb-6 font-bold text-2xl text-green-900">
        Oracle and Indexers Application
      </div>

      <div className="flex justify-center items-center pb-4">
        <div className="display-flex">
          <ConnectButton />
        </div>
      </div>


      <Connected>
        <hr />
        <div className="text-center pt-12 pb-12 font-bold text-2xl text-blue-900">
          Swap ETH and StableCoin with chainlink&apos;s oracle&apos;s price for ETH
        </div>
        <Tokens />
        <br />
        <h2 className="text-center pb-6 font-bold text-blue-900">Swap</h2>
        <Swap />
        <hr />
        <div className="text-center pt-12 pb-6 font-bold text-2xl text-green-900">
          Get the 3 biggest whales of a Sushiswap pool with TheGraph
        </div>

        <TokenDashboard />
        <br />
      </Connected>

    </>
  )
}

export default Page
