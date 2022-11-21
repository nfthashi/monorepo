import { useMemo } from "react";
import { useSigner } from "wagmi";

import { getHashi721BridgeContract } from "@/lib/contracts";

import networkJsonFile from "../../../contracts/network.json";
import { ChainId } from "../../../contracts/types/ChainId";

export const useSelectedChain = (chainId?: ChainId) => {
  const { data: signer } = useSigner();

  const config = useMemo(() => {
    if (!chainId) {
      return;
    }
    return networkJsonFile[chainId];
  }, [chainId]);

  const deployedHashi721BridgeContract = useMemo(() => {
    if (!signer || !config) {
      return;
    }
    return getHashi721BridgeContract(config.deployments.hashi721Bridge, signer);
  }, [signer, config]);

  return { config, deployedHashi721BridgeContract };
};
