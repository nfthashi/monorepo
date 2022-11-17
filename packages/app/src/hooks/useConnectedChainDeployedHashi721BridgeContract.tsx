import { useMemo } from "react";
import { useSigner } from "wagmi";

import { getHashi721BridgeContract } from "@/lib/contracts";

import { useConnectedChainConfig } from "./useConnectedChainConfig";

export const useConnectedChainDeployedHashi721BridgeContract = () => {
  const { data: signer } = useSigner();
  const { connectedChainConfig } = useConnectedChainConfig();
  const connectedChainDeployedHashi721BridgeContract = useMemo(() => {
    if (!signer || !connectedChainConfig) {
      return;
    }
    return getHashi721BridgeContract(connectedChainConfig.deployments.hashi721Bridge, signer);
  }, [signer, connectedChainConfig]);
  return { connectedChainDeployedHashi721BridgeContract };
};
