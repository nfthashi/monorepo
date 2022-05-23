// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

import "@connext/nxtp-contracts/contracts/interfaces/IExecutor.sol";
import "@connext/nxtp-contracts/contracts/interfaces/IConnextHandler.sol";

contract xNFTBridge is Ownable {
  mapping(uint32 => address) public allowList;

  address public immutable connext;
  address public immutable executor;
  address public immutable dummyTransactingAssetId;

  uint32 public immutable selfDomain;

  modifier onlyExecutor() {
    IExecutor(msg.sender).originSender();
    require(
      IExecutor(msg.sender).originSender() == allowList[IExecutor(msg.sender).origin()] && msg.sender == executor,
      "xNativeBridge: Expected origin contract on origin domain called by Executor"
    );
    _;
  }

  constructor(
    uint32 _selfDomain,
    address _connext,
    address _dummyTransactingAssetId
  ) {
    selfDomain = _selfDomain;
    connext = _connext;
    executor = IConnextHandler(_connext).getExecutor();
    dummyTransactingAssetId = _dummyTransactingAssetId;
  }

  function register(uint32 _allowedDomain, address _allowedContract) public onlyOwner {
    allowList[_allowedDomain] = _allowedContract;
  }

  function _xcall(uint32 destinationDomain, bytes memory callData) internal {
    address destinationContract = allowList[destinationDomain];
    require(destinationContract != address(0x0), "xNFTBridge: destination not allowed");

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
}
