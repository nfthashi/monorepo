// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "@connext/nxtp-contracts/contracts/core/connext/interfaces/IConnext.sol";
import "@connext/nxtp-contracts/contracts/core/connext/interfaces/IXReceiver.sol";

abstract contract HashiConnextAdapter is IXReceiver, OwnableUpgradeable {
  event BridgeSet(uint32 indexed domainId, address indexed bridge);

  mapping(uint32 => address) public bridges;

  address public constant CONNEXT_ASSET_FOR_NONE = address(0x0);
  uint256 public constant CONNEXT_AMOUNT_FOR_NONE = 0;

  address public connext;

  function __HashiConnextAdapter_init(address connext_) internal onlyInitializing {
    __Ownable_init_unchained();
    __HashiConnextAdapter_init_unchained(connext_);
  }

  function __HashiConnextAdapter_init_unchained(address connext_) internal onlyInitializing {
    connext = connext_;
  }

  function setBridge(uint32 domainId_, address bridge) external onlyOwner {
    bridges[domainId_] = bridge;
    emit BridgeSet(domainId_, bridge);
  }

  function xReceive(
    bytes32 transferId,
    uint256 amount,
    address asset,
    address originSender,
    uint32 origin,
    bytes memory callData
  ) external override returns (bytes memory) {
    require(asset == CONNEXT_ASSET_FOR_NONE, "HashiConnextAdapter: asset is invalid");
    require(amount == CONNEXT_AMOUNT_FOR_NONE, "HashiConnextAdapter: amount is invalid");
    address bridge = bridges[origin];
    require(bridge == originSender, "HashiConnextAdapter: bridge is invalid");
    require(_msgSender() == connext, "HashiConnextAdapter: msg sender is invalid ");
    _xReceive(callData);
    return "";
  }

  function _xCall(
    uint32 destination,
    uint256 relayerFee,
    uint256 slippage,
    bytes memory callData
  ) internal returns (bytes32) {
    address bridge = bridges[destination];
    require(bridge != address(0), "HashiConnextAdapter: bridge is invalid");
    return
      IConnext(connext).xcall{value: relayerFee}(
        destination,
        bridge,
        CONNEXT_ASSET_FOR_NONE,
        _msgSender(),
        CONNEXT_AMOUNT_FOR_NONE,
        slippage,
        callData
      );
  }

  function _xReceive(bytes memory callData) internal virtual {
    revert("HashiConnextAdapter: method is not overridden");
  }
}
