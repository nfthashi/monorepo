// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@connext/nxtp-contracts/contracts/core/connext/libraries/LibConnextStorage.sol";
import "@connext/nxtp-contracts/contracts/core/connext/interfaces/IExecutor.sol";

contract MockConnextHandler {
  IExecutor private _executor;

  function setExecutor(IExecutor executor) public {
    _executor = executor;
  }

  // solhint-disable-next-line no-unused-vars
  function xcall(XCallArgs memory xCallArgs) public payable returns (bytes32) {
    return "";
  }

  function executor() public view returns (IExecutor) {
    return _executor;
  }
}
