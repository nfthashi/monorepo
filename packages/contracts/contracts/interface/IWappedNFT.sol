// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

interface IWappedNFT is IERC165 {
  function initialize() external;

  function mint(address to, uint256 tokenId) external;

  function burn(uint256 tokenId) external;

  function isNFTHashiWrappedNFT() external view returns (bool);
}
