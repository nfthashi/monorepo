// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts-upgradeable/interfaces/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC721MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol";
import {IXReceiver} from "@connext/nxtp-contracts/contracts/core/connext/interfaces/IXReceiver.sol";

import "./HashiConnextAdapter.sol";
import "./interfaces/IWrappedHashi721.sol";

contract Hashi721Bridge is ERC165Upgradeable, HashiConnextAdapter, IXReceiver {
  mapping(address => address) private _contracts;
  mapping(address => uint32) private _domains;

  mapping(address => bool) private _nftAllowedList;
  bool private _isAllowListRequired;
  address private _nftImplementation;


  event AllowListSet(address nftContractAddress, bool isAllowed);
  event IsAllowListRequired(bool isAllowListRequired);
  event NFTImplementationSet(address nftImplementation);

  function initialize(
    uint32 selfDomain,
    IConnext connext,
    address nftImplementation
  ) public initializer {
    __Hashi721Bridge_init(selfDomain, connext, nftImplementation);
  }

  function setIsAllowListRequired(bool isRequired) public onlyOwner {
    _isAllowListRequired = isRequired;
    emit IsAllowListRequired(isRequired);
  }

  function setAllowList(address nftContractAddress, bool isAllowed) public onlyOwner {
    _nftAllowedList[nftContractAddress] = isAllowed;
    emit AllowListSet(nftContractAddress, isAllowed);
  }

  function setNftImplementation(address nftImplementation) public onlyOwner {
    _nftImplementation = nftImplementation;
    emit NFTImplementationSet(nftImplementation);
  }

  function xSend(
    address processingNFTContractAddress,
    address from,
    address to,
    uint256 tokenId,
    uint32 sendToDomain,
    bool isTokenURIIncluded
  ) public payable {
    _validateNFT(processingNFTContractAddress);
    _validateAuthorization(processingNFTContractAddress, from, tokenId);

    address birthChainNFTContractAddress;
    uint32 birthChainDomain;
    uint32 destinationDomain;

    string memory tokenURI;
    if (isTokenURIIncluded) {
      tokenURI = IERC721MetadataUpgradeable(processingNFTContractAddress).tokenURI(tokenId);
    }

    if (_contracts[processingNFTContractAddress] == address(0x0) && _domains[processingNFTContractAddress] == 0) {
      birthChainNFTContractAddress = processingNFTContractAddress;
      birthChainDomain = getSelfDomain();
      destinationDomain = sendToDomain;
      IERC721Upgradeable(birthChainNFTContractAddress).transferFrom(from, address(this), tokenId);
    } else {
      birthChainNFTContractAddress = _contracts[processingNFTContractAddress];
      birthChainDomain = _domains[processingNFTContractAddress];
      destinationDomain = birthChainDomain;
      IWrappedHashi721(processingNFTContractAddress).burn(tokenId);
    }

    bytes memory callData = abi.encodePacked(
      birthChainNFTContractAddress,
      to,
      tokenId,
      birthChainDomain,
      tokenURI
    );
    uint256 relayerFee = 0;
    _xcall(destinationDomain, relayerFee, callData);
  }

  function xReceive(
    bytes32 _transferId,
    uint256 _amount,
    address _asset,
    address _originSender,
    uint32 _origin,
    bytes memory _callData
  ) external onlySource(_originSender, _origin) returns(bytes memory) {
    (
    address birthChainNFTContractAddress,
    address to,
    uint256 tokenId,
    uint32 birthChainDomain,
    string memory tokenURI
  ) = abi.decode(_callData, (address, address, uint256, uint32, string));

    uint32 selfDomain = getSelfDomain();
    if (birthChainDomain == selfDomain) {
      IERC721Upgradeable(birthChainNFTContractAddress).safeTransferFrom(address(this), to, tokenId);
    } else {
      bytes32 salt = keccak256(abi.encodePacked(birthChainDomain, birthChainNFTContractAddress));
      address processingNFTContractAddress = ClonesUpgradeable.predictDeterministicAddress(
        _nftImplementation,
        salt,
        address(this)
      );
      if (!AddressUpgradeable.isContract(processingNFTContractAddress)) {
        ClonesUpgradeable.cloneDeterministic(_nftImplementation, salt);
        _contracts[processingNFTContractAddress] = birthChainNFTContractAddress;
        _domains[processingNFTContractAddress] = birthChainDomain;
        IWrappedHashi721(processingNFTContractAddress).initialize();
      }
      IWrappedHashi721(processingNFTContractAddress).mint(to, tokenId, tokenURI);
    }
  }

  function isAllowListRequired() public view returns (bool) {
    return _isAllowListRequired;
  }

  function isAllowed(address nftContractAddress) public view returns (bool) {
    return _nftAllowedList[nftContractAddress];
  }

  function isWrappedNFT(address nftContractAddress) public view returns (bool) {
    return _contracts[nftContractAddress] != address(0x0) && _domains[nftContractAddress] != 0;
  }

  // solhint-disable-next-line func-name-mixedcase
  function __Hashi721Bridge_init(
    uint32 selfDomain,
    IConnext connext,
    address nftImplementation
  ) internal onlyInitializing {
    __Ownable_init_unchained();
    __HashiConnextAdapter_init_unchained(selfDomain, connext);
    __Hashi721Bridge_init_unchained(nftImplementation);
  }

  // solhint-disable-next-line func-name-mixedcase
  function __Hashi721Bridge_init_unchained(address nftImplementation) internal onlyInitializing {
    _nftImplementation = nftImplementation;
  }

  function _validateNFT(address nftContractAddress) internal {
    if (isAllowListRequired()) {
      require(isWrappedNFT(nftContractAddress) || isAllowed(nftContractAddress), "Hashi721Bridge: invalid nft");
    }
  }

  function _validateAuthorization(
    address nftContractAddress,
    address from,
    uint256 tokenId
  ) internal {
    require(
      IERC721Upgradeable(nftContractAddress).ownerOf(tokenId) == _msgSender() ||
        IERC721Upgradeable(nftContractAddress).getApproved(tokenId) == _msgSender() ||
        IERC721Upgradeable(nftContractAddress).isApprovedForAll(from, _msgSender()),
      "Hashi721Bridge: invalid sender"
    );

    require(IERC721Upgradeable(nftContractAddress).ownerOf(tokenId) == from, "Hashi721Bridge: invalid from");
  }
}
