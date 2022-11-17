/* eslint-disable camelcase */
import { ethers } from "ethers";

import { ERC721Upgradeable__factory, Hashi721Bridge__factory } from "../../../../contracts/typechain-types";

export const getHashi721BridgeContract = (
  address: string,
  signerOrProvider: ethers.Signer | ethers.providers.Provider
) => {
  return Hashi721Bridge__factory.connect(address, signerOrProvider);
};

export const getERC721Contract = (address: string, signerOrProvider: ethers.Signer | ethers.providers.Provider) => {
  return ERC721Upgradeable__factory.connect(address, signerOrProvider);
};
