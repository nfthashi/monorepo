// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

import {IExecutor} from "@connext/nxtp-contracts/contracts/interfaces/IExecutor.sol";
import {IConnextHandler} from "@connext/nxtp-contracts/contracts/interfaces/IConnextHandler.sol";

contract xNativeBridge is Ownable {
  mapping(uint32 => address) public opponentMapper;

  address public immutable connext;
  address public immutable executor;

  uint256 public startTokenId;
  uint256 public endTokenId;

  modifier onlyExecutor() {
    require(
      IExecutor(msg.sender).originSender() == opponentMapper[IExecutor(msg.sender).origin()] && msg.sender == executor,
      "Expected origin contract on origin domain called by Executor"
    );
    _;
  }

  function register(uint32 _opponentDomain, address _opponentContract) public onlyOwner {
    opponentMapper[_opponentDomain] = _opponentContract;
  }

  constructor(
    uint256 _startTokenId,
    uint256 _endTokenId,
    address _connext
  ) {
    startTokenId = _startTokenId;
    endTokenId = _endTokenId;
    connext = _connext;
    executor = IConnextHandler(_connext).getExecutor();
  }
}
