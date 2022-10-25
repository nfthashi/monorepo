// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@connext/nxtp-contracts/contracts/core/connext/libraries/LibConnextStorage.sol";
import {IConnext} from "@connext/nxtp-contracts/contracts/core/connext/interfaces/IConnext.sol";

contract MockConnextHandler  {
  // solhint-disable-next-line no-unused-vars
  function xcall(
      uint32 destinationDomain, // _destination: Domain ID of the destination chain
      address target,            // _to: address of the target contract
      address asset,        // _asset: use address zero for 0-value transfers
      address delegate,        // _delegate: address that can revert or forceLocal on destination
      uint256 amount,                 // _amount: 0 because no funds are being transferred
      uint256 slippage,                 // _slippage: can be anything between 0-10000 because no funds are being transferred
      bytes32 callData) public payable returns (bytes32) {
    return "";
  }
}
