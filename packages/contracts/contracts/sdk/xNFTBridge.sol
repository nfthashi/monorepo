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

  function register(uint32 _opponentDomain, address _opponentContract) public onlyOwner {
    allowList[_opponentDomain] = _opponentContract;
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
}
