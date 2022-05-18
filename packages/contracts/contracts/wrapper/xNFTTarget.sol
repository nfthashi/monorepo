// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./xNFTWrapBridge.sol";

abstract contract xNFTTarget is xNFTWrapBridge {
  
  mapping(address => address) public contractMap;

  function xSend() public {
    // NFTをburnする

  }

  function xReceive(address sourceNFTContractAddress, address to, uint256 tokenId) public onlyExecutor {
    // xCallを受け取る

    
    if(contractMap)
    // Deployする
      // Compute ContractAddresss on Chain B using Create2 and deploy

      address wrappedNFTContract = address(this) 

      // Make Mapping( AddressA => AddressB)
      contractMap[sourceNFTContractAddress] = wrappedContract;

    // Mintする
      // Refer mapping and get Contract Address of Chain B
      targetContractAddress = contractMap[sourceNFTContractAddress];
      // Mint to ContractB
      IERC721(targetContractAddress)._safemint(receiverAddress, tokenId);
      
  }

}
