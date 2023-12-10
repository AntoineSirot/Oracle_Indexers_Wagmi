# TheGraph and Chainlink Front

This repository hosts a web3 front-end project that uses chainlink oracle to simulate the ETH price on a ERC20 tokens and use TheGraph to retrieved information from sushiswap's pools.

[Project Deployment on Vercel](https://oracle-indexers-wagmi.vercel.app/)

## Getting Started

To run the project locally, execute the following commands:
```
npm i
npm run dev
```

## Contract Address (deployed on Sepolia)

**Marketplace Contract** : [0xff07eb7Ca89812CdEBe280CaFBc69c59a08C7203](https://sepolia.etherscan.io/address/0xff07eb7ca89812cdebe280cafbc69c59a08c7203)

**StableCoin Contract** : [0x512fB45C344831B147818C81A11E2D39368bb75d](https://sepolia.etherscan.io/address/0x512fB45C344831B147818C81A11E2D39368bb75d)

**ERC20 Ether Contract** : [0x51E698fC402597824EA586B095DD8DfaCfbEd67c](https://sepolia.etherscan.io/address/0x51E698fC402597824EA586B095DD8DfaCfbEd67c)

## Technical Stack

 - [Wagmi](https://wagmi.sh)
 - [Next.js](https://nextjs.org)
 - [RainbowKit Documentation](https://rainbowkit.com/docs/introduction)
 - [Vercel for deployment](https://vercel.com)
 - [Chainlink oracle](https://chain.link)
 - [TheGraph](https://thegraph.com)


## Key Features
### Main Functionality:

The platform use two technology with specific purpose:

- **Swap tokens**: This primary functionality allows anyone to mint some of my ETH / StableCoin tokens and then swap one for the other. The ratio of the tokens is calculated from the ETH price retrieved on the marketplace with Chainlink's oracle.
- **Get whales of a sushiswap poll**: This secondary functionality is based on TheGraph. The front will return the three biggest whales of a specific sushiswap pool. The user can enter his pool id or he can choose one of the five preregistered pools. 


### Bugs and Issues

If you find any issues or have suggestions, please open an issue or create a pull request on this repository.

Thank you for your support !