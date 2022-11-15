import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Contract Name", function () {
  async function fixture() {
    const [signer] = await ethers.getSigners();
    const Test = await ethers.getContractFactory("Test");
    const test = await Test.deploy();
    return { signer, test };
  }

  it("deployments", async function () {
    const { signer, test } = await loadFixture(fixture);
    expect(await signer.address).to.not.eq("");
    expect(await test.address).to.not.eq("");
  });

  describe("Function Name", function () {
    it("should work", async function () {
      const { signer, test } = await loadFixture(fixture);
      await test.test();
      expect(await test.caller()).to.eq(signer.address);
    });
  });
});
