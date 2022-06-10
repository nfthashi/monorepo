import { task } from "hardhat/config";

task("register", "register")
  .addParam("selfContractAddress", "self contract address")
  .addParam("opponentDomain", "opponent domain")
  .addParam("opponentContractAddress", "opponent contract address")
  .setAction(async ({ selfContractAddress, opponentDomain, opponentContractAddress }, { ethers }) => {
    const HashiConnextAdapter = await ethers.getContractFactory("HashiConnextAdapter");
    const hashiConnextAdapter = await HashiConnextAdapter.attach(selfContractAddress);
    const { hash } = await hashiConnextAdapter.setBridgeContract(opponentDomain, opponentContractAddress);
    console.log("Registered at:", hash);
  });
