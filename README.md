# xNFTs

This is xNFTs repository

## Testnet Live Demo

### xNativeNFT

#### Deployment

Deploy native xNFT for Kovan

```
yarn workspace contracts hardhat native-deploy --network kovan --self-domain 2221 --connext 0x71a52104739064bc35bED4Fc3ba8D9Fb2a84767f --dummy-transacting-asset-id 0xB5AabB55385bfBe31D627E2A717a7B189ddA4F8F --start-token-id 0 --end-token-id 99
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
yarn workspace contracts hardhat wrap-deploy-target --network kovan --self-domain 2221 --connext 0x71a52104739064bc35bED4Fc3ba8D9Fb2a84767f --dummy-transacting-asset-id 0xB5AabB55385bfBe31D627E2A717a7B189ddA4F8F
```

Rinkeby

```
yarn workspace contracts hardhat wrap-deploy-target --network rinkeby --self-domain 1111 --connext 0x979588965099F4DEA3CAd850d67ca3356284591e --dummy-transacting-asset-id 0xB7b1d3cC52E658922b2aF00c5729001ceA98142C
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
