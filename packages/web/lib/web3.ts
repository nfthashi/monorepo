import { InjectedConnector } from "@web3-react/injected-connector";

import config from "../../contracts/networks.json";

export const supportedChainIds = Object.values(config).map(({ chainId }) => {
  return chainId;
});

export const injected = new InjectedConnector({});

export const getNetworkFromChainId = (chainId: number) => {
  let chainName = "";
  if (chainId == 4) {
    chainName = "rinkeby";
  }
  if (chainId == 5) {
    chainName = "goerli";
  }
  if (chainId == 42) {
    chainName = "kovan";
  }
  return chainName;
};
