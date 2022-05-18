// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {IExecutor} from "@connext/nxtp-contracts/contracts/interfaces/IExecutor.sol";
import {IConnextHandler} from "@connext/nxtp-contracts/contracts/interfaces/IConnextHandler.sol";

contract xNFTWrapBridge {
  address public opponentContract;
  uint32 public opponentDomain;

  address public immutable connext;
  address public immutable executor;

  modifier onlyExecutor() {
    require(
      IExecutor(msg.sender).originSender() == opponentContract &&
        IExecutor(msg.sender).origin() == opponentDomain &&
        msg.sender == executor,
      "Expected origin contract on origin domain called by Executor"
    );
    _;
  }

  constructor(
    address _opponentContract,
    uint32 _opponentDomain,
    address _connext
  ) {
    opponentContract = _opponentContract;
    opponentDomain = _opponentDomain;
    connext = _connext;
    executor = IConnextHandler(_connext).getExecutor();
  }
}
