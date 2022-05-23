// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

import "../../sdk/xNFTBridge.sol";
import "./xWrappedNFT.sol";

contract xNFTTarget is xNFTBridge {
  mapping(address => address) public contracts;

  address public nftImplementation;

  constructor(
    uint32 _selfDomain,
    address _connext,
    address _dummyTransactingAssetId,
    address _nftImplementation
  ) xNFTBridge(_selfDomain, _connext, _dummyTransactingAssetId) {
    nftImplementation = _nftImplementation;
  }

  function wrap(
    uint32 originDomain,
    address originSender,
    address originalNFTContractAddress
  ) public {
    address originContract = allowList[originDomain];
    require(originContract != address(0x0), "xNativeNFT: origin not allowed");
    bytes32 salt = keccak256(abi.encodePacked(originDomain, originSender, originalNFTContractAddress));
    address wrappedNFTContractAddress = Clones.predictDeterministicAddress(nftImplementation, salt, address(this));
    if (!Address.isContract(wrappedNFTContractAddress)) {
      Clones.cloneDeterministic(nftImplementation, salt);
      contracts[wrappedNFTContractAddress] = originalNFTContractAddress;
      xWrappedNFT(wrappedNFTContractAddress).initialize();
    }
  }

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
    address wrappedNFTContractAddress = Clones.predictDeterministicAddress(nftImplementation, salt, address(this));
    if (!Address.isContract(wrappedNFTContractAddress)) {
      Clones.cloneDeterministic(nftImplementation, salt);
      contracts[wrappedNFTContractAddress] = originalNFTContractAddress;
      xWrappedNFT(wrappedNFTContractAddress).initialize();
    }
    xWrappedNFT(wrappedNFTContractAddress).mint(to, tokenId);
  }
}
