/* eslint-disable camelcase */
import { ethers } from "ethers";

import { getDestinationChainNFTAddress } from "../../../../contracts/lib/create2";
import networkJsonFile from "../../../../contracts/network.json";
import { ERC721Upgradeable__factory, Hashi721Bridge__factory } from "../../../../contracts/typechain-types";
import { ChainId } from "../../../../contracts/types/ChainId";

export const getHashi721BridgeContract = (
  address: string,
  signerOrProvider: ethers.Signer | ethers.providers.Provider
) => {
  return Hashi721Bridge__factory.connect(address, signerOrProvider);
};

export const getERC721Contract = (address: string, signerOrProvider: ethers.Signer | ethers.providers.Provider) => {
  return ERC721Upgradeable__factory.connect(address, signerOrProvider);
};

export const getDestinationChainWrappedNFTHashi721Address = (
  originalDomainId: number,
  originalAsset: string,
  destinationChainId: ChainId
) => {
  return getDestinationChainNFTAddress(
    networkJsonFile[destinationChainId].deployments.hashi721Bridge,
    networkJsonFile[destinationChainId].deployments.wrappedHashi721,
    originalDomainId,
    originalAsset
  );
};
