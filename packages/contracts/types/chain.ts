export type Chain = "rinkeby" | "goerli" | "polygonMumbai" | "optimisticGoerli";

export const isChain = (chain: string): chain is Chain => {
  return chain === "rinkeby" || chain === "goerli" || chain === "polygonMumbai" || chain === "optimisticGoerli";
};
