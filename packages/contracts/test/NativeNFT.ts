import { expect } from "chai";
import { ethers } from "hardhat";

import { ADDRESS_1, NULL_ADDRESS } from "../lib/constant";

describe("NativeHashi721", function () {
  let NativeHashi721: any;
  let mockExecuter: any;
  let signer: any;

  const selfDomain = "0";
  const opponentDomain = "1";
  const opponentContract = ADDRESS_1;
  const dummyTransactingAssetId = ADDRESS_1;
  const startTokenId = "0";
  const endTokenId = "10";
  const name = "name";
  const symbol = "symbol";
  const baseTokenURL = "http://localhost:3000/";

  beforeEach(async function () {
    [signer] = await ethers.getSigners();

    const MockConnextHandler = await ethers.getContractFactory("MockConnextHandler");
    const mockConnextHandler = await MockConnextHandler.deploy();
    const MockExecuter = await ethers.getContractFactory("MockExecuter");
    mockExecuter = await MockExecuter.deploy();
    await mockConnextHandler.setExecuter(mockExecuter.address);
    const XNativeHashi721 = await ethers.getContractFactory("NativeHashi721");
    NativeHashi721 = await XNativeHashi721.deploy(
      selfDomain,
      mockConnextHandler.address,
      dummyTransactingAssetId,
      startTokenId,
      endTokenId,
      name,
      symbol,
      baseTokenURL
    );
    await NativeHashi721.setBridgeContract(opponentDomain, opponentContract);
    await NativeHashi721.mint(signer.address);
  });

  it("xSend", async function () {
    const tokenId = startTokenId;
    await expect(NativeHashi721.xSend(signer.address, ADDRESS_1, tokenId, opponentDomain))
      .to.emit(NativeHashi721, "Transfer")
      .withArgs(signer.address, NULL_ADDRESS, tokenId);
  });

  it("xReceive", async function () {
    const tokenId = endTokenId + 1;
    await mockExecuter.setOriginSender(opponentContract);
    await mockExecuter.setOrigin(opponentDomain);
    const data = NativeHashi721.interface.encodeFunctionData("xReceive", [signer.address, tokenId]);
    await mockExecuter.execute(NativeHashi721.address, data);
    expect(await NativeHashi721.ownerOf(tokenId)).to.equal(signer.address);
  });
});
