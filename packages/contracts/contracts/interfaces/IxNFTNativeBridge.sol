// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "./IxNFTBridge.sol";

interface IxNFTNativeBridge is IxNFTBridge {
    function xSend(
    address from,
    address to,
    uint256 tokenId,
    uint32 toDomain
    ) external;
    function xReceive(address to, uint256 tokenId) external;
}