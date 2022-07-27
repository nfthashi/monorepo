import { InjectedConnector } from "@web3-react/injected-connector";

import config from "../../contracts/networks.json";
import {Chain} from "../../contracts/types/chain"

export const supportedChainIds = Object.values(config).map(({ chainId }) => {
  return chainId;
});

export const injected = new InjectedConnector({});

export const getNetworkFromChainId = (chainId: number):Chain => {
  let chainName: Chain = ""
  if (chainId == 4) {
    chainName = "rinkeby";
  }
  if (chainId == 5) {
    chainName = "goerli";
  }
  return chainName;
};
