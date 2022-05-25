// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "./INFTBridge.sol";

interface INFTNativeBridge is INFTBridge {
  function xSend(
    address from,
    address to,
    uint256 tokenId,
    uint32 sendToDomain
  ) external;

  function xReceive(address to, uint256 tokenId) external;
}
