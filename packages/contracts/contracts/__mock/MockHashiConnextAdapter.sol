// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../HashiConnextAdapter.sol";

contract MockHashiConnextAdapter is HashiConnextAdapter {
  constructor(
    uint32 selfDomain,
    address connext,
    address transactingAssetId
  ) {
    initialize(selfDomain, connext, transactingAssetId);
  }

  function initialize(
    uint32 selfDomain,
    address connext,
    address transactingAssetId
  ) public initializer {
    __HashiConnextAdapter_init(selfDomain, connext, transactingAssetId);
  }

  // solhint-disable-next-line no-empty-blocks
  function testOnlyExecutor() public onlyExecutor {}

  function testXCall(uint32 destinationDomain, bytes memory callData) public {
    _xcall(destinationDomain, callData);
  }
}
