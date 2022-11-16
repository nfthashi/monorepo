// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IHashi721Bridge {
  function initialize(address connext_, address wrappedHashi721Implementation_) external;

  function xCall(
    uint32 destination,
    uint256 relayerFee,
    uint256 slippage,
    address asset,
    address to,
    uint256 tokenId,
    bool isTokenURIIgnored
  ) external payable returns (bytes32);
}
