// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../NFTNativeBridge.sol";

contract NativeNFT is NFTNativeBridge {
  uint256 private immutable _startTokenId;
  uint256 private immutable _endTokenId;
  uint256 private _supplied;

  string private _baseTokenURI;

  constructor(
    uint32 selfDomain,
    address connext,
    address dummyTransactingAssetId,
    uint256 startTokenId,
    uint256 endTokenId,
    string memory name,
    string memory symbol,
    string memory baseTokenURI
  ) NFTNativeBridge(selfDomain, connext, dummyTransactingAssetId) ERC721(name, symbol) {
    _startTokenId = startTokenId;
    _endTokenId = endTokenId;
    _baseTokenURI = baseTokenURI;
  }

  function mint(address to) public {
    uint256 tokenId = _startTokenId + _supplied;
    require(tokenId <= _endTokenId, "NativeNFT: mint already finished");
    _mint(to, tokenId);
    _supplied++;
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseTokenURI;
  }
}
