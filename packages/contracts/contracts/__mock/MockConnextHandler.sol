// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract MockConnextHandler {
  function xcall(
    uint32 _destination,
    address _to,
    address _asset,
    address _delegate,
    uint256 _amount,
    uint256 _slippage,
    bytes calldata _callData
  ) external payable returns (bytes32) {
    return keccak256(abi.encodePacked(_destination, _to, _asset, _delegate, _amount, _slippage, _callData));
  }

  function execute(address to, bytes memory data) public {
    // solhint-disable-next-line avoid-low-level-calls
    (bool success, bytes memory log) = to.call(data);
    require(success, string(log));
  }
}
