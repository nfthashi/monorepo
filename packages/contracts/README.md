# SDK

We provide the contract integrated bridge function as SDK for the users who want to create a more advanced NFT utilizing cross-chain.
For example, a chain with minted NFTs, a chain with current NFTs, the itinerancy of NFT bridges, and other NFTs whose metadata changes according to these attributes, and so on, will allow for new expressions that have not been possible before!

You can create those NFTs easily by installing SDK and inheriting the contract follow the instructions in the document below.

# How to use

### Installation

```
$ npm i @nfthashi/contracts
```

The functions and interfaces of each contract are summarized here.
https://docs.nfthashi.com/developer-guide/contract-informations

### Usage

Once installed, you can use the contracts in the library by importing them:

```
pragma solidity ^0.8.0;

import "@nfthashi/contracts/NativeHashi721.sol";

contract NativeHashi721Example is NativeHashi721 {
  uint256 private immutable _startTokenId;
  uint256 private immutable _endTokenId;
  uint256 private _supplied;

  string private _baseTokenURI;

  constructor(
    uint32 selfDomain,
    address connext,
    address dummyTransactingAssetId,
    string memory name,
    string memory symbol,
    uint256 startTokenId,
    uint256 endTokenId,
    string memory baseTokenURI
  ) NativeHashi721(selfDomain, connext, dummyTransactingAssetId, name, symbol) {
    _startTokenId = startTokenId;
    _endTokenId = endTokenId;
    _baseTokenURI = baseTokenURI;
  }

  function mint(address to) public {
    uint256 tokenId = _startTokenId + _supplied;
    require(tokenId <= _endTokenId, "NativeHashi721: mint finished");
    _mint(to, tokenId);
    _supplied++;
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseTokenURI;
  }
}

```

See documentation for variables required to deploy to other chains

## Constructor arguments

#### selfDomain

=> The domain ID of the network you deploy

#### connext

=> The connext handler address of the network you deploy

#### dummyTransactionAssetId

=> The test ERC20 token address of the network you deploy

You can find the each variables from
https://docs.nfthashi.com/developer-guide/informations

---

If you're new to smart contract development, head to Developing Smart Contracts to learn about creating a new project and compiling your contracts. This Openzeppelin document helps your understanding.
https://docs.openzeppelin.com/learn/developing-smart-contracts

---

# Deployment

Token ID should be different in each chain. For example, Rinkeby token ID is 0-999, and Kovan token ID is 1000-1999.
After deploying the contract to each chain, all contract connections should be registered.

# Publish

```
cd packages/contracts && yarn cpx 'contracts/**/*.sol' dist && yarn cpx package.json dist/ && yarn cpx README.md dist/ && cd dist && npm publish && cd .. && rm -rf dist && cd ../..
```
