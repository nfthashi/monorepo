// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../xNFTNativeBridge.sol";

contract xNativeNFT is xNFTNativeBridge {
  uint256 public immutable startTokenId;
  uint256 public immutable endTokenId;
  uint256 public supplied;

  constructor(
    uint32 _selfDomain,
    address _connext,
    address _dummyTransactingAssetId,
    uint256 _startTokenId,
    uint256 _endTokenId
  ) xNFTNativeBridge(_selfDomain, _connext, _dummyTransactingAssetId) ERC721("", "") {
    startTokenId = _startTokenId;
    endTokenId = _endTokenId;
  }

  function mint(address to) public {
    uint256 tokenId = startTokenId + supplied;
    require(tokenId <= endTokenId, "xNativeNFT: mint already finished");
    _mint(to, tokenId);
    supplied++;
  }
}
