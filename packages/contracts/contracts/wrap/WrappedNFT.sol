// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";

contract WrappedNFT is Initializable, OwnableUpgradeable, ERC721Upgradeable {
  //TODO: manage metadata
  function initialize() public initializer {
    __Ownable_init_unchained();
    __ERC721_init_unchained("", "");
  }

  function mint(address to, uint256 tokenId) public onlyOwner {
    _mint(to, tokenId);
  }

  function burn(uint256 tokenId) public onlyOwner {
    _burn(tokenId);
  }
}
