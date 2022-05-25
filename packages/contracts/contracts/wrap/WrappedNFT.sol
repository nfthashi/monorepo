// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import "../interface/IWappedNFT.sol";

contract WrappedNFT is Initializable, OwnableUpgradeable, ERC721Upgradeable, IWappedNFT, ERC165 {
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

  function isNFTHashiWrappedNFT() public pure returns (bool) {
    return true;
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC721Upgradeable, ERC165, IERC165)
    returns (bool)
  {
    return interfaceId == type(IWappedNFT).interfaceId || super.supportsInterface(interfaceId);
  }
}
