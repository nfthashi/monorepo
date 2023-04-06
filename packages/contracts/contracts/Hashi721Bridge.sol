// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC721MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

import "./interfaces/IHashi721Bridge.sol";
import "./interfaces/IWrappedHashi721.sol";
import "./HashiConnextAdapter.sol";

contract Hashi721Bridge is IHashi721Bridge, ERC721HolderUpgradeable, HashiConnextAdapter {
  mapping(address => uint32) public originalDomainIds;
  mapping(address => address) public originalAssets;

  address public wrappedHashi721Implementation;

  function initialize(address connext_, address wrappedHashi721Implementation_) external virtual initializer {
    __ERC721Holder_init();
    __HashiConnextAdapter_init(connext_);
    wrappedHashi721Implementation = wrappedHashi721Implementation_;
  }

  function xCall(
    uint32 destination,
    uint256 relayerFee,
    uint256 slippage,
    address asset,
    address to,
    uint256 tokenId,
    bool isTokenURIIgnored
  ) external payable returns (bytes32) {
    address currentHolder = IERC721Upgradeable(asset).ownerOf(tokenId);
    require(
      currentHolder == msg.sender ||
        IERC721Upgradeable(asset).getApproved(tokenId) == msg.sender ||
        IERC721Upgradeable(asset).isApprovedForAll(currentHolder, msg.sender),
      "Hashi721Bridge: msg sender is invalid "
    );
    string memory tokenURI;
    if (!isTokenURIIgnored) {
      tokenURI = IERC721MetadataUpgradeable(asset).tokenURI(tokenId);
    }
    uint32 originalDomainId;
    address originalAsset;
    if (originalAssets[asset] == address(0x0) && originalDomainIds[asset] == 0) {
      IERC721Upgradeable(asset).transferFrom(currentHolder, address(this), tokenId);
      originalDomainId = uint32(IConnext(connext).domain());
      originalAsset = asset;
    } else {
      IWrappedHashi721(asset).burn(tokenId);
      originalDomainId = originalDomainIds[asset];
      originalAsset = originalAssets[asset];
    }
    bytes memory callData = _encodeCallData(originalDomainId, originalAsset, to, tokenId, tokenURI);
    return _xCall(destination, relayerFee, slippage, callData);
  }

  function _xReceive(bytes memory callData) internal override {
    (
      uint32 originalDomainId,
      address originalAsset,
      address to,
      uint256 tokenId,
      string memory tokenURI
    ) = _decodeCallData(callData);
    if (originalDomainId != uint32(IConnext(connext).domain())) {
      bytes32 salt = keccak256(abi.encodePacked(originalDomainId, originalAsset));
      address asset = ClonesUpgradeable.predictDeterministicAddress(wrappedHashi721Implementation, salt);
      if (!AddressUpgradeable.isContract(asset)) {
        ClonesUpgradeable.cloneDeterministic(wrappedHashi721Implementation, salt);
        IWrappedHashi721(asset).initialize();
        originalDomainIds[asset] = originalDomainId;
        originalAssets[asset] = originalAsset;
      }
      IWrappedHashi721(asset).mint(to, tokenId, tokenURI);
    } else {
      address asset = originalAsset;
      IERC721Upgradeable(asset).safeTransferFrom(address(this), to, tokenId);
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
