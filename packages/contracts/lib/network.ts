import { HttpNetworkUserConfig } from "hardhat/types";

import { TIMEOUT } from "../config";
import networkJsonFile from "../network.json";
import { isChainId } from "../types/ChainId";

export const getNetworksUserConfigs = (mnemonic: string, ignoredChainIds?: string[]) => {
  const networksUserConfigs: { [key: string]: HttpNetworkUserConfig } = {};
  Object.entries(networkJsonFile).forEach(([chainId, network]) => {
    if (ignoredChainIds && ignoredChainIds.includes(chainId)) {
      return;
    }
    const httpNetworkUserConfig = {
      chainId: Number(chainId),
      url: network.rpc,
      accounts: {
        mnemonic,
      },
      gasPrice: process.env.GAS_PRICE ? Number(process.env.GAS_PRICE) : ("auto" as const),
      timeout: TIMEOUT,
    };
    networksUserConfigs[network.key] = httpNetworkUserConfig;
  });
  return networksUserConfigs;
};

export const getChainIdByDomainId = (domainId: number) => {
  const network = Object.entries(networkJsonFile).find(([, v]) => v.domainId === domainId);
  if (!network) {
    throw new Error("network not found for the domain id");
  }
  const [chainId] = network;
  if (!isChainId(chainId)) {
    throw new Error("invalid original domain");
  }
  return chainId;
};
