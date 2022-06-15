// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./HashiConnextAdapter.sol";
import "./interfaces/INativeHashi721.sol";

contract NativeHashi721 is ERC165, INativeHashi721, HashiConnextAdapter, ERC721 {
  constructor(
    uint32 selfDomain,
    address connext,
    address dummyTransactingAssetId,
    string memory name,
    string memory symbol
  ) HashiConnextAdapter(selfDomain, connext, dummyTransactingAssetId) ERC721(name, symbol) {} // solhint-disable-line no-empty-blocks

  function xSend(
    address from,
    address to,
    uint256 tokenId,
    uint32 sendToDomain
  ) public {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "NativeHashi721: invalid sender");
    require(ownerOf(tokenId) == from, "NativeHashi721: invalid from");
    _burn(tokenId);
    bytes memory callData = abi.encodeWithSelector(this.xReceive.selector, to, tokenId);
    _xcall(sendToDomain, callData);
  }

  function xReceive(address to, uint256 tokenId) public onlyExecutor {
    _mint(to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC165, IERC165) returns (bool) {
    return interfaceId == type(INativeHashi721).interfaceId || super.supportsInterface(interfaceId);
  }

  function isNativeHashi721() public pure returns (bool) {
    return true;
  }
}
