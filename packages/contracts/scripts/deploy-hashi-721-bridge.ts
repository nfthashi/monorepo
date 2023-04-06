import fs from "fs";
import { ethers, network, upgrades } from "hardhat";
import path from "path";

import { TIMEOUT, TOKEN_URI_LENGTH_LIMIT } from "../config";
import networkJsonFile from "../network.json";
import { isChainId } from "../types/ChainId";

// this is deploy with oz upgrades
async function main() {
  const chainId = String(network.config.chainId);
  if (!isChainId(chainId)) {
    throw new Error("chainId invalid");
  }

  console.log("network", networkJsonFile[chainId].name);
  const [signer] = await ethers.getSigners();
  console.log("signer", signer.address);

  const Hashi721Bridge = await ethers.getContractFactory("Hashi721Bridge");
  const hashi721Bridge = await upgrades.deployProxy(
    Hashi721Bridge,
    [
      networkJsonFile[chainId].deployments.connext,
      networkJsonFile[chainId].deployments.wrappedHashi721,
      TOKEN_URI_LENGTH_LIMIT,
    ],
    { timeout: TIMEOUT }
  );
  await hashi721Bridge.deployed();
  console.log("hashi721Bridge", hashi721Bridge.address);
  networkJsonFile[chainId].deployments.hashi721Bridge = hashi721Bridge.address;
  fs.writeFileSync(path.join(__dirname, `../network.json`), JSON.stringify(networkJsonFile));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
