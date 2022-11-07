import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { ADDRESS_1, NULL_ADDRESS } from "../../lib/constant";
import { MockConnextHandler,  MockHashiConnextAdapter } from "../../typechain";

describe("Unit Test for HashiConnextAdapter", function () {
  let malicious: SignerWithAddress;

  let mockConnextHandler: MockConnextHandler;
  let mockHashiConnextAdapter: MockHashiConnextAdapter;

  const selfDomain = 0;
  const opponentDomain = 1;
  const opponentContract = ADDRESS_1;

  beforeEach(async function () {
    [, malicious] = await ethers.getSigners();
    const MockConnextHandler = await ethers.getContractFactory("MockConnextHandler");
    mockConnextHandler = await MockConnextHandler.deploy();
    const MockHashiConnextAdapter = await ethers.getContractFactory("MockHashiConnextAdapter");
    mockHashiConnextAdapter = await MockHashiConnextAdapter.deploy(
      selfDomain,
      mockConnextHandler.address,
    );
  });

  it("getBridgeContract", async function () {
    await mockHashiConnextAdapter.setBridgeContract(opponentDomain, opponentContract);
    expect(await mockHashiConnextAdapter.getBridgeContract(opponentDomain)).to.equal(opponentContract);
  });

  it("getConnext", async function () {
    expect(await mockHashiConnextAdapter.getConnext()).to.equal(mockConnextHandler.address);
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

  it("xCall", async function () {
    await expect(mockHashiConnextAdapter.testXCall(opponentDomain, "0", "0x")).to.revertedWith(
      "HashiConnextAdapter: invalid domainID"
    );
    await mockHashiConnextAdapter.setBridgeContract(opponentDomain, opponentContract);
    await mockHashiConnextAdapter.testXCall(opponentDomain, "0", "0x");
  });
});
