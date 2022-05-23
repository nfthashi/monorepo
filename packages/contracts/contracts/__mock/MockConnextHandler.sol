// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@connext/nxtp-contracts/contracts/interfaces/IConnextHandler.sol";

contract MockConnextHandler {
  address private _executer;

  function setExecuter(address executer) public {
    _executer = executer;
  }

  function xcall(IConnextHandler.XCallArgs memory xCallArgs) public payable returns (bytes32) {
    return "";
  }

  function getExecutor() public view returns (address) {
    return _executer;
  }
}
