export type Chain = "kovan" | "rinkeby" |"goerli";

export const isChain = (chain: string): chain is Chain => {
  return chain === "kovan" || chain === "rinkeby" || chain === "goerli";
};
