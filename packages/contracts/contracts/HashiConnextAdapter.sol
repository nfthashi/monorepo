// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol";

import "@connext/nxtp-contracts/contracts/core/connext/libraries/LibConnextStorage.sol";
import "@connext/nxtp-contracts/contracts/core/connext/interfaces/IExecutor.sol";
import "@connext/nxtp-contracts/contracts/core/connext/interfaces/IConnextHandler.sol";

import "hardhat/console.sol";

contract HashiConnextAdapter is OwnableUpgradeable, ERC165Upgradeable {
  mapping(bytes32 => address) public bridgeContracts;

  address private _connext;
  address private _executor;
  address private _transactingAssetId;
  uint32 private _selfDomain;

  event BridgeSet(uint32 domain, uint32 version, address bridgeContract);
  event ConnextSet(address connextContract);
  event SelfDomainSet(uint32 selfDomain);
  event TransactingAssetIdSet(address transactingAssetId);

  modifier onlyExecutor(uint32 version) {
    require(msg.sender == _executor, "HashiConnextAdapter: sender invalid");
    require(
      IExecutor(msg.sender).originSender() ==
        bridgeContracts[keccak256(abi.encodePacked(IExecutor(msg.sender).origin(), version))],
      "HashiConnextAdapter: origin sender invalid"
    );
    _;
  }

  // TODO : 複数アドレスを管理できるようにする
  function setBridgeContract(
    uint32 domain,
    uint32 version,
    address bridgeContract
  ) public onlyOwner {
    bytes32 domainIdAndVersion = keccak256(abi.encodePacked(domain, version));
    require(
      bridgeContracts[domainIdAndVersion] == address(0x0),
      "HashiConnextAdaptor: This version is already resistered"
    );
    bridgeContracts[domainIdAndVersion] = bridgeContract;
    emit BridgeSet(domain, version, bridgeContract);
  }

  function setTransactingAssetId(address transactingAssetId) public onlyOwner {
    _transactingAssetId = transactingAssetId;
    emit TransactingAssetIdSet(transactingAssetId);
  }

  function getBridgeContract(uint32 domain, uint32 version) public view returns (address) {
    return bridgeContracts[keccak256(abi.encodePacked(domain, version))];
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

  function getTransactingAssetId() public view returns (address) {
    return _transactingAssetId;
  }

  // solhint-disable-next-line func-name-mixedcase
  function __HashiConnextAdapter_init(
    uint32 selfDomain,
    address connext,
    address transactingAssetId
  ) internal onlyInitializing {
    __Ownable_init_unchained();
    __HashiConnextAdapter_init_unchained(selfDomain, connext, transactingAssetId);
  }

  // solhint-disable-next-line func-name-mixedcase
  function __HashiConnextAdapter_init_unchained(
    uint32 selfDomain,
    address connext,
    address transactingAssetId
  ) internal onlyInitializing {
    _selfDomain = selfDomain;
    _connext = connext;
    _executor = address(IConnextHandler(_connext).executor());
    _transactingAssetId = transactingAssetId;
  }

  function _xcall(
    uint32 destinationDomain,
    uint32 domainVersion,
    bytes memory callData
  ) internal {
    address destinationContract = bridgeContracts[keccak256(abi.encodePacked(destinationDomain, domainVersion))];
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
    XCallArgs memory xcallArgs = XCallArgs({params: callParams, transactingAssetId: _transactingAssetId, amount: 0});
    IConnextHandler(_connext).xcall(xcallArgs);
  }
}
