import { task } from "hardhat/config";

task("wrap-deploy-mock-with-mint", "deploy wrap mock xNFTs and mint")
  .addParam("amount", "amount")
  .addParam("to", "to")
  .setAction(async ({ amount, to }, { ethers }) => {
    const MockNFT = await ethers.getContractFactory("MockNFT");
    const mockNFT = await MockNFT.deploy();
    await mockNFT.deployed();
    console.log("Deployed to: ", mockNFT.address);
    for (let i = 0; i < amount; i++) {
      const { hash } = await mockNFT.mint(to);
      console.log("Minted at: ", hash);
    }
  });
