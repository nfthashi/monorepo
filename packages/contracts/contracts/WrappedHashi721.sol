// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";

import "./interfaces/IWrappedHashi721.sol";

contract WrappedHashi721 is IWrappedHashi721, OwnableUpgradeable, ERC721URIStorageUpgradeable {
  function initialize() external initializer {
    __Ownable_init_unchained();
    __ERC721_init_unchained("WrappedHashi721", "WHASHI721");
  }

  function mint(address to, uint256 tokenId, string memory _tokenURI) external onlyOwner {
    _mint(to, tokenId);
    _setTokenURI(tokenId, _tokenURI);
  }

  function burn(uint256 tokenId) external onlyOwner {
    _burn(tokenId);
  }
}
