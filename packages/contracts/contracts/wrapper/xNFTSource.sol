// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "../xNFTBridge.sol";

contract xNFTSource is xNFTBridge {
  constructor(
    uint32 _selfDomain,
    address _connext,
    address _dummyTransactingAssetId
  ) xNFTBridge(_selfDomain, _connext, _dummyTransactingAssetId) {}

  function xSend(
    address originalNFTContractAddress,
    address from,
    address to,
    uint256 tokenId,
    uint32 destinationDomain
  ) public {
    address destinationContract = allowList[destinationDomain];
    require(destinationContract != address(0x0), "xNFTSource: destination not allowed");
    require(
      IERC721(originalNFTContractAddress).ownerOf(tokenId) == _msgSender() ||
        IERC721(originalNFTContractAddress).getApproved(tokenId) == _msgSender() ||
        IERC721(originalNFTContractAddress).isApprovedForAll(from, _msgSender()),
      "xNativeNFT: send caller is not owner nor approved"
    );
    require(IERC721(originalNFTContractAddress).ownerOf(tokenId) == from, "xNativeNFT: send from incorrect owner");

    IERC721(originalNFTContractAddress).transferFrom(from, address(this), tokenId);

    bytes4 selector = bytes4(keccak256("xReceive(address,address,uint256)"));
    bytes memory callData = abi.encodeWithSelector(selector, originalNFTContractAddress, to, tokenId);

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

  function xReceive(
    address nftContractAddress,
    address to,
    uint256 tokenId
  ) public onlyExecutor {
    IERC721(nftContractAddress).safeTransferFrom(address(this), to, tokenId);
  }
}
