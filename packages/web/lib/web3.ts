import { InjectedConnector } from "@web3-react/injected-connector";

import config from "../../contracts/networks.json";

export const supportedChainIds = Object.values(config).map(({ chainId }) => {
  return chainId;
});

export const injected = new InjectedConnector({
  supportedChainIds,
});
