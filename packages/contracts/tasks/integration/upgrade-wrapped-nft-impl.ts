import { task } from "hardhat/config";

import networks from "../../networks.json";
import { isChain } from "../../types/chain";

task("upgrade-wrapped-nft-impl", "integration upgrade wrapped nft impl").setAction(async (_, { network, run }) => {
  const { name } = network;
  if (!isChain(name)) {
    console.log("network invalid");
    return;
  }
  const { contracts } = networks[name];
  const { bridge } = contracts;

  await run("cmd-upgrade-wrapped-nft-impl", { proxy: bridge });
  console.log("DONE");
});
