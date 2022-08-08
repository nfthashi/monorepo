// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/interfaces/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC721MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol";

import "./HashiConnextAdapter.sol";
import "./interfaces/IWrappedHashi721.sol";

contract Hashi721Bridge is ERC165Upgradeable, HashiConnextAdapter {
  mapping(address => address) private _contracts;
  mapping(address => uint32) private _domains;
  mapping(bytes32 => uint32) private _versions;

  mapping(bytes32 => bytes32) private _destiations;

  mapping(address => bool) private _nftAllowedList;
  bool private _isAllowListRequired;

  address private _nftImplementation;

  event AllowListSet(address nftContractAddress, bool isAllowed);
  event IsAllowListRequired(bool isAllowListRequired);

  function initialize(
    uint32 selfDomain,
    address connext,
    address dummyTransactingAssetId,
    address nftImplementation
  ) public initializer {
    __Hashi721Bridge_init(selfDomain, connext, dummyTransactingAssetId, nftImplementation);
  }

  // TODO : Pausableを追加する
  // TODO : Callbackを良い感じに使えるようにする

  function xSend(
    address processingNFTContractAddress,
    address from,
    address to,
    uint256 tokenId,
    uint32 sendToDomain,
    uint32 version,
    bool isTokenURIIncluded
  ) public {
    _validateNFT(processingNFTContractAddress);
    _validateAuthorization(processingNFTContractAddress, from, tokenId);

    address birthChainNFTContractAddress;
    uint32 birthChainDomain;
    uint32 destinationDomain;
    uint32 destinationDomainVersion = version;

    string memory tokenURI;
    if (isTokenURIIncluded) {
      tokenURI = IERC721MetadataUpgradeable(processingNFTContractAddress).tokenURI(tokenId);
    }

    if (_contracts[processingNFTContractAddress] == address(0x0) && _domains[processingNFTContractAddress] == 0) {
      birthChainNFTContractAddress = processingNFTContractAddress;
      birthChainDomain = getSelfDomain();
      destinationDomain = sendToDomain;
      IERC721Upgradeable(birthChainNFTContractAddress).transferFrom(from, address(this), tokenId);

      // TODO : 特定のNFTをどのチェーンのどのコントラクトにブリッジしたかをMappingに保持
      bytes32 key = keccak256(abi.encodePacked(birthChainNFTContractAddress, tokenId));
      bytes32 value = keccak256(
        abi.encodePacked(
          destinationDomain,
          bridgeContracts[keccak256(abi.encodePacked(destinationDomain, version))]
        )
      );
      _destiations[key] = value;
    } else {
      birthChainNFTContractAddress = _contracts[processingNFTContractAddress];
      destinationDomainVersion = _versions[keccak256(abi.encodePacked(birthChainNFTContractAddress, tokenId))];
      birthChainDomain = _domains[processingNFTContractAddress];
      destinationDomain = birthChainDomain;
      IWrappedHashi721(processingNFTContractAddress).burn(tokenId);
    }

    bytes memory callData = abi.encodeWithSelector(
      this.xReceive.selector,
      birthChainNFTContractAddress,
      to,
      tokenId,
      birthChainDomain,
      version,
      tokenURI
    );
    _xcall(destinationDomain, destinationDomainVersion, callData);
  }

  function xReceive(
    address birthChainNFTContractAddress,
    address to,
    uint256 tokenId,
    uint32 birthChainDomain,
    uint32 version,
    string memory tokenURI
  ) public onlyExecutor(version) {
    uint32 selfDomain = getSelfDomain();
    // TODO : originDomain, Contract をExecutorから取得
    uint32 originDomain = IExecutor(msg.sender).origin();
    address originSender = IExecutor(msg.sender).originSender();
    if (birthChainDomain == selfDomain) {
      // TODO : 上記のMappingでvalidationする
      _validateBridgeContract(birthChainNFTContractAddress, tokenId, originDomain, originSender);
      IERC721Upgradeable(birthChainNFTContractAddress).safeTransferFrom(address(this), to, tokenId);
    } else {
      // TODO : Destination Domainがselfと一致しているかをチェック (優先度低)
      // Yes
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
      _versions[keccak256(abi.encodePacked(birthChainNFTContractAddress, tokenId))] = version;

      // No
      // Destination chainへそのままxCallを送る

      // call Dataの作成
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
    address connext,
    address dummyTransactingAssetId,
    address nftImplementation
  ) internal onlyInitializing {
    __Ownable_init_unchained();
    __HashiConnextAdapter_init_unchained(selfDomain, connext, dummyTransactingAssetId);
    __Hashi721Bridge_init_unchained(nftImplementation);
  }

  // solhint-disable-next-line func-name-mixedcase
  function __Hashi721Bridge_init_unchained(address nftImplementation) internal onlyInitializing {
    _nftImplementation = nftImplementation;
  }

  function _validateNFT(address nftContractAddress) internal view {
    if (isAllowListRequired()) {
      require(isWrappedNFT(nftContractAddress) || isAllowed(nftContractAddress), "Hashi721Bridge: invalid nft");
    }
  }

  function _validateBridgeContract(
    address nftContractAddress,
    uint256 tokenId,
    uint32 domainId,
    address nfthashiContractAddress
  ) internal view {
    require(
      _destiations[keccak256(abi.encodePacked(nftContractAddress, tokenId))] ==
        keccak256(abi.encodePacked(domainId, nfthashiContractAddress))
    );
  }

  function _validateAuthorization(
    address nftContractAddress,
    address from,
    uint256 tokenId
  ) internal view {
    require(
      IERC721Upgradeable(nftContractAddress).ownerOf(tokenId) == _msgSender() ||
        IERC721Upgradeable(nftContractAddress).getApproved(tokenId) == _msgSender() ||
        IERC721Upgradeable(nftContractAddress).isApprovedForAll(from, _msgSender()),
      "Hashi721Bridge: invalid sender"
    );

    require(IERC721Upgradeable(nftContractAddress).ownerOf(tokenId) == from, "Hashi721Bridge: invalid from");
  }
}
