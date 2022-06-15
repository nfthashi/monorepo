// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract HashiFaucetERC721 is ERC721 {
  uint256 public supplied;
  string private _baseTokenURI;

  constructor() ERC721("HashiFaucetERC721", "HASHIF721") {
    _baseTokenURI = "https://raw.githubusercontent.com/nfthashi/monorepo/main/packages/web/public/assets/metadata/metadata.json";
  }

  function mint() public {
    _safeMint(msg.sender, supplied);
    ++supplied;
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseTokenURI;
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    return super.tokenURI(tokenId);
  }
}
