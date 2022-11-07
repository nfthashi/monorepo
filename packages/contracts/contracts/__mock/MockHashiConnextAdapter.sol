// // SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../HashiConnextAdapter.sol";

contract MockHashiConnextAdapter is HashiConnextAdapter {
  constructor(uint32 selfDomain, IConnext connext) {
    initialize(selfDomain, connext);
  }

  function initialize(uint32 selfDomain, IConnext connext) public initializer {
    __HashiConnextAdapter_init(selfDomain, connext);
  }

  function testXCall(
    uint32 destinationDomain,
    uint256 relayerFee,
    bytes memory callData
  ) public {
    _xcall(destinationDomain, relayerFee, callData);
  }
}
