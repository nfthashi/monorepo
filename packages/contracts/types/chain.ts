export type Chain = "rinkeby" | "goerli" |"";

export const isChain = (chain: string): chain is Chain => {
  return chain === "rinkeby" || chain === "goerli";
};
