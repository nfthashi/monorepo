// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../NFTNativeBridge.sol";

contract NativeNFT is NFTNativeBridge {
  uint256 private immutable _startTokenId;
  uint256 private immutable _endTokenId;
  uint256 private _supplied;

  constructor(
    uint32 selfDomain,
    address connext,
    address dummyTransactingAssetId,
    uint256 startTokenId,
    uint256 endTokenId
  ) NFTNativeBridge(selfDomain, connext, dummyTransactingAssetId) ERC721("", "") {
    _startTokenId = startTokenId;
    _endTokenId = endTokenId;
  }

  function mint(address to) public {
    uint256 tokenId = _startTokenId + _supplied;
    require(tokenId <= _endTokenId, "NativeNFT: mint already finished");
    _mint(to, tokenId);
    _supplied++;
  }
}
