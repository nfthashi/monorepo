// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface INFTBridge {
  function setBridgeContract(uint32 domain, address bridgeContract) external;

  function getBridgeContract(uint32 domain) external view returns (address);

  function getSelfDomain() external view returns (uint32);

  function getConnext() external view returns (address);

  function getExecutor() external view returns (address);
}
