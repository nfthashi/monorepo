import { task } from "hardhat/config";

import networks from "../../networks.json";
import { isChain } from "../../types/chain";

task("experimental-deploy-x-nft-trader", "experimental deploy cross nft trader").setAction(
  async (_, { ethers, network, run }) => {
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

    const MockMarket = await ethers.getContractFactory("MockMarket");
    const mockMarket = await MockMarket.deploy();

    const XNFTTrader = await ethers.getContractFactory("XNFTTrader");
    const xNFTTrader = await XNFTTrader.deploy(bridge, mockMarket.address);

    console.log("Deployed Bridge", bridge);
    console.log("Deployed MockMarket", mockMarket.address);
    console.log("Deployed XNFTTrader", xNFTTrader.address);
  }
);
