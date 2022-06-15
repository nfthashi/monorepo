import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { ADDRESS_1 } from "../../../lib/constant";
import { NativeHashi721Example } from "../../../typechain";

describe("Unit Test for NativeHashi721Example", function () {
  let signer: SignerWithAddress;

  let nativeHashi721Example: NativeHashi721Example;

  const selfDomain = "0";
  const opponentDomain = "1";
  const opponentContract = ADDRESS_1;
  const dummyTransactingAssetId = ADDRESS_1;
  const name = "name";
  const symbol = "symbol";
  const startTokenId = "0";
  const endTokenId = "0";
  const baseTokenURI = "http://localhost:3000/";

  beforeEach(async function () {
    [signer] = await ethers.getSigners();

    const MockConnextHandler = await ethers.getContractFactory("MockConnextHandler");
    const mockConnextHandler = await MockConnextHandler.deploy();
    const MockExecutor = await ethers.getContractFactory("MockExecutor");
    const mockExecutor = await MockExecutor.deploy();
    await mockExecutor.setOriginSender(opponentContract);
    await mockExecutor.setOrigin(opponentDomain);
    await mockConnextHandler.setExecutor(mockExecutor.address);

    const NativeHashi721Example = await ethers.getContractFactory("NativeHashi721Example");
    nativeHashi721Example = await NativeHashi721Example.deploy(
      selfDomain,
      mockConnextHandler.address,
      dummyTransactingAssetId,
      name,
      symbol,
      startTokenId,
      endTokenId,
      baseTokenURI
    );
  });

  it("mint", async function () {
    await nativeHashi721Example.mint(signer.address);
    await expect(nativeHashi721Example.mint(signer.address)).to.revertedWith("NativeHashi721: mint finished");
  });

  it("tokenURI", async function () {
    await nativeHashi721Example.mint(signer.address);
    expect(await nativeHashi721Example.tokenURI(startTokenId)).to.equal(`${baseTokenURI}${startTokenId}`);
  });
});
