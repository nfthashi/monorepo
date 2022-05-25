// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../core/NFTBridge.sol";
import "../interface/INFTNativeBridge.sol";

abstract contract NFTNativeBridge is NFTBridge, ERC721, INFTNativeBridge {
  constructor(
    uint32 selfDomain,
    address connext,
    address dummyTransactingAssetId
  ) NFTBridge(selfDomain, connext, dummyTransactingAssetId) {}

  function xSend(
    address from,
    address to,
    uint256 tokenId,
    uint32 sendToDomain
  ) public {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "NativeNFTCore: send caller is not owner nor approved");
    require(ownerOf(tokenId) == from, "NativeNFTCore: send from incorrect owner");
    _burn(tokenId);
    bytes4 selector = bytes4(keccak256("xReceive(address,uint256)"));
    bytes memory callData = abi.encodeWithSelector(selector, to, tokenId);
    _xcall(sendToDomain, callData);
  }

  function xReceive(address to, uint256 tokenId) public onlyExecutor {
    _mint(to, tokenId);
  }
}
