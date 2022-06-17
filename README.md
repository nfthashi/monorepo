# NFT Hashi Read Me

This is a simple description of how to use this bridge application
For a detailed functional description, architecture, and developer guide, please check our documentation
http://docs.nfthashi.com/

- What is NFT Hashi?
- How to use NFT Hashi
  - How to bridge
  - How to check the bridge status

# What is NFT Hashi

NFT Hashi is a NFT bridge protocol that support transferring the NFTs between the deferent chains. We provide two types of bridge system, Wrap Pattern and Native Support Pattern, that can be used for different use cases.

# How to use NFT Hashi

### Installation

`$ npm i @nfthashi/contracts`

### Usage

Once installed, you can use the contracts in the library by importing them:

```
pragma solidity ^0.8.0;

import "@nfthashi/contracts/contracts/native/example/NativeHashi721";

contract MyCollectible is NativeHashi721 {
    constructor(
      uint32 selfDomain,
      address connext,
      address dummyTransactingAssetId,
      uint256 startTokenId,
      uint256 endTokenId,
      string memory name,
      string memory symbol,
      string memory baseTokenURI
  )  {
  }
}
```

- selfDomain :
  The domain ID of the network you deploy
- connext :
  The connext handler address of the network you deploy
- dummyTransactionAssetId :
  The test ERC20 token address of the network you deploy
- startTokenId & endTokenId :
  Enter how many tokens you want to mint in this chain
  ex) You want to set token Id 101 ~ 200 to this network, startTokenId is 101 and endTokenId is 200
- name & symbol & baseTokenURI :
  Enter each as you would when creating an ERC721

You can find some necessary informations (ex domainID, connext address) from here
https://docs.nfthashi.com/developer-guide/informations

For example, when deploying to rinkeby with token ID 101 ~ 200 set, the arguments would look like this.
pragma solidity ^0.8.0;

```
import "@nfthashi/contracts/contracts/native/example/NativeHashi721";

contract MyCollectible is NativeHashi721 {
    constructor() NativeHashi721(
      1111,
      a0x2307Ed9f152FA9b3DcDfe2385d279D8C2A9DF2b0,
      0x3FFc03F05D1869f493c7dbf913E636C6280e0ff9,
      101,
      200,
      TEST TOKEN NFT,
      TEST,
      www.nfthashi.com/metadata/
  )  {
  }
}
```

If you're new to smart contract development, head to Developing Smart Contracts to learn about creating a new project and compiling your contracts. This Openzeppelin Document help your understanding.

## How to bridge

#### Wrap Pattern

Wrap pattern support any NFTs already created
When you deposit an NFT to the contract in Chain A, the NFT is minted in Chain B. When you burn the NFT in Chain B, the deposited NFT is returned.

<img width="622" alt="Screen Shot 2022-05-25 at 14 12 46" src="https://user-images.githubusercontent.com/64068653/170184708-bcdf2630-4f34-4ce9-8bef-75d7a457000a.png">

1. Select Bridge Pattern
2. Select Wrap (Original ⇒ Wrapped) or Unwrap(Wrapped ⇒ Original)
3. Select the origin chain and the destination chain
4. Input the NFT contract address on the origin chain and Input token ID
5. Click “Bridge” and send the transaction from your wallet.

#### Native Pattern

Native Pattern is an extended contract that allows you to bridge between each chain by incorporating our contract into your NFT.
When you burn an NFT in Chain A, the NFT is minted in Chain B. When you burn the NFT in Chain B, the NFT is minted in Chain A vice versa.
<img width="552" alt="Screen Shot 2022-05-25 at 14 09 29" src="https://user-images.githubusercontent.com/64068653/170184310-1f542326-91f9-4fac-a287-9a16ade38417.png">

1. Minting test NFT with bridge function
2. Select Bridge Pattern
3. Select the origin chain and the destination chain
4. Input the NFT contract address on the origin chain and Input token ID
5. Click “Bridge” and send the transaction from your wallet.

If you want to deploy and use NFT with bridge function by yourself, please refer to Document
http://docs.nfthashi.com/

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

  \*It takes about an hour to send message from Chain A to Chain B

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
  # Contact
  Please contact me if you have any questions, feedback, or are interested in collaborating !!
  And, we'd love to discuss future directions of Cross-chain NFT, so feel free to chat us!
- [https://twitter.com/0x_Yuzu](https://twitter.com/0x_Yuzu)
- [https://twitter.com/taijusanag](https://twitter.com/taijusanagi)
