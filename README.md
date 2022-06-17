# NFT Hashi Read Me

This is a simple description of how to use this bridge application.
For the detailed architecture, or developer guide, please check our documentation
http://docs.nfthashi.com/

- What is NFT Hashi?
- How to use NFT Hashi
  - How to bridge
  - How to check the bridge status

# What is NFT Hashi
**NFTHashi is a trust-minimized cross-chain NFT bridge powered by Connext & Nomad**

We support all NFTs even that have already been issued can be bridged to other chains. That means your Punks or BAYC can go beyond Ethereum and can be used on any chain you like
We use Connext, and Connext provides trust-minimized cross-chain messaging using optimistic verification provided by Nomad, the most trust-minimized protocol for cross-chain messaging so you can safely bridge your valuable NFTs!


# How to use NFT Hashi
## Useage
NFTHashi support any NFTs already created.
When you deposit an NFT to the contract in Chain A, the NFT is minted in Chain B. When you burn the NFT in Chain B, the deposited NFT is returned.

1. Connect your web3 wallet, and select chains you want to bridge
<img width="680" alt="Screen Shot 2022-06-17 at 18 04 17" src="https://user-images.githubusercontent.com/64068653/174266018-ad4bc978-2579-48d8-844f-23c315ac3787.png">

2. Select the NFT you want to bridge, and confirm

<img width="657" alt="Screen Shot 2022-06-17 at 18 11 40" src="https://user-images.githubusercontent.com/64068653/174267304-302d5b85-a08e-412b-9e4e-0c423f8c23ff.png">

3. Metamask is launched twice: Approve and Bridge.

For more detaild descriptions, see this how-to-use docs
https://docs.nfthashi.com/operation-guide/how-to-use-nfthashi


## SDK 
We provide the contract integrated bridge function as SDK for the users who want to create a more advanced NFT utilizing cross-chain. For example, a chain with minted NFTs, a chain with current NFTs, the itinerancy of NFT bridges, and other NFTs whose metadata changes according to these attributes, and so on, will allow for new expressions that have not been possible before!
You can create those NFTs easily by installing SDK and inheriting the contract follow the instructions in the document below.

If you want to deploy and use NFT with bridge function by yourself, please refer to Document.
https://docs.nfthashi.com/developer-guide/how-to-deploy-your-own-cross-chain-nft


### How to check NFT bridge status

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
- [https://twitter.com/taijusanagi](https://twitter.com/taijusanagi)

## Publish

Run this at root

```
cd packages/contracts && yarn cpx 'contracts/**/*.sol' dist && yarn cpx package.json dist/ && yarn cpx README.md dist/ && cd dist && npm publish && cd .. && rm -rf dist && cd ../..
```
