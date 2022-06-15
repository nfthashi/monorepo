import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { ADDRESS_1, ADDRESS_2, NULL_ADDRESS } from "../lib/constant";
import { MockConnextHandler, MockExecutor, MockExecutor__factory, MockHashiConnextAdapter } from "../typechain";

describe("HashiConnextAdapter", function () {
  let malicious: SignerWithAddress;

  let MockExecutor: MockExecutor__factory;
  let mockExecutor: MockExecutor;
  let mockConnextHandler: MockConnextHandler;
  let mockHashiConnextAdapter: MockHashiConnextAdapter;

  const selfDomain = 0;
  const opponentDomain = 1;
  const opponentContract = ADDRESS_1;

  const dummyTransactingAssetId = ADDRESS_1;

  beforeEach(async function () {
    [, malicious] = await ethers.getSigners();
    const MockConnextHandler = await ethers.getContractFactory("MockConnextHandler");
    mockConnextHandler = await MockConnextHandler.deploy();
    MockExecutor = await ethers.getContractFactory("MockExecutor");
    mockExecutor = await MockExecutor.deploy();
    mockExecutor.setOrigin(opponentDomain);
    mockExecutor.setOriginSender(opponentContract);
    await mockConnextHandler.setExecutor(mockExecutor.address);
    const MockHashiConnextAdapter = await ethers.getContractFactory("MockHashiConnextAdapter");
    mockHashiConnextAdapter = await MockHashiConnextAdapter.deploy(
      selfDomain,
      mockConnextHandler.address,
      dummyTransactingAssetId
    );
  });

  it("getBridgeContract", async function () {
    await mockHashiConnextAdapter.setBridgeContract(opponentDomain, opponentContract);
    expect(await mockHashiConnextAdapter.getBridgeContract(opponentDomain)).to.equal(opponentContract);
  });

  it("getConnext", async function () {
    expect(await mockHashiConnextAdapter.getConnext()).to.equal(mockConnextHandler.address);
  });

  it("getExecutor", async function () {
    expect(await mockHashiConnextAdapter.getExecutor()).to.equal(mockExecutor.address);
  });

  it("getSelfDomain", async function () {
    expect(await mockHashiConnextAdapter.getSelfDomain()).to.equal(selfDomain);
  });

  it("setBridgeContract", async function () {
    expect(await mockHashiConnextAdapter.getBridgeContract(opponentDomain)).to.equal(NULL_ADDRESS);
    await expect(mockHashiConnextAdapter.setBridgeContract(opponentDomain, opponentContract))
      .to.emit(mockHashiConnextAdapter, "BridgeSet")
      .withArgs(opponentDomain, opponentContract);
    await expect(
      mockHashiConnextAdapter.connect(malicious).setBridgeContract(opponentDomain, opponentContract)
    ).to.revertedWith("Ownable: caller is not the owner");
  });

  it("onlyExecutor", async function () {
    const testOnlyExecutorSighash = mockHashiConnextAdapter.interface.getSighash("testOnlyExecutor()");
    await mockHashiConnextAdapter.setBridgeContract(opponentDomain, opponentContract);
    await mockExecutor.execute(mockHashiConnextAdapter.address, testOnlyExecutorSighash);

    const malciousMockExecutor = await MockExecutor.deploy();
    await expect(
      malciousMockExecutor.execute(mockHashiConnextAdapter.address, testOnlyExecutorSighash)
    ).to.revertedWith("HashiConnextAdapter: sender is not executor");

    const mistakeContract = ADDRESS_2;
    await mockHashiConnextAdapter.setBridgeContract(opponentDomain, mistakeContract);
    await expect(mockExecutor.execute(mockHashiConnextAdapter.address, testOnlyExecutorSighash)).to.revertedWith(
      "HashiConnextAdapter: invalid origin sender"
    );
  });

  it("xCall", async function () {
    await expect(mockHashiConnextAdapter.testXCall(opponentDomain, "0x")).to.revertedWith(
      "HashiConnextAdapter: invalid bridge"
    );
    await mockHashiConnextAdapter.setBridgeContract(opponentDomain, opponentContract);
    await mockHashiConnextAdapter.testXCall(opponentDomain, "0x");
  });
});
