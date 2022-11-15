// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@connext/nxtp-contracts/contracts/core/connext/interfaces/IXReceiver.sol";

contract MockConnext {
  event XCallCalled(
    uint32 destination,
    address to,
    address asset,
    address delegate,
    uint256 amount,
    uint256 slippage,
    bytes callData
  );

  function xcall(
    uint32 destination,
    address to,
    address asset,
    address delegate,
    uint256 amount,
    uint256 slippage,
    bytes calldata callData
  ) external payable returns (bytes32) {
    emit XCallCalled(destination, to, asset, delegate, amount, slippage, callData);
  }

  function testXReceive(
    address receiver,
    bytes32 transferId,
    uint256 amount,
    address asset,
    address originSender,
    uint32 origin,
    bytes memory callData
  ) external {
    IXReceiver(receiver).xReceive(transferId, amount, asset, originSender, origin, callData);
  }
}
