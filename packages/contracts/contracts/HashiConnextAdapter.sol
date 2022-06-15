// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import "@connext/nxtp-contracts/contracts/libraries/LibConnextStorage.sol";
import "@connext/nxtp-contracts/contracts/interfaces/IExecutor.sol";
import "@connext/nxtp-contracts/contracts/interfaces/IConnextHandler.sol";

import "hardhat/console.sol";

contract HashiConnextAdapter is Ownable, ERC165 {
  mapping(uint32 => address) private _bridgeContracts;

  address private immutable _connext;
  address private immutable _executor;
  address private immutable _transactingAssetId;
  uint32 private immutable _selfDomain;

  event BridgeSet(uint32 domain, address bridgeContract);

  modifier onlyExecutor() {
    require(msg.sender == _executor, "HashiConnextAdapter: sender invalid");
    require(
      IExecutor(msg.sender).originSender() == _bridgeContracts[IExecutor(msg.sender).origin()],
      "HashiConnextAdapter: origin sender invalid"
    );
    _;
  }

  constructor(
    uint32 selfDomain,
    address connext,
    address transactingAssetId
  ) {
    _selfDomain = selfDomain;
    _connext = connext;
    _executor = address(IConnextHandler(_connext).executor());
    _transactingAssetId = transactingAssetId;
  }

  function setBridgeContract(uint32 domain, address bridgeContract) public onlyOwner {
    _bridgeContracts[domain] = bridgeContract;
    emit BridgeSet(domain, bridgeContract);
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

  function _xcall(uint32 destinationDomain, bytes memory callData) internal {
    address destinationContract = _bridgeContracts[destinationDomain];
    require(destinationContract != address(0x0), "HashiConnextAdapter: invalid bridge");
    CallParams memory callParams = CallParams({
      to: destinationContract,
      callData: callData,
      originDomain: _selfDomain,
      destinationDomain: destinationDomain,
      recovery: destinationContract,
      callback: address(0),
      callbackFee: 0,
      forceSlow: true,
      receiveLocal: false
    });
    XCallArgs memory xcallArgs = XCallArgs({
      params: callParams,
      transactingAssetId: _transactingAssetId,
      amount: 0,
      relayerFee: 0
    });
    IConnextHandler(_connext).xcall(xcallArgs);
  }
}
