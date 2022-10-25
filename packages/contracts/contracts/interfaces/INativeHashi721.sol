// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/interfaces/IERC165Upgradeable.sol";

interface INativeHashi721 is IERC165Upgradeable {
  function xSend(
    address from,
    address to,
    uint256 tokenId,
    uint32 sendToDomain
  ) external;

  function isNativeHashi721() external view returns (bool);
}
