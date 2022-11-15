// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC721MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

import "@connext/nxtp-contracts/contracts/core/connext/interfaces/IConnext.sol";
import "@connext/nxtp-contracts/contracts/core/connext/interfaces/IXReceiver.sol";

import "./interfaces/IWrappedHashi721.sol";

contract Hashi721Bridge is IXReceiver, OwnableUpgradeable, ERC721HolderUpgradeable {
  mapping(address => address) public birthChainNFTContractAddresses;
  mapping(address => uint32) public birthDomains;
  mapping(uint32 => address) public bridgeContracts;

  uint32 public domain;
  IConnext public connext;

  address public nftImplementation;

  function initialize(uint32 domain_, IConnext connext_, address nftImplementation_) public virtual initializer {
    __Ownable_init_unchained();
    domain = domain_;
    connext = connext_;
    nftImplementation = nftImplementation_;
  }

  function xSend(
    address nftContractAddress,
    address from,
    address to,
    uint256 tokenId,
    uint32 destinationDomain,
    bool isTokenURIIncluded,
    uint256 slippage
  ) public payable returns (bytes32) {
    address bridgeContract = bridgeContracts[destinationDomain];
    require(bridgeContract != address(0), "Hashi721Bridge: invalid domain");
    require(
      IERC721Upgradeable(nftContractAddress).ownerOf(tokenId) == _msgSender() ||
        IERC721Upgradeable(nftContractAddress).getApproved(tokenId) == _msgSender() ||
        IERC721Upgradeable(nftContractAddress).isApprovedForAll(from, _msgSender()),
      "Hashi721Bridge: invalid msg sender"
    );
    string memory tokenURI;
    if (isTokenURIIncluded) {
      tokenURI = IERC721MetadataUpgradeable(nftContractAddress).tokenURI(tokenId);
    }
    address birthChainNFTContractAddress;
    uint32 birthDomain;
    if (birthChainNFTContractAddresses[nftContractAddress] != address(0x0) && birthDomains[nftContractAddress] != 0) {
      birthChainNFTContractAddress = birthChainNFTContractAddresses[nftContractAddress];
      birthDomain = birthDomains[nftContractAddress];
      IWrappedHashi721(nftContractAddress).burn(tokenId);
    } else {
      birthChainNFTContractAddress = nftContractAddress;
      birthDomain = domain;
      IERC721Upgradeable(birthChainNFTContractAddress).transferFrom(from, address(this), tokenId);
    }
    bytes memory callData = abi.encode(birthChainNFTContractAddress, to, tokenId, birthDomain, tokenURI);
    return
      connext.xcall{value: msg.value}(
        destinationDomain,
        bridgeContract,
        address(0x0),
        _msgSender(),
        0,
        slippage,
        callData
      );
  }

  function xReceive(
    bytes32 transferId,
    uint256 amount,
    address asset,
    address originSender,
    uint32 origin,
    bytes memory callData
  ) external returns (bytes memory) {
    require(_msgSender() == address(connext), "Hashi721Bridge: invalid msg sender");
    require(originSender == bridgeContracts[origin], "Hashi721Bridge: invalid origin sender");
    (
      address birthChainNFTContractAddress,
      address to,
      uint256 tokenId,
      uint32 birthDomain,
      string memory tokenURI
    ) = abi.decode(callData, (address, address, uint256, uint32, string));

    if (birthDomain == domain) {
      IERC721Upgradeable(birthChainNFTContractAddress).safeTransferFrom(address(this), to, tokenId);
    } else {
      bytes32 salt = keccak256(abi.encodePacked(birthDomain, birthChainNFTContractAddress));
      address nftContractAddress = ClonesUpgradeable.predictDeterministicAddress(
        nftImplementation,
        salt,
        address(this)
      );
      if (!AddressUpgradeable.isContract(nftContractAddress)) {
        ClonesUpgradeable.cloneDeterministic(nftImplementation, salt);
        IWrappedHashi721(nftContractAddress).initialize();
        birthChainNFTContractAddresses[nftContractAddress] = birthChainNFTContractAddress;
        birthDomains[nftContractAddress] = birthDomain;
      }
      IWrappedHashi721(nftContractAddress).mint(to, tokenId, tokenURI);
    }
  }
}
