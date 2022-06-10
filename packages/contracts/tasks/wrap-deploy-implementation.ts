import { task } from "hardhat/config";

task("wrap-deploy-implementation", "deploy wrap target xNFTs contract").setAction(async (_, { ethers }) => {
  const WrappedHashi721 = await ethers.getContractFactory("WrappedHashi721");
  const wrappedNFT = await WrappedHashi721.deploy();
  await wrappedNFT.deployed();
  console.log("Deployed to: ", wrappedNFT.address);
  return wrappedNFT.address;
});
