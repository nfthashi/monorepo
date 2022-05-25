// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";

contract MockClone {
  function predictDeterministicAddress(
    address implementation,
    bytes32 salt,
    address deployer
  ) public pure returns (address) {
    return Clones.predictDeterministicAddress(implementation, salt, deployer);
  }
}
