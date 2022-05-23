import { expect } from "chai";
import { ethers } from "hardhat";
import { NULL_ADDRESS, ADDRESS_1 } from "../lib/constant";

describe("xNativeNFT", function () {
  let xNFTWrapBridge: any;
  let mockExecuter: any;
  let XWrappedNFT: any;
  let xWrappedNFT: any;
  let mockNFT: any;
  let mockClone: any;
  let signer: any;

  const startTokenId = 0;

  const selfDomain = "0";
  const opponentDomain = "1";
  const otherBirthChainDomain = "2";

  const opponentContract = ADDRESS_1;
  const dummyTransactingAssetId = ADDRESS_1;

  this.beforeEach(async function () {
    [signer] = await ethers.getSigners();

    const MockConnextHandler = await ethers.getContractFactory("MockConnextHandler");
    const mockConnextHandler = await MockConnextHandler.deploy();

    const MockExecuter = await ethers.getContractFactory("MockExecuter");
    mockExecuter = await MockExecuter.deploy();
    await mockConnextHandler.setExecuter(mockExecuter.address);

    XWrappedNFT = await ethers.getContractFactory("xWrappedNFT");
    xWrappedNFT = await XWrappedNFT.deploy();

    const XNFTWrapBridge = await ethers.getContractFactory("xNFTWrapBridge");
    xNFTWrapBridge = await XNFTWrapBridge.deploy(
      selfDomain,
      mockConnextHandler.address,
      dummyTransactingAssetId,
      xWrappedNFT.address
    );
    await xNFTWrapBridge.register(opponentDomain, opponentContract);

    const MockNFT = await ethers.getContractFactory("MockNFT");
    mockNFT = await MockNFT.deploy();
    await mockNFT.mint(signer.address);
    await mockNFT.setApprovalForAll(xNFTWrapBridge.address, true);

    const MockClone = await ethers.getContractFactory("MockClone");
    mockClone = await MockClone.deploy();
  });

  it("xSend - from birth chain", async function () {
    const tokenId = startTokenId;
    await expect(xNFTWrapBridge.xSend(mockNFT.address, signer.address, ADDRESS_1, tokenId, opponentDomain))
      .to.emit(mockNFT, "Transfer")
      .withArgs(signer.address, xNFTWrapBridge.address, tokenId);
  });

  it("xReceive - to non birth chain", async function () {
    const tokenId = startTokenId;
    await mockExecuter.setOriginSender(opponentContract);
    await mockExecuter.setOrigin(opponentDomain);

    const data = xNFTWrapBridge.interface.encodeFunctionData("xReceive", [
      mockNFT.address,
      signer.address,
      tokenId,
      otherBirthChainDomain,
      selfDomain,
    ]);
    await mockExecuter.execute(xNFTWrapBridge.address, data);
    const salt = ethers.utils.solidityKeccak256(["uint32", "address"], [otherBirthChainDomain, mockNFT.address]);
    const deployedContractAddress = await mockClone.predictDeterministicAddress(
      xWrappedNFT.address,
      salt,
      xNFTWrapBridge.address
    );
    const deployedContract = XWrappedNFT.attach(deployedContractAddress);
    expect(await deployedContract.ownerOf(tokenId)).to.equal(signer.address);
  });
});
