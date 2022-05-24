// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IxNFTBridge {
  function allowList(uint32) external view returns(address);
  function register(uint32 _allowedDomain, address _allowedContract) external;
}
