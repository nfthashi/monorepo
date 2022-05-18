// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./xNFTWrapBridge.sol";

abstract contract xNFTSource is xNFTWrapBridge {
  function xSend() public {}

  function xReceive() public onlyExecutor {}
}
