// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

interface IWappedNFT is IERC165 {
  function initialize(string memory name, string memory symbol) external;

  function mint(
    address to,
    uint256 tokenId,
    string memory tokenURI
  ) external;

  function burn(uint256 tokenId) external;

  function isNFTHashiWrappedNFT() external view returns (bool);
}
