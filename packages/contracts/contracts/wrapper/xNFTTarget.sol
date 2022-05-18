// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

import "../xNFTBridge.sol";
import "./xWrappedNFT.sol";

abstract contract xNFTTarget is xNFTBridge {
  mapping(address => address) public contracts;

  constructor(
    uint32 _selfDomain,
    address _connext,
    address _dummyTransactingAssetId
  ) xNFTBridge(_selfDomain, _connext, _dummyTransactingAssetId) {}

  function xSend(
    address wrappedNFTContractAddress,
    address from,
    address to,
    uint256 tokenId,
    uint32 destinationDomain
  ) public {
    address destinationContract = allowList[destinationDomain];
    require(destinationContract != address(0x0), "xNativeNFT: destination not allowed");

    require(
      IERC721(wrappedNFTContractAddress).ownerOf(tokenId) == _msgSender() ||
        IERC721(wrappedNFTContractAddress).getApproved(tokenId) == _msgSender() ||
        IERC721(wrappedNFTContractAddress).isApprovedForAll(from, _msgSender()),
      "xNativeNFT: send caller is not owner nor approved"
    );
    require(IERC721(wrappedNFTContractAddress).ownerOf(tokenId) == from, "xNativeNFT: send from incorrect owner");
    xWrappedNFT(wrappedNFTContractAddress).burn(tokenId);

    address originalNFTContractAddress = contracts[wrappedNFTContractAddress];
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
    address originalNFTContractAddress,
    address to,
    uint256 tokenId
  ) public onlyExecutor {
    uint32 originDomain = IExecutor(msg.sender).origin();
    address originSender = IExecutor(msg.sender).originSender();
    bytes32 salt = keccak256(abi.encodePacked(originDomain, originSender, originalNFTContractAddress));
    bytes memory creationCode = type(xWrappedNFT).creationCode;
    address wrappedNFTContractAddress = Create2.computeAddress(salt, keccak256(creationCode));
    if (!Address.isContract(wrappedNFTContractAddress)) {
      Create2.deploy(0, salt, creationCode);
      contracts[wrappedNFTContractAddress] = originalNFTContractAddress;
    }
    xWrappedNFT(wrappedNFTContractAddress).mint(to, tokenId);
  }
}
