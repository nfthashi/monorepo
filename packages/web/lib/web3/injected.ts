import { InjectedConnector } from "@web3-react/injected-connector";

export const injected = new InjectedConnector({
    supportedChainIds: [
    4,
    5, // goerli
    42, // kovan
  ],
});
