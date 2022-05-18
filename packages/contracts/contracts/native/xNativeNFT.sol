// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../xNFTBridge.sol";

contract xNativeNFT is xNFTBridge, ERC721 {
  uint256 public immutable startTokenId;
  uint256 public immutable endTokenId;

  uint256 public supplied;

  constructor(
    uint32 _selfDomain,
    address _connext,
    address _dummyTransactingAssetId,
    uint256 _startTokenId,
    uint256 _endTokenId
  ) xNFTBridge(_selfDomain, _connext, _dummyTransactingAssetId) ERC721("", "") {
    startTokenId = _startTokenId;
    endTokenId = _endTokenId;
  }

  function mint(address to) public {
    uint256 tokenId = startTokenId + supplied;
    require(tokenId <= endTokenId, "xNativeNFT: mint already finished");
    _mint(to, tokenId);
    supplied++;
  }

  function xSend(
    address from,
    address to,
    uint256 tokenId,
    uint32 destinationDomain
  ) public {
    address destinationContract = allowList[destinationDomain];
    require(destinationContract != address(0x0), "xNativeNFT: destination not allowed");
    require(_isApprovedOrOwner(_msgSender(), tokenId), "xNativeNFT: send caller is not owner nor approved");
    require(ownerOf(tokenId) == from, "xNativeNFT: send from incorrect owner");
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
