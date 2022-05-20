# xNFTs Read Me
- What is xNFTs?
- Architecture
    - Wrap Pattern
    - Native Pattern
- How to use xNFTs
    - How to bridge
    - How to check the bridge status
- Dev guide



# What is xNFTs

xNFTs is a NFT bridge protocol that support transferring the NFTs between the deferent chains. We provide two types of bridge system, Wrap Pattern and Native Support Pattern, that can be used for different use cases.

# Architecture

## Wrap Pattern

Wrap pattern support any NFTs already created.
A simple ERC721 contract is deployed on the bridged chain based on the information of the original NFT existing in Chain A (Origin Chain) and minted to the address that caused the Tx.
In case of unwrapping from Chain B to Chain A, a wrapped NFT on Chain B will be burned, and an NFT deposited in contract on Chain A will be transferred to the owner on Chain B on Chain A.

Let me describe along with the user flow.

### Case of bridge from Chain A to Chain B：Wrap
[Uploading Screen Shot 2022-05-20 at 16.26.21.png…]()


- Deposit an NFT to xNFT handler contract on Chain A (Origin Chain)
- The handler contract sends the information of NFT or chains to Chain B using xCall supported by Connext. (more info about xCall ⇒ [xapp-starter](https://github.com/connext/xapp-starter)
- The Handler Contract of Chain B receives the xCall from Chain A
- Compute the contract address from the information of these using Create2.
- If the computed address has not been deployed, the wrapped NFT contract is deployed to the computed contract address and minted. After the second time, the NFT is minted from a contract that has already been deployed.


### Case of bridge from Chain B to Chain A: Dewrap
<img width="1106" alt="Screen Shot 2022-05-20 at 16 27 43" src="https://user-images.githubusercontent.com/64068653/169476190-05f56f7b-33dd-4dfa-a918-92275024169c.png">


- The bridge contract burns the wrapped NFT minted on Chain B
- Refer the mapping of Chain A address and Chain B address
- Send NFT information to Chain A using xCall
- The Handler Contract of Chain B receive the xCall from Chain A
- An NFT deposited in contract with Chain A will be transferred to the address of an owner at Chain B


## Native Support

Native Support Pattern is the bridge function for users trying to
create the new NFT project with the cross-chain bridge. We develop a contract that incorporates the cross-chain bridge function to ERC721. You can use A as is or inherit it and create a contract to support a cross-chain NFT bridge.


<img width="1047" alt="Screen Shot 2022-05-20 at 16 30 50" src="https://user-images.githubusercontent.com/64068653/169476736-2702ca95-f62b-4f32-ac22-f843fcf25311.png">


### Initialization

Some initial setup is required when using the NFTs with bridge function

- Deploy <NativeBridgeContractName> contract to each chains
    
    Firstly, you should deploy Native NFT contract to all chains you would support
    
    - How to deploy <NativeBridgeContractName> contract ⇒ Dev guide
- Resister the mapping of the contract address and the domain ID for each chains
    
    Each Native contract must hold the mapping of NFT contract address and Domain ID
    
    Ex ) Bridge between Chain A and Chain B
    
    - Resister the mapping of Chain B Domain ID to Chain B NFT contract address to Chain A’s contract address
    - Resister the mapping of Chain B Domain ID to Chain B NFT contract address to Chain A’s contract address
    
    Now both A and B can recognize each other's contracts
    
    - How to resister the mapping ⇒ Dev guide

Every time a new chain is supported, you must do this process
  
  
### Bridge Mechanism

- Call xSend function in <NativeBridgeContractName>. This is a function to bridge NFT
- In chain A, NFT will be burned and the information of NFT or chains are sent to Chain B using xCall
- Chain B receive xCall from ChainA, and mint the NFT on Chain B to the owner on ChainA
- When bridging from Chain B to another chain, in the same way, burned at the origin chain and minted at destination chain.
  
# How to use xNFTs
## How to bridge
  <img width="794" alt="Screen Shot 2022-05-20 at 16 41 38" src="https://user-images.githubusercontent.com/64068653/169478712-dfeb6553-750b-4376-ae00-0105d6905df8.png">


1. Select the origin chain and the destination chain
2. Select Bridge Pattern
3. Select Wrap (Original ⇒ Wrapped) or Unwrap(Wrapped ⇒ Original)
4. Input the NFT contract address on the origin chain and Input token ID
5. Click “Bridge” and send the transaction from your wallet.
  
  
## How to check NFT bridge status
  - Copy the transaction hash on the origin chain
- Use this code in subQuery of the origin chain to get “Transaction ID”
    - subgraph URL
        - Kovan [https://thegraph.com/hosted-service/subgraph/connext/nxtp-amarok-runtime-v0-kovan](https://thegraph.com/hosted-service/subgraph/connext/nxtp-amarok-runtime-v0-kovan)
        - Rinkeby [https://thegraph.com/hosted-service/subgraph/connext/nxtp-amarok-runtime-v0-rinkeby](https://thegraph.com/hosted-service/subgraph/connext/nxtp-amarok-runtime-v0-rinkeby)

 ```
{
  originTransfers(
    where: {
      transactionHash: "<your_transaction_hash>"
    }
  ) {
    transferId
  }
}
 ```
  
  - Use this code in subQuery of the destination chain to get the transaction hash
    
    *It takes about an hour to send message from Chain A to Chain B
  
  ```
  {
  destinationTransfers(
    where: {
      transferId: "<your_transfer_id>"
    }
  ) {
    executedTransactionHash
  }
}
  ```
  
  For more information about this section, this documentation will help you

- [https://docs.connext.network/Developers/xcall-status](https://docs.connext.network/Developers/xcall-status)
  
  
  ## Developers Guide

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
  
