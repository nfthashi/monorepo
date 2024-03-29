import fs from "fs";
import { ethers, network } from "hardhat";
import path from "path";

import networkJsonFile from "../network.json";
import { isChainId } from "../types/ChainId";

// this is normal deploy
async function main() {
  const chainId = String(network.config.chainId);
  if (!isChainId(chainId)) {
    throw new Error("chainId invalid");
  }

  console.log("network", networkJsonFile[chainId].name);
  const [signer] = await ethers.getSigners();
  console.log("signer", signer.address);

  const WrappedHashi721 = await ethers.getContractFactory("WrappedHashi721");
  const wrappedHashi721 = await WrappedHashi721.deploy();
  await wrappedHashi721.deployed();
  console.log("wrappedHashi721", wrappedHashi721.address);
  networkJsonFile[chainId].deployments.wrappedHashi721 = wrappedHashi721.address;
  fs.writeFileSync(path.join(__dirname, `../network.json`), JSON.stringify(networkJsonFile));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
