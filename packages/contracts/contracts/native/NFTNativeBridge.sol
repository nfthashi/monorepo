// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../core/NFTBridge.sol";
import "../interface/INFTNativeBridge.sol";

abstract contract NFTNativeBridge is ERC165, INFTNativeBridge, NFTBridge, ERC721 {
  constructor(
    uint32 selfDomain,
    address connext,
    address dummyTransactingAssetId
  ) NFTBridge(selfDomain, connext, dummyTransactingAssetId) {} // solhint-disable-line no-empty-blocks

  function xSend(
    address from,
    address to,
    uint256 tokenId,
    uint32 sendToDomain
  ) public {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "NFTNativeBridge: invalid sender");
    require(ownerOf(tokenId) == from, "NFTNativeBridge: invalid from");
    _burn(tokenId);
    bytes memory callData = abi.encodeWithSelector(this.xReceive.selector, to, tokenId);
    _xcall(sendToDomain, callData);
  }

  function xReceive(address to, uint256 tokenId) public onlyExecutor {
    _mint(to, tokenId);
  }

  function isNFTHashiNativeBridge() public pure returns (bool) {
    return true;
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(NFTBridge, ERC721, ERC165, IERC165)
    returns (bool)
  {
    return interfaceId == type(INFTNativeBridge).interfaceId || super.supportsInterface(interfaceId);
  }
}
