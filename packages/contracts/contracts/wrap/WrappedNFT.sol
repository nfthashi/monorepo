// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol";

import "../interface/IWappedNFT.sol";

contract WrappedNFT is
  Initializable,
  ERC165Upgradeable,
  OwnableUpgradeable,
  ERC721Upgradeable,
  ERC721URIStorageUpgradeable,
  IWappedNFT
{
  function initialize(string memory name, string memory symbol) public initializer {
    __Ownable_init_unchained();
    __ERC721_init_unchained(name, symbol);
  }

  function mint(
    address to,
    uint256 tokenId,
    string memory _tokenURI
  ) public onlyOwner {
    _mint(to, tokenId);
    _setTokenURI(tokenId, _tokenURI);
  }

  function burn(uint256 tokenId) public onlyOwner {
    _burn(tokenId);
  }

  function _burn(uint256 tokenId) internal virtual override(ERC721Upgradeable, ERC721URIStorageUpgradeable) {
    return super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
  }

  function isNFTHashiWrappedNFT() public pure returns (bool) {
    return true;
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(IERC165, ERC165Upgradeable, ERC721Upgradeable)
    returns (bool)
  {
    return interfaceId == type(IWappedNFT).interfaceId || super.supportsInterface(interfaceId);
  }
}
