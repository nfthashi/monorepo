// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC721.sol";

contract MockMarket {
  struct Order {
    address nftContractAddress;
    address from;
    uint256 tokenId;
  }

  function fill(Order memory order) public payable {
    //need to validate the bridged currency address and amount
    // require(msg.value == order.value, "MockMarket: invalid value");

    IERC721(order.nftContractAddress).transferFrom(order.from, msg.sender, order.tokenId);
  }
}
