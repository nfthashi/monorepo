// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./MockMarket.sol";
import "../Hashi721Bridge.sol";

contract XNFTTrader is HashiConnextAdapter {
  Hashi721Bridge private _hashi721Bridge;
  MockMarket private _mockMarket;

  constructor(Hashi721Bridge hashi721Bridge, MockMarket mockMarket) {
    __HashiConnextAdapter_init_unchained(
      hashi721Bridge.getSelfDomain(),
      hashi721Bridge.getConnext(),
      hashi721Bridge.getTransactingAssetId()
    );
    _hashi721Bridge = hashi721Bridge;
    _mockMarket = mockMarket;
  }

  function xSend(
    MockMarket.Order memory order,
    bool isIncludeTokenURI,
    uint32 destinationDomainId,
    uint32 version
  ) public {
    //need to validate the bridged currency address and amount

    bytes memory callData = abi.encodeWithSelector(this.xReceive.selector, order, msg.sender, isIncludeTokenURI);
    _xcall(destinationDomainId, version,callData);
  }

  function xReceive(
    MockMarket.Order memory order,
    address to,
    bool isIncludeTokenURI,
    uint32 version
  ) public payable onlyExecutor(version) {
    //need to validate the bridged currency address and amount

    _mockMarket.fill(order);
    uint32 origin = IExecutor(msg.sender).origin();
    _hashi721Bridge.xSend(order.nftContractAddress, address(this), to, order.tokenId, origin, version, isIncludeTokenURI);
  }
}
