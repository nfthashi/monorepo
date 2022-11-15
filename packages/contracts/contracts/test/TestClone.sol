// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";

contract TestClone {
  function predictDeterministicAddress(
    address implementation,
    bytes32 salt,
    address deployer
  ) public pure returns (address) {
    return ClonesUpgradeable.predictDeterministicAddress(implementation, salt, deployer);
  }
}
