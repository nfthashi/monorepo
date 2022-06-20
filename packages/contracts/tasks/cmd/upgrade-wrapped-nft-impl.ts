import { task } from "hardhat/config";

task("cmd-upgrade-wrapped-nft-impl", "upgrade bridge")
  .addParam("proxy", "proxy")
  .setAction(async ({ proxy }, { ethers, upgrades }) => {
    const Hashi721Bridge = await ethers.getContractFactory("Hashi721Bridge");
    const {
      deployTransaction: { hash },
    } = await upgrades.upgradeProxy(proxy, Hashi721Bridge);
    console.log("Upgraded at:", hash);
  });
