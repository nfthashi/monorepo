import { task } from "hardhat/config";

task("cmd-deploy-bridge", "cmd deploy bridge")
  .addParam("selfDomain", "self domain")
  .addParam("connext", "connext")
  .addParam("dummyTransactingAssetId", "dummy transacting asset id")
  .addParam("nftImplementation", "nft implementation")
  .setAction(async ({ selfDomain, connext, dummyTransactingAssetId, nftImplementation }, { ethers }) => {
    const Hashi721Bridge = await ethers.getContractFactory("Hashi721Bridge");
    const hashi721Bridge = await Hashi721Bridge.deploy();
    await hashi721Bridge.deployed();
    await hashi721Bridge.initialize(selfDomain, connext, dummyTransactingAssetId, nftImplementation);
    console.log("Deployed to: ", hashi721Bridge.address);
    return hashi721Bridge.address;
  });
