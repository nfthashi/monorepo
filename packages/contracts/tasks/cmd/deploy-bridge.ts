import { task } from "hardhat/config";

task("cmd-deploy-bridge", "cmd deploy bridge")
  .addParam("selfDomain", "self domain")
  .addParam("connext", "connext")
  .addParam("wrappedNftImplementation", "nft implementation")
  .setAction(
    async ({ selfDomain, connext, wrappedNftImplementation }, { ethers, upgrades }) => {
      const Hashi721Bridge = await ethers.getContractFactory("Hashi721Bridge");
      const hashi721Bridge = await upgrades.deployProxy(Hashi721Bridge, [
        selfDomain,
        connext,
        wrappedNftImplementation,
      ]);
      await hashi721Bridge.deployed();
      console.log("Deployed to: ", hashi721Bridge.address);
      return hashi721Bridge.address;
    }
  );
