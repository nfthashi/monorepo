// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "./INFTBridge.sol";

interface INFTWrapBridge is IERC165, INFTBridge {
  function xSend(
    address processingNFTContractAddress,
    address from,
    address to,
    uint256 tokenId,
    uint32 sendToDomain
  ) external;

  function xReceive(
    address birthChainNFTContractAddress,
    address to,
    uint256 tokenId,
    uint32 birthChainDomain,
    uint32 sendToDomain
  ) external;

  function isNFTHashiWrapBridge() external view returns (bool);
}
