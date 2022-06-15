// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../HashiConnextAdapter.sol";

contract MockHashiConnextAdapter is HashiConnextAdapter {
  function testOnlyExecutor() public onlyExecutor {}

  function testXCall(uint32 destinationDomain, bytes memory callData) public {
    _xcall(destinationDomain, callData);
  }

  constructor(
    uint32 selfDomain,
    address connext,
    address transactingAssetId
  ) HashiConnextAdapter(selfDomain, connext, transactingAssetId) {}
}
