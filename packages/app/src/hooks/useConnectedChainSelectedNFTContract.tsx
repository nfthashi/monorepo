import { useMemo } from "react";
import { useSigner } from "wagmi";

import { getERC721Contract } from "@/lib/contracts";

export const useConnectedChainSelectedNFTContract = (address?: string) => {
  const { data: signer } = useSigner();
  const connectedChainSelectedNFTContract = useMemo(() => {
    if (!signer || !address) {
      return;
    }
    return getERC721Contract(address, signer);
  }, [signer, address]);
  return { connectedChainSelectedNFTContract };
};
