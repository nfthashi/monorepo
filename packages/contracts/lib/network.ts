import { HttpNetworkUserConfig } from "hardhat/types";

import networkJsonFile from "../network.json";

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
    };
    networksUserConfigs[network.key] = httpNetworkUserConfig;
  });
  return networksUserConfigs;
};
