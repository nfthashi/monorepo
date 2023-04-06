// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";

contract FaucetHashi721 is ERC721Upgradeable {
  uint256 public totalSupply;
  string private _tokenURI;

  constructor(string memory tokenURI_) {
    __ERC721_init("FaucetHashi721", "FHASHI721");
    _tokenURI = tokenURI_;
  }

  function mint() public {
    _mint(msg.sender, totalSupply++);
  }

  function tokenURI(uint256) public view override returns (string memory) {
    return _tokenURI;
  }
}
