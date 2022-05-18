// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./xNativeBridge.sol";

abstract contract xNativeNFT is xNativeBridge, ERC721 {
  string public baseTokenURI;

  uint256 public immutable startTokenId;
  uint256 public immutable endTokenId;

  uint256 public supplied;

  constructor(
    uint32 _selfDomain,
    address _connext,
    address _dummyTransactingAssetId,
    string memory _name,
    string memory _symbol,
    string memory _baseTokenURI,
    uint256 _startTokenId,
    uint256 _endTokenId
  ) xNativeBridge(_selfDomain, _connext, _dummyTransactingAssetId) ERC721(_name, _symbol) {
    baseTokenURI = _baseTokenURI;
    startTokenId = _startTokenId;
    endTokenId = _endTokenId;
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return baseTokenURI;
  }

  function mint(address to) public {
    uint256 tokenId = startTokenId + supplied;
    require(tokenId <= endTokenId, "xNativeNFT: mint already finished");
    _mint(to, tokenId);
    supplied++;
  }

  function xSend(
    uint32 destinationDomain,
    address from,
    address to,
    uint256 tokenId
  ) public {
    address destinationContract = allowList[destinationDomain];
    require(to != address(0x0), "xNativeNFT: destination not allowed");
    require(_isApprovedOrOwner(_msgSender(), tokenId), "xNativeNFT: send caller is not owner nor approved");
    require(ERC721.ownerOf(tokenId) == from, "xNativeNFT: send from incorrect owner");
    _burn(tokenId);
    bytes4 selector = bytes4(keccak256("xReceive(address,uint256)"));
    bytes memory callData = abi.encodeWithSelector(selector, to, tokenId);

    IConnextHandler.CallParams memory callParams = IConnextHandler.CallParams({
      to: destinationContract,
      callData: callData,
      originDomain: selfDomain,
      destinationDomain: destinationDomain,
      forceSlow: true,
      receiveLocal: false
    });

    IConnextHandler.XCallArgs memory xcallArgs = IConnextHandler.XCallArgs({
      params: callParams,
      transactingAssetId: dummyTransactingAssetId,
      amount: 0,
      relayerFee: 0
    });

    IConnextHandler(connext).xcall(xcallArgs);
  }

  function xReceive(address to, uint256 tokenId) public onlyExecutor {
    _mint(to, tokenId);
  }
}
