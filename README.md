# xNFTs

This is xNFTs repository

## Testnet Live Demo

### xNativeNFT

#### Deployment

Deploy native xNFT for Kovan

```
yarn workspace contracts hardhat native-deploy --network kovan --self-domain 2221 --connext 0x71a52104739064bc35bED4Fc3ba8D9Fb2a84767f --dummy-transacting-asset-id 0xB5AabB55385bfBe31D627E2A717a7B189ddA4F8F --start-token-id 0 --end-token-id 100
```

Deploy native xNFT for Rinkeby

```
yarn workspace contracts hardhat native-deploy --network rinkeby --self-domain 1111 --connext 0x979588965099F4DEA3CAd850d67ca3356284591e --dummy-transacting-asset-id 0xB7b1d3cC52E658922b2aF00c5729001ceA98142C --start-token-id 100 --end-token-id 200
```

#### Register

Register Rinkeby opponent in Kovan

```
yarn workspace contracts hardhat register --network kovan --self-contract-address <deployed contract> --opponent-domain 1111 --opponent-contract-address <deployed contract>
```

Register Kovan opponent in Rinkeby

```
yarn workspace contracts hardhat register --network rinkeby --self-contract-address <deployed contract> --opponent-domain 2221 --opponent-contract-address <deployed contract>
```

#### Mint

Mint NFT in Rinkeby

```
yarn workspace contracts hardhat native-mint --network rinkeby --self-contract-address <deployed contract> --to <your address>
```

Mint NFT in Kovan

```
yarn workspace contracts hardhat native-mint --network kovan --self-contract-address <deployed contract> --to <your address>
```

Token ID can be checked at Etherscan

#### Bridge

From Kovan to Rinkeby

```
yarn workspace contracts hardhat native-bridge --network kovan --source-contract-address <deployed contract> --from <nft holder address> --to <to address> --token-id <minted token id> --destination-domain 1111
```

From Rinkeby to Kovan

```
yarn workspace contracts hardhat native-bridge --network rinkeby --source-contract-address <deployed contract> --from <nft holder address> --to <to address> --token-id <minted token id> --destination-domain 2221
```

### xWrapNFT

#### Implementation

Rinkeby

```
yarn workspace contracts hardhat wrap-deploy-implementation --network rinkeby
```

Kovan

```
yarn workspace contracts hardhat wrap-deploy-implementation --network kovan
```

#### Mock NFT

To Kovan

```
yarn workspace contracts hardhat wrap-deploy-mock-with-mint --network kovan --amount 1 --to <your address>
```

To Rinkeby

```
yarn workspace contracts hardhat wrap-deploy-mock-with-mint --network rinkeby --amount 1 --to <your address>
```

#### Source

Kovan

```
yarn workspace contracts hardhat wrap-deploy-source --network kovan --self-domain 2221 --connext 0x71a52104739064bc35bED4Fc3ba8D9Fb2a84767f --dummy-transacting-asset-id 0xB5AabB55385bfBe31D627E2A717a7B189ddA4F8F
```

Rinkeby

```
yarn workspace contracts hardhat wrap-deploy-source --network rinkeby --self-domain 1111 --connext 0x979588965099F4DEA3CAd850d67ca3356284591e --dummy-transacting-asset-id 0xB7b1d3cC52E658922b2aF00c5729001ceA98142C
```

#### Target

Kovan

```
yarn workspace contracts hardhat wrap-deploy-target --network kovan --self-domain 2221 --connext 0x71a52104739064bc35bED4Fc3ba8D9Fb2a84767f --dummy-transacting-asset-id 0xB5AabB55385bfBe31D627E2A717a7B189ddA4F8F --nft-implementation <deployed nft implementation>
```

Rinkeby

```
yarn workspace contracts hardhat wrap-deploy-target --network rinkeby --self-domain 1111 --connext 0x979588965099F4DEA3CAd850d67ca3356284591e --dummy-transacting-asset-id 0xB7b1d3cC52E658922b2aF00c5729001ceA98142C --nft-implementation <deployed nft implementation>
```

#### Register

Register Rinkeby opponent in Kovan

```
yarn workspace contracts hardhat register --network kovan --self-contract-address <deployed contract> --opponent-domain 1111 --opponent-contract-address <deployed contract>
```

Register Kovan opponent in Rinkeby

```
yarn workspace contracts hardhat register --network rinkeby --self-contract-address <deployed contract> --opponent-domain 2221 --opponent-contract-address <deployed contract>
```

#### Bridge

From Kovan to Rinkeby

```
yarn workspace contracts hardhat wrap-bridge --network kovan --source-contract-address <deployed contract> --original-nft-contract-address <deployed contract> --from <your address> --to <your address> --token-id <minted token id> --destination-domain 1111
```

From Rinkeby to Kovan

```
yarn workspace contracts hardhat wrap-bridge --network rinkeby --source-contract-address <deployed contract> --original-nft-contract-address <deployed contract> --from <your address> --to <your address> --token-id <minted token id> --destination-domain 2221
```

## Sample Contracts

### Native Pattern

#### Kovan

<https://kovan.etherscan.io/address/0xf13E44F5afEB9eC7e3A46484F59BaD811b267026#code>

#### Rinkeby

<https://rinkeby.etherscan.io/address/0x4114B9b30E0EF8D60722cebb9E91948cfa4c850e#code>

### Wrap Pattern

#### Kovan

##### Implementation

<https://kovan.etherscan.io/address/0x347AB7D0411cB47B748f9c81038961eA384A7aEF#code>

##### Target

<https://kovan.etherscan.io/address/0xE9bA21232D0Ece2e550a203b3E5bFC104800e792#code>

##### Source

<https://kovan.etherscan.io/address/0xfF06B57683fd0e0c4fa9871beB483D6E32909FaB#code>

#### Rinkeby

##### Implementation

<https://rinkeby.etherscan.io/address/0xC9944AcbE1553c7E7a876A71165a25220e272b6b#code>

##### Target

<https://rinkeby.etherscan.io/address/0x04411f85d9c85D30CBadD88D3821546d6Df895a4>

##### Source

<https://rinkeby.etherscan.io/address/0xb4c290674eA71C32c0c9699439155274275d9F18#code>
