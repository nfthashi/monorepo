// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../xNFTBridge.sol";
import  "@openzeppelin/contracts/interfaces/IERC721.sol";
import  "@openzeppelin/contracts/interfaces/IERC721Metadata.sol";

abstract contract xNFTSource is xNFTBridge {

  function xSend(address from, address nftContractAddress, uint256 tokenId, address receiverAddress, uint32 destinationDomain) public {
    
    //Validation
    address destinationContract = allowList[destinationDomain];
    require(destinationContract != address(0x0), "xNFTSource: destination not allowed");
    require(_isApprovedOrOwner(_msgSender(), tokenId), "xNFTSource: send caller is not owner nor approved");
    require(ERC721.ownerOf(tokenId) == from, "xNFTSource: send from incorrect owner");
      
    // Transfer
    IERC721(nftContractAddress).safeTransferFrom(from, address(this), tokenId);

    // Get NFT contract information
    string memory name = IERC721(nftContractAddress).name();
    string memory symbol = IERC721(nftContractAddress).symbol();
    // string memory baseTokenURI = IERC721Metadata(nftContractAddress).tokenURI();
    string memory destHandlerContract = allowList[destinationDomain];

    // send xcall
      bytes memory callData = abi.encodeWithSelector(selector,  name, symbol, contractAddress, receiverAddress);

      IConnextHandler.CallParams memory callParams = IConnextHandler.CallParams({
      to: destHandlerContract,
      callData: callData,
      originDomain: selfDomain,
      destinationDomain: destinationDomain,
      forceSlow: forceSlow,
      receiveLocal: false
    });

    IConnextHandler.XCallArgs memory xcallArgs = IConnextHandler.XCallArgs({
      params: callParams,
      transactingAssetId: asset,
      amount: 0,
      relayerFee: 0
    });

    connext.xcall(xcallArgs);
  }
  


  function xReceive(address nftContractAddress, uint256 tokenId, address receiverAddress) public onlyExecutor {
    // xCallを受け取る


    // Transfer
      // Transfer to Receiver Address
      IERC721(nftContractAddress).safeTransferFrom(address(this), address receiverAddress, uint256 tokenId);

  }






  
}
