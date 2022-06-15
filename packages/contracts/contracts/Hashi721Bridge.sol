// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC721Metadata.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import "./HashiConnextAdapter.sol";
import "./interfaces/IWrappedHashi721.sol";

contract Hashi721Bridge is ERC165, HashiConnextAdapter {
  mapping(address => address) private _contracts;
  mapping(address => uint32) private _domains;

  address private _nftImplementation;

  constructor(
    uint32 selfDomain,
    address connext,
    address dummyTransactingAssetId,
    address nftImplementation
  ) HashiConnextAdapter(selfDomain, connext, dummyTransactingAssetId) {
    _nftImplementation = nftImplementation;
  }

  function xSend(
    address processingNFTContractAddress,
    address from,
    address to,
    uint256 tokenId,
    uint32 sendToDomain,
    bool isTokenURIIncluded
  ) public {
    require(
      IERC165(processingNFTContractAddress).supportsInterface(type(IERC721).interfaceId),
      "Hashi721Bridge: invalid nft"
    );
    require(
      IERC721(processingNFTContractAddress).ownerOf(tokenId) == _msgSender() ||
        IERC721(processingNFTContractAddress).getApproved(tokenId) == _msgSender() ||
        IERC721(processingNFTContractAddress).isApprovedForAll(from, _msgSender()),
      "Hashi721Bridge: invalid sender"
    );
    require(IERC721(processingNFTContractAddress).ownerOf(tokenId) == from, "Hashi721Bridge: invalid from");

    address birthChainNFTContractAddress;
    uint32 birthChainDomain;
    uint32 destinationDomain;

    string memory tokenURI;
    if (isTokenURIIncluded) {
      tokenURI = IERC721Metadata(processingNFTContractAddress).tokenURI(tokenId);
    }

    if (_contracts[processingNFTContractAddress] == address(0x0) && _domains[processingNFTContractAddress] == 0) {
      birthChainNFTContractAddress = processingNFTContractAddress;
      birthChainDomain = getSelfDomain();
      destinationDomain = sendToDomain;
      IERC721(birthChainNFTContractAddress).transferFrom(from, address(this), tokenId);
    } else {
      birthChainNFTContractAddress = _contracts[processingNFTContractAddress];
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
      tokenURI
    );
    _xcall(destinationDomain, callData);
  }

  function xReceive(
    address birthChainNFTContractAddress,
    address to,
    uint256 tokenId,
    uint32 birthChainDomain,
    string memory tokenURI
  ) public onlyExecutor {
    uint32 selfDomain = getSelfDomain();
    if (birthChainDomain == selfDomain) {
      IERC721(birthChainNFTContractAddress).safeTransferFrom(address(this), to, tokenId);
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
        IWrappedHashi721(processingNFTContractAddress).initialize();
      }
      IWrappedHashi721(processingNFTContractAddress).mint(to, tokenId, tokenURI);
    }
  }
}
