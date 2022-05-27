export type Chain = "kovan" | "rinkeby";

export const isChain = (chain: string): chain is Chain => {
  return chain === "kovan" || chain === "rinkeby";
};
