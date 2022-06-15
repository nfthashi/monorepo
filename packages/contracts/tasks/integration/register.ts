import { task } from "hardhat/config";

import networks from "../../networks.json";
import { isChain } from "../../types/chain";

task("integration-register", "integration register").setAction(async (_, { network, run }) => {
  const { name } = network;
  if (!isChain(name)) {
    console.log("network invalid");
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
      await run("cmd-register", { selfContractAddress, opponentDomain, opponentContractAddress });
    }
  }
  console.log("DONE");
});
