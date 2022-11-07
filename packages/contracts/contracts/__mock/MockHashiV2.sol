// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "../Hashi721Bridge.sol";

contract MockHashi721BridgeV2 is Hashi721Bridge {
  uint256 public count;

  function inc(uint256 _count) public {
    count += _count;
  }
}
