// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../NativeHashi721.sol";

contract NativeHashi721Example is NativeHashi721 {
  uint256 private immutable _startTokenId;
  uint256 private immutable _endTokenId;
  uint256 private _supplied;

  string private _baseTokenURI;

  constructor(
    uint32 selfDomain,
    address connext,
    string memory name,
    string memory symbol,
    uint256 startTokenId,
    uint256 endTokenId,
    string memory baseTokenURI
  ) NativeHashi721(selfDomain, connext, name, symbol) {
    _startTokenId = startTokenId;
    _endTokenId = endTokenId;
    _baseTokenURI = baseTokenURI;
  }

  function mint(address to) public {
    uint256 tokenId = _startTokenId + _supplied;
    require(tokenId <= _endTokenId, "NativeHashi721: mint finished");
    _mint(to, tokenId);
    _supplied++;
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseTokenURI;
  }
}
