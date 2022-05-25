// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "../interface/INFTWrapBridge.sol";

import "../core/NFTBridge.sol";
import "./WrappedNFT.sol";

contract NFTWrapBridge is ERC165, INFTWrapBridge, NFTBridge {
  mapping(address => address) private _contracts;
  mapping(address => uint32) private _domains;

  address private _nftImplementation;

  constructor(
    uint32 selfDomain,
    address connext,
    address dummyTransactingAssetId,
    address nftImplementation
  ) NFTBridge(selfDomain, connext, dummyTransactingAssetId) {
    _nftImplementation = nftImplementation;
  }

  function xSend(
    address processingNFTContractAddress,
    address from,
    address to,
    uint256 tokenId,
    uint32 sendToDomain
  ) public {
    require(
      IERC721(processingNFTContractAddress).ownerOf(tokenId) == _msgSender() ||
        IERC721(processingNFTContractAddress).getApproved(tokenId) == _msgSender() ||
        IERC721(processingNFTContractAddress).isApprovedForAll(from, _msgSender()),
      "NativeNFT: send caller is not owner nor approved"
    );
    require(IERC721(processingNFTContractAddress).ownerOf(tokenId) == from, "NativeNFT: send from incorrect owner");

    address birthChainNFTContractAddress;
    uint32 birthChainDomain;
    uint32 destinationDomain;

    if (_contracts[processingNFTContractAddress] != address(0x0) && _domains[processingNFTContractAddress] != 0) {
      birthChainNFTContractAddress = _contracts[processingNFTContractAddress];
      birthChainDomain = _domains[processingNFTContractAddress];
      destinationDomain = birthChainDomain;
      WrappedNFT(birthChainNFTContractAddress).burn(tokenId);
    } else {
      birthChainNFTContractAddress = processingNFTContractAddress;
      birthChainDomain = getSelfDomain();
      destinationDomain = sendToDomain;
      IERC721(birthChainNFTContractAddress).transferFrom(from, address(this), tokenId);
    }
    bytes4 selector = bytes4(keccak256("xReceive(address,address,uint256,uint32,uint32)"));
    bytes memory callData = abi.encodeWithSelector(
      selector,
      birthChainNFTContractAddress,
      to,
      tokenId,
      birthChainDomain,
      sendToDomain
    );
    _xcall(destinationDomain, callData);
  }

  function xReceive(
    address birthChainNFTContractAddress,
    address to,
    uint256 tokenId,
    uint32 birthChainDomain,
    uint32 sendToDomain
  ) public onlyExecutor {
    uint32 selfDomain = getSelfDomain();
    if (birthChainDomain == selfDomain) {
      if (sendToDomain == selfDomain) {
        IERC721(birthChainNFTContractAddress).safeTransferFrom(address(this), to, tokenId);
      } else {
        bytes4 selector = bytes4(keccak256("xReceive(address,address,uint256,uint32)"));
        bytes memory callData = abi.encodeWithSelector(
          selector,
          birthChainNFTContractAddress,
          to,
          tokenId,
          birthChainDomain
        );
        _xcall(sendToDomain, callData);
      }
    } else {
      bytes32 salt = keccak256(abi.encodePacked(birthChainDomain, birthChainNFTContractAddress));
      address processingNFTContractAddress = Clones.predictDeterministicAddress(
        _nftImplementation,
        salt,
        address(this)
      );
      if (!Address.isContract(processingNFTContractAddress)) {
        Clones.cloneDeterministic(_nftImplementation, salt);
        _contracts[processingNFTContractAddress] = birthChainNFTContractAddress;
        _domains[processingNFTContractAddress] = birthChainDomain;
        IWappedNFT(processingNFTContractAddress).initialize();
      }
      WrappedNFT(processingNFTContractAddress).mint(to, tokenId);
    }
  }

  function isNFTHashiWrapBridge() public pure returns (bool) {
    return true;
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(NFTBridge, ERC165, IERC165)
    returns (bool)
  {
    return interfaceId == type(INFTWrapBridge).interfaceId || super.supportsInterface(interfaceId);
  }
}
