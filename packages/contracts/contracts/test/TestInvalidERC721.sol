// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../WrappedHashi721.sol";

contract TestInvalidERC721 is WrappedHashi721 {
  function supportsInterface(bytes4) public pure override returns (bool) {
    return false;
  }
}
