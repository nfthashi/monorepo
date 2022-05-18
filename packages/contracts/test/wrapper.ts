// import { expect } from "chai";
import { ethers } from "hardhat";

// import { MockNFT } from "../typechain";

describe("Wrapper", function () {
  let mockNFT: any;

  this.beforeEach(async function () {
    const MockNFT = await ethers.getContractFactory("MockNFT");
    mockNFT = await MockNFT.deploy();
    await mockNFT.deployed();
  });
});
