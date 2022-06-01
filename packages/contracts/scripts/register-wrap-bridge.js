/* eslint-disable @typescript-eslint/no-var-requires */
const networks = require("../networks.json");
const { run, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const { name } = network;
  const config = networks[name];
  if (!config) {
    console.log("network not supported");
    return;
  }
  const { contracts } = networks[name];
  const { bridge: selfContractAddress } = contracts;
  if (!selfContractAddress) {
    console.log("bridge not deployed");
    return;
  }
  for (const [key, value] of Object.entries(networks)) {
    if (key !== name) {
      const { domainId: opponentDomainNum, contracts } = value;
      const { bridge: opponentContractAddress } = contracts;
      const opponentDomain = opponentDomainNum.toString();
      await run("register", { selfContractAddress, opponentDomain, opponentContractAddress });
    }
  }
  console.log("DONE");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
