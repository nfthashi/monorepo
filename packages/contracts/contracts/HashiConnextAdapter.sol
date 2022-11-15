// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "@connext/nxtp-contracts/contracts/core/connext/interfaces/IConnext.sol";
import "@connext/nxtp-contracts/contracts/core/connext/interfaces/IXReceiver.sol";

abstract contract HashiConnextAdapter is IXReceiver, OwnableUpgradeable {
  mapping(uint32 => address) public bridges;

  address public connext;
  uint32 public domainId;

  event BridgeSet(uint32 indexed domainId, address indexed bridge);

  function __HashiConnextAdapter_init(address connext_, uint32 domainId_) internal onlyInitializing {
    __Ownable_init_unchained();
    __HashiConnextAdapter_init_unchained(connext_, domainId_);
  }

  function __HashiConnextAdapter_init_unchained(address connext_, uint32 domainId_) internal onlyInitializing {
    connext = connext_;
    domainId = domainId_;
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
    address bridge = bridges[origin];
    require(bridge == originSender, "HashiConnextAdapter: invalid bridge");
    require(_msgSender() == connext, "HashiConnextAdapter: invalid msg sender");
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
    require(bridge != address(0), "HashiConnextAdapter: invalid bridge");
    return
      IConnext(connext).xcall{value: relayerFee}(destination, bridge, address(0), _msgSender(), 0, slippage, callData);
  }

  function _xReceive(bytes memory callData) internal virtual {
    revert("HashiConnextAdapter: must override");
  }
}
