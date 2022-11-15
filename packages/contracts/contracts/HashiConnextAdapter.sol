// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@connext/nxtp-contracts/contracts/core/connext/interfaces/IConnext.sol";
import "@connext/nxtp-contracts/contracts/core/connext/interfaces/IXReceiver.sol";

contract HashiConnextAdapter is IXReceiver, Initializable, ContextUpgradeable {
  mapping(uint32 => address) public bridgeContracts;

  address public connext;
  uint32 public domainId;

  function __HashiConnextAdapter_init(address connext_, uint32 domainId_) internal onlyInitializing {
    __HashiConnextAdapter_init_unchained(connext_, domainId_);
  }

  function __HashiConnextAdapter_init_unchained(address connext_, uint32 domainId_) internal onlyInitializing {
    connext = connext_;
    domainId = domainId_;
  }

  function xReceive(
    bytes32,
    uint256,
    address,
    address originSender,
    uint32 origin,
    bytes memory callData
  ) external override returns (bytes memory) {
    address bridgeContract = bridgeContracts[origin];
    require(bridgeContract == originSender, "HashiConnextAdapter: invalid bridge contract");
    require(_msgSender() == connext, "HashiConnextAdapter: invalid msg sender");
    _afterXReceive(callData);
    return "";
  }

  function _xcall(
    uint32 destination,
    uint256 relayerFee,
    uint256 slippage,
    bytes memory callData
  ) internal returns (bytes32) {
    address bridgeContract = bridgeContracts[destination];
    require(bridgeContract != address(0), "HashiConnextAdapter: invalid bridge contract");
    return
      IConnext(connext).xcall{value: relayerFee}(
        domainId,
        bridgeContract,
        address(0),
        _msgSender(),
        0,
        slippage,
        callData
      );
  }

  function _afterXReceive(bytes memory callData) internal virtual {}
}
