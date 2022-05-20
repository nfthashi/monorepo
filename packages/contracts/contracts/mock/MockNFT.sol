// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";

contract MockNFT is ERC721PresetMinterPauserAutoId {
  //TODO: manage metadata
  constructor() ERC721PresetMinterPauserAutoId("", "", "") {}
}
