import { expect } from "chai";
import { ethers } from "hardhat";
import { NULL_ADDRESS, ADDRESS_1 } from "../lib/constant";

describe("NativeNFT", function () {
  let NativeNFT: any;
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
    const XNativeNFT = await ethers.getContractFactory("NativeNFT");
    NativeNFT = await XNativeNFT.deploy(
      selfDomain,
      mockConnextHandler.address,
      dummyTransactingAssetId,
      startTokenId,
      endTokenId,
      name,
      symbol,
      baseTokenURL
    );
    await NativeNFT.setBridgeContract(opponentDomain, opponentContract);
    await NativeNFT.mint(signer.address);
  });

  it("xSend", async function () {
    const tokenId = startTokenId;
    await expect(NativeNFT.xSend(signer.address, ADDRESS_1, tokenId, opponentDomain))
      .to.emit(NativeNFT, "Transfer")
      .withArgs(signer.address, NULL_ADDRESS, tokenId);
  });

  it("xReceive", async function () {
    const tokenId = endTokenId + 1;
    await mockExecuter.setOriginSender(opponentContract);
    await mockExecuter.setOrigin(opponentDomain);
    const data = NativeNFT.interface.encodeFunctionData("xReceive", [signer.address, tokenId]);
    await mockExecuter.execute(NativeNFT.address, data);
    expect(await NativeNFT.ownerOf(tokenId)).to.equal(signer.address);
  });
});
