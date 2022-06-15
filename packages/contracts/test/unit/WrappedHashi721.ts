import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { NULL_ADDRESS } from "../../lib/constant";
import { WrappedHashi721 } from "../../typechain";

describe("Unit Test for WrappedHashi721", function () {
  let signer: SignerWithAddress;
  let malicious: SignerWithAddress;
  let wrappedHashi721: WrappedHashi721;

  const baseURI = "http://localhost:3000/";

  beforeEach(async function () {
    [signer, malicious] = await ethers.getSigners();
    const WrappedHashi721 = await ethers.getContractFactory("WrappedHashi721");
    wrappedHashi721 = await WrappedHashi721.deploy();
  });

  it("initialize", async function () {
    await wrappedHashi721.initialize();
    await expect(wrappedHashi721.initialize()).to.revertedWith("Initializable: contract is already initialized");
  });

  it("mint", async function () {
    const tokenId_1 = 0;
    const tokenId_2 = 1;
    const tokenURI = `${baseURI}${tokenId_1}`;
    await wrappedHashi721.initialize();
    await expect(wrappedHashi721.connect(malicious).mint(signer.address, tokenId_1, tokenURI)).to.revertedWith(
      "Ownable: caller is not the owner"
    );
    await expect(wrappedHashi721.mint(signer.address, tokenId_1, tokenURI))
      .to.emit(wrappedHashi721, "Transfer")
      .withArgs(NULL_ADDRESS, signer.address, tokenId_1);

    await expect(wrappedHashi721.mint(signer.address, tokenId_2, ""))
      .to.emit(wrappedHashi721, "Transfer")
      .withArgs(NULL_ADDRESS, signer.address, tokenId_2);
  });

  it("burn", async function () {
    const tokenId = 0;
    const tokenURI = `${baseURI}${tokenId}`;
    await wrappedHashi721.initialize();
    await wrappedHashi721.mint(signer.address, tokenId, tokenURI);
    await expect(wrappedHashi721.connect(malicious).burn(tokenId)).to.revertedWith("Ownable: caller is not the owner");
    await expect(wrappedHashi721.burn(tokenId))
      .to.emit(wrappedHashi721, "Transfer")
      .withArgs(signer.address, NULL_ADDRESS, tokenId);
  });

  it("tokenURI", async function () {
    const tokenId = 0;
    const tokenURI = `${baseURI}${tokenId}`;
    await wrappedHashi721.initialize();
    await wrappedHashi721.mint(signer.address, tokenId, tokenURI);
    expect(await wrappedHashi721.tokenURI(tokenId)).to.equal(tokenURI);
  });

  it("isWrappedHashi721", async function () {
    expect(await wrappedHashi721.isWrappedHashi721()).to.equal(true);
  });

  it("supportsInterface", async function () {
    const wrappedHashi721InterfaceId = "0x8c83d27f";
    const erc721InterfaceId = "0x80ac58cd";
    expect(await wrappedHashi721.supportsInterface(wrappedHashi721InterfaceId)).to.equal(true);
    expect(await wrappedHashi721.supportsInterface(erc721InterfaceId)).to.equal(true);
  });
});
