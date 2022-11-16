import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { ADDRESS_1, ADDRESS_9, BYTES_ZERO, BYTES32_1 } from "../helper/constant";

describe("HashiConnextAdapter", function () {
  const selfDomainId = 1;
  const anotherDomainId = 2;
  const bridge = ADDRESS_1;
  const malciousBridge = ADDRESS_9;

  async function fixture() {
    const [signer, owner, malicious] = await ethers.getSigners();
    const Connext = await ethers.getContractFactory("TestConnext");
    const connext = await Connext.connect(signer).deploy(selfDomainId);
    const maliciousConnext = await Connext.connect(signer).deploy(selfDomainId);
    const HashiConnextAdapter = await ethers.getContractFactory("TestHashiConnextAdapter");
    const hashiConnextAdapter = await HashiConnextAdapter.connect(signer).deploy();
    await hashiConnextAdapter.connect(owner).initialize(connext.address);
    return { signer, owner, malicious, connext, maliciousConnext, hashiConnextAdapter };
  }

  describe("deployments", function () {
    it("should work", async function () {
      const { owner, hashiConnextAdapter } = await loadFixture(fixture);
      expect(await hashiConnextAdapter.owner()).to.eq(owner.address);
    });

    it("should not work when contract is already initialized", async function () {
      const { owner, connext, hashiConnextAdapter } = await loadFixture(fixture);
      await expect(hashiConnextAdapter.connect(owner).initialize(connext.address)).to.revertedWith(
        "Initializable: contract is already initialized"
      );
    });

    it("should not work when contract is not initializing", async function () {
      const { owner, connext, hashiConnextAdapter } = await loadFixture(fixture);
      await expect(hashiConnextAdapter.connect(owner).testHashiConnextAdapterInit(connext.address)).to.revertedWith(
        "Initializable: contract is not initializing"
      );
      await expect(
        hashiConnextAdapter.connect(owner).testHashiConnextAdapterInitUnchained(connext.address)
      ).to.revertedWith("Initializable: contract is not initializing");
    });
  });

  describe("set bridge", function () {
    it("should work", async function () {
      const { owner, hashiConnextAdapter } = await loadFixture(fixture);
      await expect(hashiConnextAdapter.connect(owner).setBridge(anotherDomainId, bridge))
        .to.emit(hashiConnextAdapter, "BridgeSet")
        .withArgs(anotherDomainId, bridge);
    });

    it("should not work when caller is not the owner", async function () {
      const { malicious, hashiConnextAdapter } = await loadFixture(fixture);
      await expect(hashiConnextAdapter.connect(malicious).setBridge(anotherDomainId, bridge)).to.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });

  describe("xCall", function () {
    it("should work", async function () {
      const { signer, owner, connext, hashiConnextAdapter } = await loadFixture(fixture);
      await expect(hashiConnextAdapter.connect(owner).setBridge(anotherDomainId, bridge))
        .to.emit(hashiConnextAdapter, "BridgeSet")
        .withArgs(anotherDomainId, bridge);
      const destination = anotherDomainId;
      const relayerFee = 0;
      const slippage = 0;
      const callData = BYTES_ZERO;
      const expectedAsset = ethers.constants.AddressZero;
      const expectedDelegate = signer.address;
      const expectedAmount = 0;
      await expect(hashiConnextAdapter.connect(signer).testXCall(destination, relayerFee, slippage, callData))
        .to.emit(connext, "XCallCalled")
        .withArgs(
          relayerFee,
          anotherDomainId,
          bridge,
          expectedAsset,
          expectedDelegate,
          expectedAmount,
          slippage,
          callData
        );
    });

    it("should not work when bridge is invalid", async function () {
      const { hashiConnextAdapter } = await loadFixture(fixture);
      const destination = anotherDomainId;
      const relayerFee = 0;
      const slippage = 0;
      const callData = BYTES_ZERO;
      await expect(hashiConnextAdapter.testXCall(destination, relayerFee, slippage, callData)).to.revertedWith(
        "HashiConnextAdapter: bridge is invalid"
      );
    });
  });

  describe("xReceive", function () {
    it("should work", async function () {
      const { owner, connext, hashiConnextAdapter } = await loadFixture(fixture);
      await expect(hashiConnextAdapter.connect(owner).setBridge(anotherDomainId, bridge))
        .to.emit(hashiConnextAdapter, "BridgeSet")
        .withArgs(anotherDomainId, bridge);
      const transferId = BYTES32_1;
      const amount = 0;
      const asset = ethers.constants.AddressZero;
      const originSender = bridge;
      const origin = anotherDomainId;
      const callData = BYTES_ZERO;
      await expect(
        connext.testXReceive(hashiConnextAdapter.address, transferId, amount, asset, originSender, origin, callData)
      )
        .to.emit(hashiConnextAdapter, "XReceiveCalled")
        .withArgs(callData);
    });

    it("should not work when asset is invalid", async function () {
      const { connext, hashiConnextAdapter } = await loadFixture(fixture);
      const transferId = BYTES32_1;
      const amount = 0;
      const asset = ADDRESS_1;
      const originSender = bridge;
      const origin = anotherDomainId;
      const callData = BYTES_ZERO;
      await expect(
        connext.testXReceive(hashiConnextAdapter.address, transferId, amount, asset, originSender, origin, callData)
      ).to.revertedWith("HashiConnextAdapter: asset is invalid");
    });

    it("should not work when amount is invalid", async function () {
      const { connext, hashiConnextAdapter } = await loadFixture(fixture);
      const transferId = BYTES32_1;
      const amount = 1;
      const asset = ethers.constants.AddressZero;
      const originSender = bridge;
      const origin = anotherDomainId;
      const callData = BYTES_ZERO;
      await expect(
        connext.testXReceive(hashiConnextAdapter.address, transferId, amount, asset, originSender, origin, callData)
      ).to.revertedWith("HashiConnextAdapter: amount is invalid");
    });

    it("should not work when bridge is invalid", async function () {
      const { owner, connext, hashiConnextAdapter } = await loadFixture(fixture);
      await expect(hashiConnextAdapter.connect(owner).setBridge(anotherDomainId, bridge))
        .to.emit(hashiConnextAdapter, "BridgeSet")
        .withArgs(anotherDomainId, bridge);
      const transferId = BYTES32_1;
      const amount = 0;
      const asset = ethers.constants.AddressZero;
      const originSender = malciousBridge;
      const origin = anotherDomainId;
      const callData = BYTES_ZERO;
      await expect(
        connext.testXReceive(hashiConnextAdapter.address, transferId, amount, asset, originSender, origin, callData)
      ).to.revertedWith("HashiConnextAdapter: bridge is invalid");
    });

    it("should not work when msg sender is invalid", async function () {
      const { owner, maliciousConnext, hashiConnextAdapter } = await loadFixture(fixture);
      await expect(hashiConnextAdapter.connect(owner).setBridge(anotherDomainId, bridge))
        .to.emit(hashiConnextAdapter, "BridgeSet")
        .withArgs(anotherDomainId, bridge);
      const transferId = BYTES32_1;
      const amount = 0;
      const asset = ethers.constants.AddressZero;
      const originSender = bridge;
      const origin = anotherDomainId;
      const callData = BYTES_ZERO;
      await expect(
        maliciousConnext.testXReceive(
          hashiConnextAdapter.address,
          transferId,
          amount,
          asset,
          originSender,
          origin,
          callData
        )
      ).to.revertedWith("HashiConnextAdapter: msg sender is invalid ");
    });

    it("should work when method is not overridden", async function () {
      const { hashiConnextAdapter } = await loadFixture(fixture);
      const callData = BYTES_ZERO;
      await expect(hashiConnextAdapter.testXReceive(callData)).to.revertedWith(
        "HashiConnextAdapter: method is not overridden"
      );
    });
  });
});
