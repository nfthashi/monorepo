// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";

contract MockNFT is ERC721PresetMinterPauserAutoId {
  // solhint-disable-next-line no-empty-blocks
  constructor(string memory baseURI) ERC721PresetMinterPauserAutoId("", "", baseURI) {}
}
