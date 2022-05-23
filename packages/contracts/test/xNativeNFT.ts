import { expect } from "chai";
import { ethers } from "hardhat";
import { NULL_ADDRESS, ADDRESS_1 } from "../lib/constant";

describe("xNativeNFT", function () {
  let xNativeNFT: any;
  let mockExecuter: any;
  let signer: any;

  const selfDomain = "0";
  const opponentDomain = "1";
  const opponentContract = ADDRESS_1;
  const dummyTransactingAssetId = ADDRESS_1;
  const startTokenId = "0";
  const endTokenId = "10";

  this.beforeEach(async function () {
    [signer] = await ethers.getSigners();

    const MockConnextHandler = await ethers.getContractFactory("MockConnextHandler");
    const mockConnextHandler = await MockConnextHandler.deploy();

    const MockExecuter = await ethers.getContractFactory("MockExecuter");
    mockExecuter = await MockExecuter.deploy();
    await mockConnextHandler.setExecuter(mockExecuter.address);

    const XNativeNFT = await ethers.getContractFactory("xNativeNFT");
    xNativeNFT = await XNativeNFT.deploy(
      selfDomain,
      mockConnextHandler.address,
      dummyTransactingAssetId,
      startTokenId,
      endTokenId
    );
    await xNativeNFT.register(opponentDomain, opponentContract);
    await xNativeNFT.mint(signer.address);
  });

  it("xSend", async function () {
    const tokenId = startTokenId;
    await expect(xNativeNFT.xSend(signer.address, ADDRESS_1, tokenId, opponentDomain))
      .to.emit(xNativeNFT, "Transfer")
      .withArgs(signer.address, NULL_ADDRESS, tokenId);
  });

  it("xReceive", async function () {
    const tokenId = endTokenId + 1;
    await mockExecuter.setOriginSender(opponentContract);
    await mockExecuter.setOrigin(opponentDomain);
    const data = xNativeNFT.interface.encodeFunctionData("xReceive", [signer.address, tokenId]);
    await mockExecuter.execute(xNativeNFT.address, data);
    expect(await xNativeNFT.ownerOf(tokenId)).to.equal(signer.address);
  });
});
