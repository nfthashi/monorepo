// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {IXReceiver} from "@connext/nxtp-contracts/contracts/core/connext/interfaces/IXReceiver.sol";

import "./HashiConnextAdapter.sol";
import "./interfaces/INativeHashi721.sol";

contract NativeHashi721 is Initializable, ERC165Upgradeable, HashiConnextAdapter, INativeHashi721, ERC721Upgradeable, IXReceiver {
  constructor(
    uint32 selfDomain,
    IConnext connext,
    string memory name,
    string memory symbol
  ) {
    initialize(selfDomain, connext, name, symbol);
  }

  function initialize(
    uint32 selfDomain,
    IConnext connext,
    string memory name,
    string memory symbol
  ) public initializer {
    __HashiConnextAdapter_init(selfDomain, connext);
    __ERC721_init_unchained(name, symbol);
  }

  function xSend(
    address from,
    address to,
    uint256 tokenId,
    uint32 sendToDomain
  ) public {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "NativeHashi721: invalid sender");
    require(ownerOf(tokenId) == from, "NativeHashi721: invalid from");
    _burn(tokenId);
    bytes memory callData = abi.encodePacked(to, tokenId);
    uint256 relayerFee = 0;
    _xcall(sendToDomain, relayerFee, callData);
  }

  function xReceive(bytes32 _transferId,
    uint256 _amount,
    address _asset,
    address _originSender,
    uint32 _origin,
    bytes memory _callData) external onlySource(_originSender, _origin) returns(bytes memory) {
    (address to, uint256 tokenId) = abi.decode(_callData, (address, uint256));
    _mint(to, tokenId);
  }


  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC721Upgradeable, ERC165Upgradeable, IERC165Upgradeable)
    returns (bool)
  {
    return interfaceId == type(INativeHashi721).interfaceId || super.supportsInterface(interfaceId);
  }

  function isNativeHashi721() public pure returns (bool) {
    return true;
  }
}
