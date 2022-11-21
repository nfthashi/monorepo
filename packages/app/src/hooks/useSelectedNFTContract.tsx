import { useMemo } from "react";
import { useSigner } from "wagmi";

import { getERC721Contract } from "@/lib/contracts";

export const useSelectedNFTContract = (address?: string) => {
  const { data: signer } = useSigner();
  const selectedNFTContract = useMemo(() => {
    if (!signer || !address) {
      return;
    }
    return getERC721Contract(address, signer);
  }, [signer, address]);
  return { selectedNFTContract };
};
