import { Alchemy, Network } from "alchemy-sdk";

import { NFT } from "@/types/NFT";

import { ChainId } from "../../../../contracts/types/ChainId";

export const getNetwork = (chainId: ChainId) => {
  if (chainId === "420") {
    return Network.OPT_GOERLI;
  } else {
    throw new Error("not implemented");
  }
};

export const getNFTsWithAlchemy = async (userAddress: string, chainId: ChainId): Promise<NFT[]> => {
  const network = getNetwork(chainId);
  const alchemy = new Alchemy({ apiKey: process.env.ALCHEMY_API_KEY, network });
  const { ownedNfts } = await alchemy.nft.getNftsForOwner(userAddress);
  return ownedNfts.map((nft) => {
    return {
      chainId,
      contractAddress: nft.contract.address,
      tokenId: nft.tokenId,
      metadata: {
        name: nft.rawMetadata?.name,
        image: nft.rawMetadata?.image,
      },
    };
  });
};
