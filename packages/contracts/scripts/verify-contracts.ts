import { network, run } from "hardhat";

import networkJsonFile from "../network.json";
import { isChainId } from "../types/ChainId";

async function main() {
  const chainId = String(network.config.chainId);
  if (!isChainId(chainId)) {
    throw new Error("chainId invalid");
  }

  console.log("network", networkJsonFile[chainId].name);

  for (const [name, address] of Object.entries(networkJsonFile[chainId].deployments)) {
    if (name === "wrappedHashi721" || name === "hashi721Bridge") {
      await run("verify:verify", {
        address,
      }).catch((e) => console.log(e.message));
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
