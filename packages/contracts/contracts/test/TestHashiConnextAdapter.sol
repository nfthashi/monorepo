// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../HashiConnextAdapter.sol";

contract TestHashiConnextAdapter is HashiConnextAdapter {
  event XReceiveCalled(bytes callData);

  function initialize(address connext_, uint32 domainId_) public initializer {
    __HashiConnextAdapter_init(connext_, domainId_);
  }

  function testHashiConnextAdapterInit(address connext_, uint32 domainId_) public {
    __HashiConnextAdapter_init(connext_, domainId_);
  }

  function testHashiConnextAdapterInitUnchained(address connext_, uint32 domainId_) public {
    __HashiConnextAdapter_init_unchained(connext_, domainId_);
  }

  function testXCall(uint32 destination, uint256 relayerFee, uint256 slippage, bytes memory callData) public {
    _xCall(destination, relayerFee, slippage, callData);
  }

  function testAfterXReceive(bytes memory callData) public {
    super._afterXReceive(callData);
  }

  function _afterXReceive(bytes memory callData) internal override {
    emit XReceiveCalled(callData);
  }
}
