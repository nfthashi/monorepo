// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol";

import "@connext/nxtp-contracts/contracts/core/connext/libraries/LibConnextStorage.sol";


import "hardhat/console.sol";
import {IConnext} from "@connext/nxtp-contracts/contracts/core/connext/interfaces/IConnext.sol";


contract HashiConnextAdapter is OwnableUpgradeable, ERC165Upgradeable {
  mapping(uint32 => address) private _bridgeContracts;

  IConnext public connext;
  uint32 private _selfDomain;

  event BridgeSet(uint32 domain, address bridgeContract);
  event ConnextSet(IConnext connextContract);
    event SelfDomainSet(uint32 selfDomain);

  modifier onlySource(address _originSender, uint32 _origin) {
    require(
        _originSender == _bridgeContracts[_origin] &&
        msg.sender == address(connext),
      "Expected source contract on origin domain called by Connext"
    );
    _;
  }

  function setBridgeContract(uint32 domain, address bridgeContract) public onlyOwner {
    _bridgeContracts[domain] = bridgeContract;
    emit BridgeSet(domain, bridgeContract);
  }

  function setConnext(IConnext connextContract) public onlyOwner {
    connext = connextContract;
    emit ConnextSet(connextContract);
  }

    function setSelfDomain(uint32 selfDomain) public onlyOwner {
    _selfDomain = selfDomain;
    emit SelfDomainSet(selfDomain);
  }

  function getBridgeContract(uint32 domain) public view returns (address) {
    return _bridgeContracts[domain];
  }

  function getConnext() public view returns (IConnext) {
    return connext;
  }

  function getSelfDomain() public view returns (uint32) {
    return _selfDomain;
  }

  // solhint-disable-next-line func-name-mixedcase
  function __HashiConnextAdapter_init(uint32 selfDomain, IConnext connext) internal onlyInitializing {
    __Ownable_init_unchained();
    __HashiConnextAdapter_init_unchained(selfDomain, connext);
  }

  // solhint-disable-next-line func-name-mixedcase
  function __HashiConnextAdapter_init_unchained(uint32 selfDomain, IConnext connext) internal onlyInitializing {
    connext = connext;
    _selfDomain = selfDomain;
  }

  function _xcall(uint32 destinationDomain, uint256 relayerFee, bytes memory callData) internal {
    address toContract = _bridgeContracts[destinationDomain];
    connext.xcall(
      destinationDomain, 
      toContract,
      address(0),
      msg.sender,
      0,
      100,
      callData
    );
  }
}
