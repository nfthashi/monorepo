import fs from "fs";
import { task } from "hardhat/config";
import path from "path";

import networks from "../../networks.json";
import { isChain } from "../../types/chain";

task("integration-deploy", "integration deploy")
  .addOptionalParam("skipVerify", "skip verify")
  .setAction(async ({ skipVerify }, { network, run }) => {
    const { name } = network;
    if (!isChain(name)) {
      console.log("network invalid");
      return;
    }
    const { domainId: selfDomainNum, contracts } = networks[name];
    const { connext, testToken: dummyTransactingAssetId } = contracts;
    const selfDomain = selfDomainNum.toString();
    const nftImplementation = await run("cmd-deploy-implementation");
    const bridge = await run("cmd-deploy-bridge", { selfDomain, connext, dummyTransactingAssetId, nftImplementation });
    networks[name].contracts.bridge = bridge;

    fs.writeFileSync(path.join(__dirname, "../../networks.json"), JSON.stringify(networks));

    if (!skipVerify) {
      await run("verify:verify", {
        address: nftImplementation,
        constructorArguments: [],
      }).catch((err) => console.log(err.message));

      await run("verify:verify", {
        address: bridge,
        constructorArguments: [selfDomain, connext, dummyTransactingAssetId, nftImplementation],
      }).catch((err) => console.log(err.message));
    }

    console.log("DONE");
  });
