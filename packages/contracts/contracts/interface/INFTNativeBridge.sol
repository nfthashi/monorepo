// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "./INFTBridge.sol";

interface INFTNativeBridge is IERC165, INFTBridge {
  function xSend(
    address from,
    address to,
    uint256 tokenId,
    uint32 sendToDomain
  ) external;

  function xReceive(address to, uint256 tokenId) external;

  function isNFTHashiNativeBridge() external view returns (bool);
}
