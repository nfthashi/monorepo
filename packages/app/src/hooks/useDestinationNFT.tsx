import { useEffect, useState } from "react";

import { getWrappedNFTHashi721Address } from "@/lib/contracts";
import { NFT } from "@/types/NFT";

import networkJsonFile from "../../../contracts/network.json";
import { ChainId, isChainId } from "../../../contracts/types/ChainId";
import { useConnectedChainConfig } from "./useConnectedChainConfig";
import { useConnectedChainDeployedHashi721BridgeContract } from "./useConnectedChainDeployedHashi721BridgeContract";
import { useConnectedChainId } from "./useConnectedChainId";

export const useDestinationNFT = (originNFT?: NFT, destinationChainId?: ChainId) => {
  const { connectedChainId } = useConnectedChainId();
  const { connectedChainConfig } = useConnectedChainConfig();
  const { connectedChainDeployedHashi721BridgeContract } = useConnectedChainDeployedHashi721BridgeContract();
  const [destinationNFT, SetDestinationNFT] = useState<NFT>();

  useEffect(() => {
    if (
      !originNFT ||
      !destinationChainId ||
      originNFT.chainId !== connectedChainId ||
      !connectedChainConfig ||
      !connectedChainDeployedHashi721BridgeContract
    ) {
      SetDestinationNFT(undefined);
      return;
    }
    connectedChainDeployedHashi721BridgeContract.originalAssets(originNFT.contractAddress).then((originalAsset) => {
      if (originalAsset === "0x0000000000000000000000000000000000000000") {
        originalAsset = originNFT.contractAddress;
        const originalDomainId = connectedChainConfig.domainId;
        const contractAddress = getWrappedNFTHashi721Address(destinationChainId, originalDomainId, originalAsset);
        SetDestinationNFT({ ...originNFT, chainId: destinationChainId, contractAddress });
      } else {
        connectedChainDeployedHashi721BridgeContract
          .originalDomainIds(originNFT.contractAddress)
          .then((originalDomainId) => {
            const originalDomainObjectEntry = Object.entries(networkJsonFile).find(
              ([, { domainId }]) => originalDomainId === domainId
            );
            if (!originalDomainObjectEntry) {
              throw new Error("invalid original domain");
            }
            const [originalDomainChainId] = originalDomainObjectEntry;
            if (!isChainId(originalDomainChainId)) {
              throw new Error("invalid original domain");
            }
            if (destinationChainId === originalDomainChainId) {
              SetDestinationNFT({ ...originNFT, chainId: destinationChainId, contractAddress: originalAsset });
            } else {
              const contractAddress = getWrappedNFTHashi721Address(destinationChainId, originalDomainId, originalAsset);
              SetDestinationNFT({ ...originNFT, chainId: destinationChainId, contractAddress });
            }
          });
      }
    });
  }, [
    originNFT,
    destinationChainId,
    connectedChainId,
    connectedChainConfig,
    connectedChainDeployedHashi721BridgeContract,
  ]);

  return { destinationNFT };
};
