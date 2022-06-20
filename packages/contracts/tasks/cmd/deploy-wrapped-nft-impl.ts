import { task } from "hardhat/config";

task("cmd-deploy-wrapped-nft-impl", "cmd deploy wrapped nft").setAction(async (_, { ethers, upgrades }) => {
  const WrappedHashi721 = await ethers.getContractFactory("WrappedHashi721");
  const wrappedHashi721 = await upgrades.deployProxy(WrappedHashi721);
  await wrappedHashi721.deployed();
  console.log("Deployed to: ", wrappedHashi721.address);
  return wrappedHashi721.address;
});
