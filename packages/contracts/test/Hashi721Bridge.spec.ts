import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { ADDRESS_1 } from "./helper/constant";

describe("Hashi721Bridge", function () {
  const selfDomainId = 1;
  const anotherDomainId = 2;
  const bridge = ADDRESS_1;

  async function fixture() {
    const [signer, owner, holder, another, malicious] = await ethers.getSigners();
    const Connext = await ethers.getContractFactory("TestConnext");
    const connext = await Connext.connect(signer).deploy();
    const WrappedHashi721 = await ethers.getContractFactory("TestWrappedHashi721");
    const wrappedHashi721 = await WrappedHashi721.connect(signer).deploy();
    await wrappedHashi721.connect(owner).initialize();
    const Hashi721Bridge = await ethers.getContractFactory("TestHashi721Bridge");
    const hashi721Bridge = await Hashi721Bridge.connect(signer).deploy();
    await hashi721Bridge.connect(owner).initialize(connext.address, selfDomainId, wrappedHashi721.address);
    await hashi721Bridge.connect(owner).setBridge(anotherDomainId, bridge);
    const mintedTokenId = 0;
    const mintedTokenURI = `http://localhost:3000/${mintedTokenId}`;
    await wrappedHashi721.connect(owner).mint(holder.address, mintedTokenId, mintedTokenURI);
    await wrappedHashi721.connect(holder).setApprovalForAll(hashi721Bridge.address, true);

    const Clone = await ethers.getContractFactory("TestClone");
    const clone = await Clone.connect(signer).deploy();
    return {
      signer,
      owner,
      holder,
      another,
      malicious,
      connext,
      WrappedHashi721,
      wrappedHashi721,
      hashi721Bridge,
      mintedTokenId,
      mintedTokenURI,
      clone,
    };
  }

  describe("deployments", function () {
    it("should work", async function () {
      const { owner, holder, hashi721Bridge, wrappedHashi721, mintedTokenId } = await loadFixture(fixture);
      expect(await hashi721Bridge.owner()).to.eq(owner.address);
      expect(await wrappedHashi721.ownerOf(mintedTokenId)).to.eq(holder.address);
    });

    it("should not work when initialized more than one time", async function () {
      const { owner, connext, wrappedHashi721, hashi721Bridge } = await loadFixture(fixture);
      await expect(
        hashi721Bridge.connect(owner).initialize(connext.address, selfDomainId, wrappedHashi721.address)
      ).to.revertedWith("Initializable: contract is already initialized");
    });
  });

  describe("call data encode and decode", function () {
    it("should work", async function () {
      const { hashi721Bridge } = await loadFixture(fixture);
      const data = [0, ethers.constants.AddressZero, ethers.constants.AddressZero, 0, ""];
      const encoded = await hashi721Bridge.testEncodeCallData(...data);
      const decoded = await hashi721Bridge.testDecodeCallData(encoded);
      data.forEach((_data, i) => {
        expect(_data).to.eq(decoded[i]);
      });
    });
  });

  describe("xCall", function () {
    it("should work when call by holder and not ignore token URI and bridge from original domain", async function () {
      const { holder, connext, hashi721Bridge, wrappedHashi721, mintedTokenId, mintedTokenURI } = await loadFixture(
        fixture
      );
      const relayerFee = 0;
      const slippage = 0;
      const to = ADDRESS_1;
      const isTokenURIIgnored = false;
      const callData = await hashi721Bridge.testEncodeCallData(
        selfDomainId,
        wrappedHashi721.address,
        bridge,
        mintedTokenId,
        mintedTokenURI
      );
      await expect(
        hashi721Bridge
          .connect(holder)
          .xCall(anotherDomainId, relayerFee, slippage, wrappedHashi721.address, to, mintedTokenId, isTokenURIIgnored)
      )
        .to.emit(connext, "XCallCalled")
        .withArgs(0, anotherDomainId, bridge, ethers.constants.AddressZero, holder.address, 0, slippage, callData);
    });

    it("should work when ignore token URI and bridge to original domain", async function () {
      const { owner, holder, another, connext, hashi721Bridge, wrappedHashi721, mintedTokenId } = await loadFixture(
        fixture
      );

      const originalAsset = ADDRESS_1;
      await hashi721Bridge.setOriginal(wrappedHashi721.address, anotherDomainId, originalAsset);
      await wrappedHashi721.connect(owner).transferOwnership(hashi721Bridge.address);
      await wrappedHashi721.connect(holder).approve(another.address, mintedTokenId);

      const relayerFee = 0;
      const slippage = 0;
      const to = ADDRESS_1;
      const isTokenURIIgnored = true;
      const callData = await hashi721Bridge.testEncodeCallData(
        anotherDomainId,
        originalAsset,
        bridge,
        mintedTokenId,
        ""
      );
      await expect(
        hashi721Bridge
          .connect(another)
          .xCall(anotherDomainId, relayerFee, slippage, wrappedHashi721.address, to, mintedTokenId, isTokenURIIgnored)
      )
        .to.emit(connext, "XCallCalled")
        .withArgs(0, anotherDomainId, bridge, ethers.constants.AddressZero, another.address, 0, slippage, callData);
    });

    it("should work when sender is approvalForAll = true", async function () {
      const { holder, connext, another, hashi721Bridge, wrappedHashi721, mintedTokenId, mintedTokenURI } =
        await loadFixture(fixture);
      await wrappedHashi721.connect(holder).setApprovalForAll(another.address, true);
      const relayerFee = 0;
      const slippage = 0;
      const to = ADDRESS_1;
      const isTokenURIIgnored = false;
      const callData = await hashi721Bridge.testEncodeCallData(
        selfDomainId,
        wrappedHashi721.address,
        bridge,
        mintedTokenId,
        mintedTokenURI
      );
      await expect(
        hashi721Bridge
          .connect(another)
          .xCall(anotherDomainId, relayerFee, slippage, wrappedHashi721.address, to, mintedTokenId, isTokenURIIgnored)
      )
        .to.emit(connext, "XCallCalled")
        .withArgs(0, anotherDomainId, bridge, ethers.constants.AddressZero, another.address, 0, slippage, callData);
    });

    it("should not work when sender is invalid", async function () {
      const { malicious, hashi721Bridge, wrappedHashi721, mintedTokenId } = await loadFixture(fixture);
      const relayerFee = 0;
      const slippage = 0;
      const to = ADDRESS_1;
      const isTokenURIIgnored = false;
      await expect(
        hashi721Bridge
          .connect(malicious)
          .xCall(anotherDomainId, relayerFee, slippage, wrappedHashi721.address, to, mintedTokenId, isTokenURIIgnored)
      ).to.revertedWith("Hashi721Bridge: invalid msg sender");
    });
  });

  describe("xCall", function () {
    it("should work when bridge from another domain (try 2 times)", async function () {
      const { WrappedHashi721, wrappedHashi721, hashi721Bridge, clone } = await loadFixture(fixture);
      const originalDomainId = anotherDomainId;
      const originalAsset = ADDRESS_1;
      const to = ADDRESS_1;
      const salt = ethers.utils.solidityKeccak256(["uint32", "address"], [originalDomainId, ADDRESS_1]);
      const deployedAssetAddress = await clone.predictDeterministicAddress(
        wrappedHashi721.address,
        salt,
        hashi721Bridge.address
      );
      const deployedAsset = WrappedHashi721.attach(deployedAssetAddress);
      const firstTokenId = 0;
      const firstCallData = await hashi721Bridge.testEncodeCallData(
        originalDomainId,
        originalAsset,
        to,
        firstTokenId,
        ""
      );
      await expect(hashi721Bridge.testXReceive(firstCallData))
        .to.emit(deployedAsset, "Transfer")
        .withArgs(ethers.constants.AddressZero, to, firstTokenId);
      const secondTokenId = 1;
      const secondCallData = await hashi721Bridge.testEncodeCallData(
        originalDomainId,
        originalAsset,
        to,
        secondTokenId,
        ""
      );
      await expect(hashi721Bridge.testXReceive(secondCallData))
        .to.emit(deployedAsset, "Transfer")
        .withArgs(ethers.constants.AddressZero, to, secondTokenId);
    });

    it("should work when bridge to original domain", async function () {
      const { holder, wrappedHashi721, hashi721Bridge, mintedTokenId } = await loadFixture(fixture);
      await wrappedHashi721.connect(holder).transferFrom(holder.address, hashi721Bridge.address, mintedTokenId);
      const originalDomainId = selfDomainId;
      const originalAsset = wrappedHashi721.address;
      const to = ADDRESS_1;
      const tokenId = mintedTokenId;
      const callData = await hashi721Bridge.testEncodeCallData(originalDomainId, originalAsset, to, tokenId, "");
      await expect(hashi721Bridge.testXReceive(callData))
        .to.emit(wrappedHashi721, "Transfer")
        .withArgs(hashi721Bridge.address, to, tokenId);
    });
  });
});
