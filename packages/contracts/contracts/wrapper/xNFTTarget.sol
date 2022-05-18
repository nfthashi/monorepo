// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./xNFTWrapBridge.sol";

abstract contract xNFTTarget is xNFTWrapBridge {
  
  mapping(address => address) public contractMap;

  function xSend() public {
    // NFTをburnする

  }

  function xReceive(address sourceContractAddress, address receiverAddress, uint256 tokenId, uint256 domainId) public onlyExecutor {
    // xCallを受け取る

    // Deployする
      // Compute ContractAddresss on Chain B using Create2 and deploy

      // Make Mapping( AddressA => AddressB)
      contractMap[sourceContractAddress] = <ContractB>;

    // Mintする
      // Refer mapping and get Contract Address of Chain B
      targetContractAddress = contractMap[sourceContractAddress];
      // Mint to ContractB
      IERC721(targetContractAddress)._safemint(receiverAddress, tokenId);
      
  }
}
