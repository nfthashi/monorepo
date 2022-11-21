// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../HashiConnextAdapter.sol";

contract TestHashiConnextAdapter is HashiConnextAdapter {
  event XReceiveCalled(bytes callData);

  function _xReceive(bytes memory callData) internal override {
    emit XReceiveCalled(callData);
  }

  function initialize(address connext_) external initializer {
    __HashiConnextAdapter_init(connext_);
  }

  function testHashiConnextAdapterInit(address connext_) external {
    __HashiConnextAdapter_init(connext_);
  }

  function testHashiConnextAdapterInitUnchained(address connext_) external {
    __HashiConnextAdapter_init_unchained(connext_);
  }

  function testXCall(uint32 destination, uint256 relayerFee, uint256 slippage, bytes memory callData) external {
    _xCall(destination, relayerFee, slippage, callData);
  }

  function testXReceive(bytes memory callData) external {
    super._xReceive(callData);
  }
}
