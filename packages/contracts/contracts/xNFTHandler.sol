// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {IExecutor} from "@connext/nxtp-contracts/contracts/interfaces/IExecutor.sol";
import {IConnextHandler} from "@connext/nxtp-contracts/contracts/interfaces/IConnextHandler.sol";

contract xNFTHandler {
  address public originContract;
  uint32 public originDomain;
  address public executor;

  modifier onlyExecutor() {
    require(
      IExecutor(msg.sender).originSender() == originContract &&
        IExecutor(msg.sender).origin() == originDomain &&
        msg.sender == executor,
      "Expected origin contract on origin domain called by Executor"
    );
    _;
  }

  constructor(
    address _originContract,
    uint32 _originDomain,
    IConnextHandler _connext
  ) {
    originContract = _originContract;
    originDomain = _originDomain;
    executor = IConnextHandler(_connext).getExecutor();
  }
}
