// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../core/xNFTBridge.sol";

abstract contract xNFTNativeBridge is xNFTBridge, ERC721 {
  constructor(
    uint32 _selfDomain,
    address _connext,
    address _dummyTransactingAssetId
  ) xNFTBridge(_selfDomain, _connext, _dummyTransactingAssetId) {}

  function xSend(
    address from,
    address to,
    uint256 tokenId,
    uint32 toDomain
  ) public {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "xNativeNFTCore: send caller is not owner nor approved");
    require(ownerOf(tokenId) == from, "xNativeNFTCore: send from incorrect owner");
    _burn(tokenId);
    bytes4 selector = bytes4(keccak256("xReceive(address,uint256)"));
    bytes memory callData = abi.encodeWithSelector(selector, to, tokenId);
    _xcall(toDomain, callData);
  }

  function xReceive(address to, uint256 tokenId) public onlyExecutor {
    _mint(to, tokenId);
  }
}
