import { task } from "hardhat/config";

task("cmd-register", "cmd register")
  .addParam("selfContractAddress", "self contract address")
  .addParam("opponentDomain", "opponent domain")
  .addParam("domainVersion", "domain version")
  .addParam("opponentContractAddress", "opponent contract address")
  .setAction(async ({ selfContractAddress, opponentDomain, domainVersion, opponentContractAddress }, { ethers }) => {
    const HashiConnextAdapter = await ethers.getContractFactory("HashiConnextAdapter");
    const hashiConnextAdapter = await HashiConnextAdapter.attach(selfContractAddress);
    const { hash } = await hashiConnextAdapter.setBridgeContract(
      opponentDomain,
      domainVersion,
      opponentContractAddress
    );
    console.log("Registered at:", hash);
  });
