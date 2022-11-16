import { useMemo } from "react";

import networkJsonFile from "../../../contracts/network.json";
import { ChainId } from "../../../contracts/types/ChainId";

export const useDeployements = (chainId?: ChainId) => {
  const addresses = useMemo(() => {
    if (!chainId) {
      return;
    }
    return networkJsonFile[chainId].deployments;
  }, [chainId]);
  return addresses;
};
