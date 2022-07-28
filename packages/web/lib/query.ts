import { clients } from "./client";
import GET_TRANSFERS_ID from "./subgraph";

export const CustomizedQuery = async (chainId: number, hash: string) => {
  let data;
  if (chainId == 4) {
    data = await clients.rinkeby.query({
      query: GET_TRANSFERS_ID(hash),
    });
  }
  if (chainId == 5) {
    data = await clients.goerli.query({
      query: GET_TRANSFERS_ID(hash),
    });
  }
  if (chainId == 42) {
    data = await clients.kovan.query({
      query: GET_TRANSFERS_ID(hash),
    });
  }
  return data;
};
