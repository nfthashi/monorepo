import { expect } from "chai";
import { ethers, network } from "hardhat";

import networkJsonFile from "../network.json";
import { isChainId } from "../types/ChainId";
import { ADDRESS_1, ADDRESS_2 } from "./helper/constant";

const isIntegrationTest = process.env.IS_INTEGRATION_TEST === "true";

const onlyForIntegrationTest = isIntegrationTest ? describe.only : describe.skip;

onlyForIntegrationTest("Integration Test", function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config = network.config as any;
  const selfChainId = String(config.chainId);
  if (!isIntegrationTest || !isChainId(selfChainId) || !config.forking.enabled) {
    return;
  }

  const selfNetwork = networkJsonFile[selfChainId];
  async function fixture() {
    const [signer, owner, holder] = await ethers.getSigners();
    const WrappedHashi721 = await ethers.getContractFactory("WrappedHashi721");
    const Hashi721Bridge = await ethers.getContractFactory("Hashi721Bridge");
    return { signer, owner, holder, WrappedHashi721, Hashi721Bridge };
  }

  Object.entries(networkJsonFile)
    .filter(([targetChainId]) => selfChainId !== targetChainId)
    .forEach(([, targetNetwork]) => {
      describe(`${selfNetwork.name} -> ${targetNetwork.name} `, function () {
        it("should work", async function () {
          const { owner, holder, WrappedHashi721, Hashi721Bridge } = await fixture();
          const wrappedHashi721 = await WrappedHashi721.deploy();
          await wrappedHashi721.connect(owner).initialize();
          const connext = selfNetwork.deployments.connext;
          const hashi721Bridge = await Hashi721Bridge.deploy();
          await hashi721Bridge.connect(owner).initialize(connext, wrappedHashi721.address);
          const mintedTokenId = 1;
          const tokenURI = "";
          await wrappedHashi721.connect(owner).mint(holder.address, mintedTokenId, tokenURI);
          await wrappedHashi721.connect(holder).setApprovalForAll(hashi721Bridge.address, true);
          const destination = targetNetwork.domainId;
          const relayerFee = 0;
          const slippage = 0;
          const asset = wrappedHashi721.address;
          const to = ADDRESS_2;
          const tokenId = mintedTokenId;
          const isTokenURIIgnored = true;
          const bridge = ADDRESS_1;
          await hashi721Bridge.connect(owner).setBridge(destination, bridge);
          await expect(
            hashi721Bridge
              .connect(holder)
              .xCall(destination, relayerFee, slippage, asset, to, tokenId, isTokenURIIgnored)
          )
            .to.emit(wrappedHashi721, "Transfer")
            .withArgs(holder.address, hashi721Bridge.address, tokenId);
        });
      });
    });
});
