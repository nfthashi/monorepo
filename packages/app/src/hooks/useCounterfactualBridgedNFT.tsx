import { useEffect, useState } from "react";

import { getDestinationChainWrappedNFTHashi721Address } from "@/lib/contracts";
import { NFT } from "@/types/NFT";

import { getChainIdByDomainId } from "../../../contracts/lib/network";
import { ChainId } from "../../../contracts/types/ChainId";
import { useSelectedChain } from "./useSelectedChain";

export const useCounterfactualBridgedNFT = (originChainId?: ChainId, destinationChainId?: ChainId, originNFT?: NFT) => {
  const { config, deployedHashi721BridgeContract } = useSelectedChain(originChainId);
  const [counterfactualBridgedNFT, SetCounterfactualBridgedNFT] = useState<NFT>();

  useEffect(() => {
    if (
      !originChainId ||
      !destinationChainId ||
      !originNFT ||
      originNFT.chainId !== originChainId ||
      !config ||
      !deployedHashi721BridgeContract
    ) {
      SetCounterfactualBridgedNFT(undefined);
      return;
    }

    const setCounterfactualBridgedNFTByOriginalAssetInfo = (originalDomainId: number, originalAsset: string) => {
      const destinationChainWrappedNFTHashi721Address = getDestinationChainWrappedNFTHashi721Address(
        originalDomainId,
        originalAsset,
        destinationChainId
      );
      SetCounterfactualBridgedNFT({
        ...originNFT,
        chainId: destinationChainId,
        contractAddress: destinationChainWrappedNFTHashi721Address,
      });
    };

    deployedHashi721BridgeContract.originalAssets(originNFT.contractAddress).then((originalAsset) => {
      if (originalAsset === "0x0000000000000000000000000000000000000000") {
        setCounterfactualBridgedNFTByOriginalAssetInfo(config.domainId, originNFT.contractAddress);
      } else {
        deployedHashi721BridgeContract.originalDomainIds(originNFT.contractAddress).then((originalDomainId) => {
          const originalDomainChainId = getChainIdByDomainId(originalDomainId);
          if (destinationChainId === originalDomainChainId) {
            SetCounterfactualBridgedNFT({ ...originNFT, chainId: destinationChainId, contractAddress: originalAsset });
          } else {
            setCounterfactualBridgedNFTByOriginalAssetInfo(originalDomainId, originalAsset);
          }
        });
      }
    });
  }, [originChainId, destinationChainId, originNFT, config, deployedHashi721BridgeContract]);

  return { counterfactualBridgedNFT };
};
