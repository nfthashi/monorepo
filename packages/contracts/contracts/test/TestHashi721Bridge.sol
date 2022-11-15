// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../Hashi721Bridge.sol";

contract TestHashi721Bridge is Hashi721Bridge {
  function setOriginal(address asset, uint32 originalDomainId, address originalAsset) public {
    originalDomainIds[asset] = originalDomainId;
    originalAssets[asset] = originalAsset;
  }

  function testXReceive(bytes memory callData) external {
    _xReceive(callData);
  }

  function testEncodeCallData(
    uint32 originalDomainId,
    address originalAsset,
    address to,
    uint256 tokenId,
    string memory tokenURI
  ) external pure returns (bytes memory) {
    return _encodeCallData(originalDomainId, originalAsset, to, tokenId, tokenURI);
  }

  function testDecodeCallData(
    bytes memory callData
  ) external pure returns (uint32, address, address, uint256, string memory) {
    return _decodeCallData(callData);
  }
}
