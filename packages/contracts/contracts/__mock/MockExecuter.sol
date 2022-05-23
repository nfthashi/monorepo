// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract MockExecuter {
  address private _originSender;
  uint32 private _origin;

  function setOriginSender(address originSender_) public {
    _originSender = originSender_;
  }

  function setOrigin(uint32 origin_) public {
    _origin = origin_;
  }

  function execute(address to, bytes memory data) public {
    (bool success, ) = to.call(data);
    require(success, "MockExecuter: execute failed");
  }

  function originSender() public view returns (address) {
    return _originSender;
  }

  function origin() public view returns (uint32) {
    return _origin;
  }
}
