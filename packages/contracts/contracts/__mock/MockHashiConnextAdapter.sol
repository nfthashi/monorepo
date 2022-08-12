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
  function testOnlyExecutor(uint32 version) public onlyExecutor(version) {}

  function testXCall(
    uint32 destinationDomain,
    uint32 destinationDomainVersion,
    bytes memory callData
  ) public {
    _xcall(destinationDomain, destinationDomainVersion, callData);
  }
}
