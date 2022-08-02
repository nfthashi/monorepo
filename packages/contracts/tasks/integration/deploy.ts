import fs from "fs";
import { task } from "hardhat/config";
import path from "path";

import networks from "../../networks.json";
import { isChain } from "../../types/chain";

task("integration-deploy", "integration deploy")
  .addOptionalParam("skipVerify", "skip verify")
  .setAction(async (_, { network, run }) => {
    const { name } = network;
    if (!isChain(name)) {
      console.log("network invalid");
      return;
    }
    const { domainId: selfDomainNum, contracts } = networks[name];
    const { connext } = contracts;
    const selfDomain = selfDomainNum.toString();
    const wrappedNftImplementation = await run("cmd-deploy-wrapped-nft-impl");
    const bridge = await run("cmd-deploy-bridge", {
      selfDomain,
      connext,
      wrappedNftImplementation,
    });
    networks[name].contracts.wrappedNftImplementation = wrappedNftImplementation;
    networks[name].contracts.bridge = bridge;

    fs.writeFileSync(path.join(__dirname, "../../networks.json"), JSON.stringify(networks));

    console.log("DONE");
  });
