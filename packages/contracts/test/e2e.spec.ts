import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";

describe("e2e", function () {
  async function fixture() {
    const [signer] = await ethers.getSigners();
    return { signer };
  }

  describe("xCall", function () {
    it("should work", async function () {
      const { signer } = await loadFixture(fixture);
    });
  });
});
