import { task } from "hardhat/config";

import networks from "../../networks.json";
import { isChain } from "../../types/chain";

task("integration-upgrade-bridge", "integration upgrade bridge").setAction(async (_, { network, run }) => {
  const { name } = network;
  if (!isChain(name)) {
    console.log("network invalid");
    return;
  }
  const { contracts } = networks[name];
  const { bridge } = contracts;

  await run("cmd-upgrade-bridge", { proxy: bridge });
  console.log("DONE");
});
