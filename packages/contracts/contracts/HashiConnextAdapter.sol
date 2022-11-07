// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol";

import "@connext/nxtp-contracts/contracts/core/connext/libraries/LibConnextStorage.sol";
import "@connext/nxtp-contracts/contracts/core/connext/interfaces/IExecutor.sol";
import "@connext/nxtp-contracts/contracts/core/connext/interfaces/IConnextHandler.sol";

import "hardhat/console.sol";

contract HashiConnextAdapter is OwnableUpgradeable, ERC165Upgradeable {
  mapping(uint32 => address) private _bridgeContracts;

  address private _connext;
  address private _executor;
  uint32 private _selfDomain;

  event BridgeSet(uint32 domain, address bridgeContract);
  event ConnextSet(address connextContract);
  event SelfDomainSet(uint32 selfDomain);

  modifier onlyExecutor() {
    require(msg.sender == _executor, "HashiConnextAdapter: sender invalid");
    require(
      IExecutor(msg.sender).originSender() == _bridgeContracts[IExecutor(msg.sender).origin()],
      "HashiConnextAdapter: origin sender invalid"
    );
    _;
  }

  function setBridgeContract(uint32 domain, address bridgeContract) public onlyOwner {
    _bridgeContracts[domain] = bridgeContract;
    emit BridgeSet(domain, bridgeContract);
  }

  function setConnext(address connextContract) public onlyOwner {
    _connext = connextContract;
    _executor = address(IConnextHandler(_connext).executor());
    emit ConnextSet(connextContract);
  }

  function setSelfDomain(uint32 selfDomain) public onlyOwner {
    _selfDomain = selfDomain;
    emit SelfDomainSet(selfDomain);
  }

  function getBridgeContract(uint32 domain) public view returns (address) {
    return _bridgeContracts[domain];
  }

  function getConnext() public view returns (address) {
    return _connext;
  }

  function getExecutor() public view returns (address) {
    return _executor;
  }

  function getSelfDomain() public view returns (uint32) {
    return _selfDomain;
  }

  // solhint-disable-next-line func-name-mixedcase
  function __HashiConnextAdapter_init(uint32 selfDomain, address connext) internal onlyInitializing {
    __Ownable_init_unchained();
    __HashiConnextAdapter_init_unchained(selfDomain, connext);
  }

  // solhint-disable-next-line func-name-mixedcase
  function __HashiConnextAdapter_init_unchained(uint32 selfDomain, address connext) internal onlyInitializing {
    _selfDomain = selfDomain;
    _connext = connext;
    _executor = address(IConnextHandler(_connext).executor());
  }

  function _xcall(uint32 destinationDomain, bytes memory callData) internal {
    address destinationContract = _bridgeContracts[destinationDomain];
    require(destinationContract != address(0x0), "HashiConnextAdapter: invalid bridge");
    CallParams memory callParams = CallParams({
      to: destinationContract,
      callData: callData,
      originDomain: _selfDomain,
      destinationDomain: destinationDomain,
      agent: msg.sender,
      recovery: destinationContract,
      forceSlow: true,
      receiveLocal: false,
      callback: address(0),
      callbackFee: 0,
      relayerFee: 0,
      slippageTol: 9995
    });
    XCallArgs memory xcallArgs = XCallArgs({params: callParams, transactingAssetId: address(0), amount: 0});
    IConnextHandler(_connext).xcall(xcallArgs);
  }
}
