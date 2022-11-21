// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IWrappedHashi721 {
  function initialize() external;

  function mint(address to, uint256 tokenId, string memory tokenURI) external;

  function burn(uint256 tokenId) external;
}
