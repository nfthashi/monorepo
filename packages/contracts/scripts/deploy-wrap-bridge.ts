import fs from "fs";
import { network, run } from "hardhat";
import path from "path";

import networks from "../networks.json";

async function main() {
  const { name } = network;
  const config = networks[name];
  if (!config) {
    console.log("network not supported");
    return;
  }
  const { domainId: selfDomainNum, contracts } = networks[name];
  const { connext, testToken: dummyTransactingAssetId } = contracts;
  const selfDomain = selfDomainNum.toString();
  const nftImplementation = await run("wrap-deploy-implementation");
  const bridge = await run("wrap-deploy", { selfDomain, connext, dummyTransactingAssetId, nftImplementation });
  networks[name].contracts.bridge = bridge;
  await run("verify:verify", {
    address: bridge,
    constructorArguments: [selfDomain, connext, dummyTransactingAssetId, nftImplementation],
  });
  fs.writeFileSync(path.join(__dirname, "../networks.json"), JSON.stringify(networks));
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
