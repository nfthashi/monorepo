import { expect } from "chai";
import { ethers } from "hardhat";

import { ADDRESS_1 } from "../lib/constant";

describe("NFTBridge", function () {
  let mockExecuter: any;
  let signer: any;
  let malicious: any;
  let XNFTBridge: any;
  let NFTBridge: any;
  let MockConnextHandler: any;
  let mockConnextHandler: any;

  const selfDomain = "0";
  const opponentDomain = "1";
  const opponentContract = ADDRESS_1;
  const dummyTransactingAssetId = ADDRESS_1;
  const ERC_721_interface_ID = 0x80ac58cd;

  beforeEach(async function () {
    [signer, malicious] = await ethers.getSigners();
    MockConnextHandler = await ethers.getContractFactory("MockConnextHandler");
    mockConnextHandler = await MockConnextHandler.deploy();
    const MockExecuter = await ethers.getContractFactory("MockExecuter");
    mockExecuter = await MockExecuter.deploy();
    await mockConnextHandler.setExecuter(mockExecuter.address);
    XNFTBridge = await ethers.getContractFactory("NFTBridge");
    NFTBridge = await XNFTBridge.deploy(selfDomain, mockConnextHandler.address, dummyTransactingAssetId);
  });

  it("getFunctions", async function () {
    expect(await NFTBridge.getSelfDomain()).to.equal(Number(selfDomain));
    expect(await NFTBridge.isNFTHashiBridge()).to.equal(true);
    expect(await NFTBridge.getConnext()).to.equal(mockConnextHandler.address);
    expect(await NFTBridge.getExecutor()).to.equal(await mockConnextHandler.executor());
    expect(await NFTBridge.supportsInterface(ERC_721_interface_ID)).to.equal(false);
  });

  it("setBridgeContract", async function () {
    await NFTBridge.setBridgeContract(opponentDomain, opponentContract);
    expect(await NFTBridge.getBridgeContract(opponentDomain)).to.equal(opponentContract);
    await expect(NFTBridge.connect(malicious).setBridgeContract(opponentDomain, opponentContract)).to.revertedWith(
      "Ownable: caller is not the owner"
    );
  });
});
