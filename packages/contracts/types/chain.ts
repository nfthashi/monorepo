export type Chain = "goerli" | "mumbai" | "optimisticGoerli";

export const isChain = (chain: string): chain is Chain => {
  return chain === "goerli" || chain === "mumbai" || chain === "optimisticGoerli";
};
