// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC721MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

import "./interfaces/IWrappedHashi721.sol";
import "./HashiConnextAdapter.sol";

contract Hashi721Bridge is ERC721HolderUpgradeable, HashiConnextAdapter {
  mapping(address => uint32) public originalDomainIds;
  mapping(address => address) public originalAssets;

  address public assetImplementation;

  function initialize(address connext_, uint32 domainId_, address assetImplementation_) public virtual initializer {
    __HashiConnextAdapter_init(connext_, domainId_);
    assetImplementation = assetImplementation_;
  }

  function xSend(
    uint32 destination,
    uint256 relayerFee,
    uint256 slippage,
    address asset,
    address from,
    address to,
    uint256 tokenId,
    bool isTokenURIIncluded
  ) public payable returns (bytes32) {
    require(
      IERC721Upgradeable(asset).ownerOf(tokenId) == _msgSender() ||
        IERC721Upgradeable(asset).getApproved(tokenId) == _msgSender() ||
        IERC721Upgradeable(asset).isApprovedForAll(from, _msgSender()),
      "Hashi721Bridge: invalid msg sender"
    );
    string memory tokenURI;
    if (isTokenURIIncluded) {
      tokenURI = IERC721MetadataUpgradeable(asset).tokenURI(tokenId);
    }
    uint32 originalDomainId;
    address originalAsset;
    if (originalAssets[asset] != address(0x0) && originalDomainIds[asset] != 0) {
      IWrappedHashi721(asset).burn(tokenId);
      originalDomainId = originalDomainIds[asset];
      originalAsset = originalAssets[asset];
    } else {
      IERC721Upgradeable(asset).transferFrom(from, address(this), tokenId);
      originalDomainId = domainId;
      originalAsset = asset;
    }
    bytes memory callData = _encodeCallData(originalDomainId, originalAsset, to, tokenId, tokenURI);
    return _xCall(destination, relayerFee, slippage, callData);
  }

  function _afterXReceive(bytes memory callData_) internal override {
    (
      uint32 originalDomainId,
      address originalAsset,
      address to,
      uint256 tokenId,
      string memory tokenURI
    ) = _decodeCallData(callData_);
    if (originalDomainId == domainId) {
      address asset = originalAsset;
      IERC721Upgradeable(asset).safeTransferFrom(address(this), to, tokenId);
    } else {
      bytes32 salt = keccak256(abi.encodePacked(originalDomainId, originalAsset));
      address asset = ClonesUpgradeable.predictDeterministicAddress(assetImplementation, salt);
      if (!AddressUpgradeable.isContract(asset)) {
        ClonesUpgradeable.cloneDeterministic(assetImplementation, salt);
        IWrappedHashi721(asset).initialize();
        originalDomainIds[asset] = originalDomainId;
        originalAssets[asset] = originalAsset;
      }
      IWrappedHashi721(asset).mint(to, tokenId, tokenURI);
    }
  }

  function _encodeCallData(
    uint32 originalDomainId,
    address originalAsset,
    address to,
    uint256 tokenId,
    string memory tokenURI
  ) internal pure returns (bytes memory) {
    return abi.encode(originalDomainId, originalAsset, to, tokenId, tokenURI);
  }

  function _decodeCallData(
    bytes memory callData
  ) internal pure returns (uint32, address, address, uint256, string memory) {
    return abi.decode(callData, (uint32, address, address, uint256, string));
  }
}
