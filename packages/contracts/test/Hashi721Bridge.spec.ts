import { expect } from "chai";
import { ethers } from "hardhat";

import { getDestinationChainNFTAddress } from "../lib/create2";
import { ADDRESS_1 } from "./helper/constant";

describe("Hashi721Bridge", function () {
  const selfDomainId = 1;
  const anotherDomainId = 2;
  const bridge = ADDRESS_1;

  async function fixture() {
    const [signer, owner, holder, another, malicious] = await ethers.getSigners();
    const Connext = await ethers.getContractFactory("TestConnext");
    const connext = await Connext.connect(signer).deploy(selfDomainId);
    const WrappedHashi721 = await ethers.getContractFactory("WrappedHashi721");
    const wrappedHashi721 = await WrappedHashi721.connect(signer).deploy();
    await wrappedHashi721.connect(owner).initialize();

    const TestInvalidERC721 = await ethers.getContractFactory("TestInvalidERC721");
    const testInvalidERC721 = await TestInvalidERC721.connect(signer).deploy();
    await testInvalidERC721.connect(owner).initialize();

    const mintedTokenId = 0;
    const mintedTokenURI = `http://localhost:3000/${mintedTokenId}`;

    const Hashi721Bridge = await ethers.getContractFactory("TestHashi721Bridge");
    const hashi721Bridge = await Hashi721Bridge.connect(signer).deploy();
    await hashi721Bridge.connect(owner).initialize(connext.address, wrappedHashi721.address, mintedTokenURI.length);
    await hashi721Bridge.connect(owner).setBridge(anotherDomainId, bridge);

    await wrappedHashi721.connect(owner).mint(holder.address, mintedTokenId, mintedTokenURI);
    await wrappedHashi721.connect(holder).setApprovalForAll(hashi721Bridge.address, true);

    await testInvalidERC721.connect(owner).mint(holder.address, mintedTokenId, mintedTokenURI);
    await testInvalidERC721.connect(holder).setApprovalForAll(hashi721Bridge.address, true);

    return {
      signer,
      owner,
      holder,
      another,
      malicious,
      connext,
      WrappedHashi721,
      wrappedHashi721,
      TestInvalidERC721,
      testInvalidERC721,
      hashi721Bridge,
      mintedTokenId,
      mintedTokenURI,
    };
  }

  describe("deployments", function () {
    it("should work", async function () {
      const { owner, holder, hashi721Bridge, wrappedHashi721, mintedTokenId, mintedTokenURI } = await fixture();
      expect(await hashi721Bridge.owner()).to.eq(owner.address);
      expect(await hashi721Bridge.tokenURILengthLimit()).to.eq(mintedTokenURI.length);
      expect(await wrappedHashi721.ownerOf(mintedTokenId)).to.eq(holder.address);
    });

    it("should not work when contract is already initialized", async function () {
      const { owner, connext, wrappedHashi721, hashi721Bridge, mintedTokenURI } = await fixture();
      await expect(
        hashi721Bridge.connect(owner).initialize(connext.address, wrappedHashi721.address, mintedTokenURI.length)
      ).to.revertedWith("Initializable: contract is already initialized");
    });
  });

  describe("setTokenURILengthLimit", function () {
    it("should work", async function () {
      const { owner, hashi721Bridge } = await fixture();
      const newLimit = 1;
      hashi721Bridge.connect(owner).setTokenURILengthLimit(newLimit);
      expect(await hashi721Bridge.tokenURILengthLimit()).to.eq(newLimit);
    });

    it("should not work when caller is not the owner", async function () {
      const { malicious, hashi721Bridge } = await fixture();
      const newLimit = 1;
      await expect(hashi721Bridge.connect(malicious).setTokenURILengthLimit(newLimit)).to.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });

  describe("encode & decode data", function () {
    it("should work", async function () {
      const { hashi721Bridge } = await fixture();
      const originalDomainId = 0;
      const originalAsset = ethers.constants.AddressZero;
      const to = ethers.constants.AddressZero;
      const tokenId = 0;
      const tokenURI = "";
      const encoded = await hashi721Bridge.testEncodeCallData(originalDomainId, originalAsset, to, tokenId, tokenURI);
      const decoded = await hashi721Bridge.testDecodeCallData(encoded);
      [originalDomainId, originalAsset, to, tokenId, tokenURI].forEach((_data, i) => {
        expect(_data).to.eq(decoded[i]);
      });
    });
  });

  describe("xCall", function () {
    it("should work when called by holder, not ignore token URI, bridge: [original -> other]", async function () {
      const { holder, connext, hashi721Bridge, wrappedHashi721, mintedTokenId, mintedTokenURI } = await fixture();
      const destination = anotherDomainId;
      const relayerFee = 0;
      const asset = wrappedHashi721.address;
      const isTokenURIIgnored = false;
      const originalDomainId = selfDomainId;
      const originalAsset = asset;
      const to = ADDRESS_1;
      const tokenId = mintedTokenId;
      const tokenURI = mintedTokenURI;
      const callData = await hashi721Bridge.testEncodeCallData(originalDomainId, originalAsset, to, tokenId, tokenURI);
      const delegate = holder;
      await expect(
        hashi721Bridge.connect(delegate).xCall(destination, relayerFee, asset, bridge, tokenId, isTokenURIIgnored)
      )
        .to.emit(connext, "XCallCalled")
        .withArgs(0, destination, bridge, ethers.constants.AddressZero, delegate.address, 0, 0, callData);
    });

    it("should work when called by sender with approved, ignore token URI, bridge: [other -> original]", async function () {
      const { owner, holder, another, connext, hashi721Bridge, wrappedHashi721, mintedTokenId } = await fixture();
      const destination = anotherDomainId;
      const relayerFee = 0;
      const asset = wrappedHashi721.address;
      const isTokenURIIgnored = true;
      const originalDomainId = anotherDomainId;
      const originalAsset = ADDRESS_1;
      const to = ADDRESS_1;
      const tokenId = mintedTokenId;
      const tokenURI = "";
      const callData = await hashi721Bridge.testEncodeCallData(originalDomainId, originalAsset, to, tokenId, tokenURI);
      const delegate = another;
      await hashi721Bridge.setOriginal(asset, originalDomainId, originalAsset);
      await wrappedHashi721.connect(owner).transferOwnership(hashi721Bridge.address);
      await wrappedHashi721.connect(holder).approve(delegate.address, mintedTokenId);
      await expect(
        hashi721Bridge.connect(delegate).xCall(destination, relayerFee, asset, to, mintedTokenId, isTokenURIIgnored)
      )
        .to.emit(connext, "XCallCalled")
        .withArgs(0, destination, bridge, ethers.constants.AddressZero, delegate.address, 0, 0, callData);
    });

    it("should work when called by sender with approvalForAll,", async function () {
      const { holder, connext, another, hashi721Bridge, wrappedHashi721, mintedTokenId, mintedTokenURI } =
        await fixture();
      const destination = anotherDomainId;
      const relayerFee = 0;
      const asset = wrappedHashi721.address;
      const isTokenURIIgnored = false;
      const originalDomainId = selfDomainId;
      const originalAsset = asset;
      const to = ADDRESS_1;
      const tokenId = mintedTokenId;
      const tokenURI = mintedTokenURI;
      const delegate = another;
      const callData = await hashi721Bridge.testEncodeCallData(originalDomainId, originalAsset, to, tokenId, tokenURI);
      await wrappedHashi721.connect(holder).setApprovalForAll(delegate.address, true);
      await expect(
        hashi721Bridge.connect(delegate).xCall(destination, relayerFee, asset, bridge, tokenId, isTokenURIIgnored)
      )
        .to.emit(connext, "XCallCalled")
        .withArgs(0, destination, bridge, ethers.constants.AddressZero, delegate.address, 0, 0, callData);
    });

    it("should not work when asset is invalid", async function () {
      const { holder, hashi721Bridge, testInvalidERC721, mintedTokenId } = await fixture();

      const relayerFee = 0;
      const to = ADDRESS_1;
      const isTokenURIIgnored = false;
      await expect(
        hashi721Bridge
          .connect(holder)
          .xCall(anotherDomainId, relayerFee, testInvalidERC721.address, to, mintedTokenId, isTokenURIIgnored)
      ).to.revertedWith("Hashi721Bridge: asset is invalid");
    });

    it("should not work when msg sender is invalid", async function () {
      const { malicious, hashi721Bridge, wrappedHashi721, mintedTokenId } = await fixture();
      const relayerFee = 0;
      const to = ADDRESS_1;
      const isTokenURIIgnored = false;
      await expect(
        hashi721Bridge
          .connect(malicious)
          .xCall(anotherDomainId, relayerFee, wrappedHashi721.address, to, mintedTokenId, isTokenURIIgnored)
      ).to.revertedWith("Hashi721Bridge: msg sender is invalid");
    });

    it("should not work when token URI is invalid", async function () {
      const { owner, holder, hashi721Bridge, wrappedHashi721, mintedTokenId } = await fixture();
      const relayerFee = 0;
      const to = ADDRESS_1;
      const isTokenURIIgnored = false;
      await hashi721Bridge.connect(owner).setTokenURILengthLimit(0);
      await expect(
        hashi721Bridge
          .connect(holder)
          .xCall(anotherDomainId, relayerFee, wrappedHashi721.address, to, mintedTokenId, isTokenURIIgnored)
      ).to.revertedWith("Hashi721Bridge: token URI is invalid");
    });
  });

  describe("xReceive", function () {
    it("should work when bridge: [original -> other], * 2", async function () {
      const { WrappedHashi721, wrappedHashi721, hashi721Bridge } = await fixture();
      const originalDomainId = anotherDomainId;
      const originalAsset = ADDRESS_1;
      const to = ADDRESS_1;
      const tokenURI = "";
      const deployedAssetAddress = getDestinationChainNFTAddress(
        hashi721Bridge.address,
        wrappedHashi721.address,
        originalDomainId,
        ADDRESS_1
      );
      const deployedAsset = WrappedHashi721.attach(deployedAssetAddress);
      const firstTokenId = 0;
      const firstCallData = await hashi721Bridge.testEncodeCallData(
        originalDomainId,
        originalAsset,
        to,
        firstTokenId,
        tokenURI
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
        tokenURI
      );
      await expect(hashi721Bridge.testXReceive(secondCallData))
        .to.emit(deployedAsset, "Transfer")
        .withArgs(ethers.constants.AddressZero, to, secondTokenId);
    });

    it("should work when bridge: [other -> original]", async function () {
      const { holder, wrappedHashi721, hashi721Bridge, mintedTokenId } = await fixture();
      await wrappedHashi721.connect(holder).transferFrom(holder.address, hashi721Bridge.address, mintedTokenId);
      const originalDomainId = selfDomainId;
      const originalAsset = wrappedHashi721.address;
      const to = ADDRESS_1;
      const tokenId = mintedTokenId;
      const tokenURI = "";
      const callData = await hashi721Bridge.testEncodeCallData(originalDomainId, originalAsset, to, tokenId, tokenURI);
      await expect(hashi721Bridge.testXReceive(callData))
        .to.emit(wrappedHashi721, "Transfer")
        .withArgs(hashi721Bridge.address, to, tokenId);
    });
  });
});
