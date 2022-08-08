import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { ADDRESS_1, ADDRESS_2, NULL_ADDRESS } from "../../lib/constant";
import { MockConnextHandler, MockExecutor, MockExecutor__factory, MockHashiConnextAdapter } from "../../typechain";

describe("Unit Test for HashiConnextAdapter", function () {
  let malicious: SignerWithAddress;

  let MockExecutor: MockExecutor__factory;
  let mockExecutor: MockExecutor;
  let mockConnextHandler: MockConnextHandler;
  let mockHashiConnextAdapter: MockHashiConnextAdapter;

  const selfDomain = 0;
  const opponentDomain = 1;
  const domainVersion = 1;
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
    await mockHashiConnextAdapter.setBridgeContract(opponentDomain, domainVersion, opponentContract);
    expect(
      await mockHashiConnextAdapter.getBridgeContract(opponentDomain, domainVersion)
    ).to.equal(opponentContract);
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

  it("getTransactingAssetId", async function () {
    expect(await mockHashiConnextAdapter.getTransactingAssetId()).to.equal(dummyTransactingAssetId);
  });

  it("setBridgeContract", async function () {
    expect(await mockHashiConnextAdapter.getBridgeContract(opponentDomain, domainVersion)).to.equal(NULL_ADDRESS);
    await expect(mockHashiConnextAdapter.setBridgeContract(opponentDomain, domainVersion, opponentContract))
      .to.emit(mockHashiConnextAdapter, "BridgeSet")
      .withArgs(opponentDomain, opponentContract);
    await expect(
      mockHashiConnextAdapter.connect(malicious).setBridgeContract(opponentDomain, domainVersion, opponentContract)
    ).to.revertedWith("Ownable: caller is not the owner");
  });

  it("onlyExecutor", async function () {
    const testOnlyExecutorSighash = mockHashiConnextAdapter.interface.getSighash("testOnlyExecutor()");
    await mockHashiConnextAdapter.setBridgeContract(opponentDomain, domainVersion,opponentContract);
    await mockExecutor.execute(mockHashiConnextAdapter.address, testOnlyExecutorSighash);

    const malciousMockExecutor = await MockExecutor.deploy();
    await expect(
      malciousMockExecutor.execute(mockHashiConnextAdapter.address, testOnlyExecutorSighash)
    ).to.revertedWith("HashiConnextAdapter: sender invalid");

    const mistakeContract = ADDRESS_2;
    await mockHashiConnextAdapter.setBridgeContract(opponentDomain, domainVersion, mistakeContract);
    await expect(mockExecutor.execute(mockHashiConnextAdapter.address, testOnlyExecutorSighash)).to.revertedWith(
      "HashiConnextAdapter: origin sender invalid"
    );
  });

  it("xCall", async function () {
    await expect(mockHashiConnextAdapter.testXCall(opponentDomain, domainVersion,"0x")).to.revertedWith(
      "HashiConnextAdapter: invalid bridge"
    );
    await mockHashiConnextAdapter.setBridgeContract(opponentDomain, domainVersion,opponentContract);
    await mockHashiConnextAdapter.testXCall(opponentDomain, domainVersion, "0x");
  });
});
