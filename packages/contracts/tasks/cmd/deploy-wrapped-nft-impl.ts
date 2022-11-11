import { task } from "hardhat/config";

task("cmd-deploy-wrapped-nft-impl", "cmd deploy wrapped nft").setAction(async (_, { ethers }) => {
  const WrappedHashi721 = await ethers.getContractFactory("WrappedHashi721");
  const wrappedHashi721 = await WrappedHashi721.deploy();
  await wrappedHashi721.deployed();
  console.log("Deployed to: ", wrappedHashi721.address);
  await wrappedHashi721.initialize();
  return wrappedHashi721.address;
});
