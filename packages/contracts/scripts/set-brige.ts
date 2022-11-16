import { ethers, network } from "hardhat";

import networkJsonFile from "../network.json";
import { isChainId } from "../types/ChainId";

async function main() {
  const chainId = String(network.config.chainId);
  if (!isChainId(chainId)) {
    throw new Error("chainId invalid");
  }

  console.log("network", networkJsonFile[chainId].name);
  const [signer] = await ethers.getSigners();
  console.log("signer", signer.address);

  const Hashi721Bridge = await ethers.getContractFactory("Hashi721Bridge");
  const hashi721Bridge = Hashi721Bridge.attach(networkJsonFile[chainId].deployments.hashi721Bridge);

  for (const network of Object.entries(networkJsonFile)
    .filter(([_chainId]) => chainId !== _chainId)
    .map(([, _network]) => _network)) {
    const registeredBridge = await hashi721Bridge.bridges(network.domainId);
    if (registeredBridge !== network.deployments.hashi721Bridge) {
      console.log(network.name, "is not registered");
      console.log("domain id:", network.domainId);
      console.log("bridge:", network.deployments.hashi721Bridge);
      const tx = await hashi721Bridge.setBridge(network.domainId, network.deployments.hashi721Bridge);
      console.log("sent", tx.hash);
      await tx.wait();
      console.log("tx confirmed");
    } else {
      console.log(network.name, "is already registered");
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
