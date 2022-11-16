import { ethers, network } from "hardhat";

import networkJsonFile from "../network.json";
import { isChainId } from "../types/ChainId";

const isE2ETest = process.env.IS_E2E_TEST === "true";
const onlyForE2ETest = isE2ETest ? describe.only : describe.skip;

onlyForE2ETest("E2E Test", function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config = network.config as any;
  const selfChainId = String(config.chainId);

  if (!isE2ETest || !isChainId(selfChainId)) {
    return;
  }

  const selfNetwork = networkJsonFile[selfChainId];
  async function fixture() {
    const [signer] = await ethers.getSigners();
    return { signer };
  }

  Object.entries(networkJsonFile)
    .filter(([targetChainId]) => selfChainId !== targetChainId)
    .forEach(([, targetNetwork]) => {
      describe(`${selfNetwork.name} -> ${targetNetwork.name} `, function () {
        it("should work", async function () {
          const { signer } = await fixture();
          console.log(signer);
        });
      });
    });
});
