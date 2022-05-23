// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

import "../../sdk/xNFTBridge.sol";
import "./xWrappedNFT.sol";

contract xNFTWrapBridge is xNFTBridge {
  mapping(address => address) public contracts;
  mapping(address => uint32) public domains;

  address public nftImplementation;

  constructor(
    uint32 _selfDomain,
    address _connext,
    address _dummyTransactingAssetId,
    address _nftImplementation
  ) xNFTBridge(_selfDomain, _connext, _dummyTransactingAssetId) {
    nftImplementation = _nftImplementation;
  }

  function xSend(
    address processingNFTContractAddress,
    address from,
    address to,
    uint256 tokenId,
    uint32 destinationDomain
  ) public {
    require(
      IERC721(processingNFTContractAddress).ownerOf(tokenId) == _msgSender() ||
        IERC721(processingNFTContractAddress).getApproved(tokenId) == _msgSender() ||
        IERC721(processingNFTContractAddress).isApprovedForAll(from, _msgSender()),
      "xNativeNFT: send caller is not owner nor approved"
    );
    require(IERC721(processingNFTContractAddress).ownerOf(tokenId) == from, "xNativeNFT: send from incorrect owner");

    address birthChainNFTContractAddress;
    uint32 birthChainDomain;

    if (contracts[processingNFTContractAddress] == address(0x0) && domains[processingNFTContractAddress] == 0) {
      birthChainNFTContractAddress = processingNFTContractAddress;
      birthChainDomain = selfDomain;
      IERC721(birthChainNFTContractAddress).transferFrom(from, address(this), tokenId);
    } else {
      birthChainNFTContractAddress = contracts[processingNFTContractAddress];
      birthChainDomain = domains[processingNFTContractAddress];
      xWrappedNFT(birthChainNFTContractAddress).burn(tokenId);
    }

    bytes4 selector = bytes4(keccak256("xReceive(address,address,uint256,uint32,uint32)"));

    bytes memory callData = abi.encodeWithSelector(
      selector,
      birthChainNFTContractAddress,
      to,
      tokenId,
      birthChainDomain,
      destinationDomain
    );
    _xcall(destinationDomain, callData);
  }

  function xReceive(
    address birthChainNFTContractAddress,
    address to,
    uint256 tokenId,
    uint32 birthChainDomain,
    uint32 destinationDomain
  ) public onlyExecutor {
    if (birthChainDomain == selfDomain) {
      if (destinationDomain == selfDomain) {
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
        _xcall(destinationDomain, callData);
      }
    } else {
      bytes32 salt = keccak256(abi.encodePacked(birthChainDomain, birthChainNFTContractAddress));
      address processingNFTContractAddress = Clones.predictDeterministicAddress(nftImplementation, salt, address(this));
      if (!Address.isContract(processingNFTContractAddress)) {
        Clones.cloneDeterministic(nftImplementation, salt);
        contracts[processingNFTContractAddress] = birthChainNFTContractAddress;
        domains[processingNFTContractAddress] = birthChainDomain;
        xWrappedNFT(processingNFTContractAddress).initialize();
      }
      xWrappedNFT(processingNFTContractAddress).mint(to, tokenId);
    }
  }
}
