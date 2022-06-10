// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

interface INativeHashi721 is IERC165 {
  function xSend(
    address from,
    address to,
    uint256 tokenId,
    uint32 sendToDomain
  ) external;

  function xReceive(address to, uint256 tokenId) external;

  function isNativeHashi721() external view returns (bool);
}
