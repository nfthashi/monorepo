/* eslint-disable camelcase */
import { ethers } from "ethers";

import { getMinimulProxyCreationCodeHash } from "../../../../contracts/lib/create2";
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

export const getWrappedNFTHashi721Address = (chainId: ChainId, originalDomainId: number, originalAsset: string) => {
  const from = networkJsonFile[chainId].deployments.hashi721Bridge;
  const salt = ethers.utils.solidityKeccak256(["uint32", "address"], [originalDomainId, originalAsset]);
  const creationCodeHash = getMinimulProxyCreationCodeHash(networkJsonFile[chainId].deployments.wrappedHashi721);
  return ethers.utils.getCreate2Address(from, salt, creationCodeHash);
};
