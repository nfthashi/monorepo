// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

interface IWrappedHashi721 is IERC165 {
  function initialize() external;

  function mint(
    address to,
    uint256 tokenId,
    string memory tokenURI
  ) external;

  function burn(uint256 tokenId) external;

  function isWrappedHashi721() external view returns (bool);
}
