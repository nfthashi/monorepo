import { expect } from "chai";
import { ethers } from "hardhat";

import { ADDRESS_1 } from "./helper/constant";

describe("WrappedHashi721", function () {
  const baseURI = "http://localhost:3000/";

  async function fixture() {
    const [signer, owner, malicious] = await ethers.getSigners();
    const WrappedHashi721 = await ethers.getContractFactory("WrappedHashi721");
    const wrappedHashi721 = await WrappedHashi721.connect(signer).deploy();
    await wrappedHashi721.connect(owner).initialize();
    return { signer, owner, malicious, wrappedHashi721 };
  }

  describe("deployments", function () {
    it("should work", async function () {
      const { owner, wrappedHashi721 } = await fixture();
      expect(await wrappedHashi721.name()).to.eq("WrappedHashi721");
      expect(await wrappedHashi721.symbol()).to.eq("WHASHI721");
      expect(await wrappedHashi721.owner()).to.eq(owner.address);
    });

    it("should not work when contract is already initialized", async function () {
      const { owner, wrappedHashi721 } = await fixture();
      await expect(wrappedHashi721.connect(owner).initialize()).to.revertedWith(
        "Initializable: contract is already initialized"
      );
    });
  });

  describe("mint", function () {
    it("should work", async function () {
      const { owner, wrappedHashi721 } = await fixture();
      const tokenId = 0;
      const tokenURI = `${baseURI}${tokenId}`;
      const to = ADDRESS_1;
      await expect(wrappedHashi721.connect(owner).mint(to, tokenId, tokenURI))
        .to.emit(wrappedHashi721, "Transfer")
        .withArgs(ethers.constants.AddressZero, to, tokenId);
    });

    it("should not work when caller is not the owner", async function () {
      const { malicious, wrappedHashi721 } = await fixture();
      const tokenId = 0;
      const tokenURI = `${baseURI}${tokenId}`;
      const to = ADDRESS_1;
      await expect(wrappedHashi721.connect(malicious).mint(to, tokenId, tokenURI)).to.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });

  describe("burn", function () {
    it("should work", async function () {
      const { owner, wrappedHashi721 } = await fixture();
      const tokenId = 0;
      const tokenURI = `${baseURI}${tokenId}`;
      const to = ADDRESS_1;
      await expect(wrappedHashi721.connect(owner).mint(to, tokenId, tokenURI))
        .to.emit(wrappedHashi721, "Transfer")
        .withArgs(ethers.constants.AddressZero, to, tokenId);
      await expect(wrappedHashi721.connect(owner).burn(tokenId))
        .to.emit(wrappedHashi721, "Transfer")
        .withArgs(to, ethers.constants.AddressZero, tokenId);
    });

    it("should not work when caller is not the owner", async function () {
      const { owner, malicious, wrappedHashi721 } = await fixture();
      const tokenId = 0;
      const tokenURI = `${baseURI}${tokenId}`;
      const to = ADDRESS_1;
      await expect(wrappedHashi721.connect(owner).mint(to, tokenId, tokenURI))
        .to.emit(wrappedHashi721, "Transfer")
        .withArgs(ethers.constants.AddressZero, to, tokenId);
      await expect(wrappedHashi721.connect(malicious).burn(tokenId)).to.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });
});
