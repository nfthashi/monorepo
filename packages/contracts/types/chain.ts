export type Chain = "goerli" | "polygonMumbai" | "optimisticGoerli";

export const isChain = (chain: string): chain is Chain => {
  return chain === "goerli" || chain === "polygonMumbai" || chain === "optimisticGoerli";
};
