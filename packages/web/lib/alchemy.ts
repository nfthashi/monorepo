import { Alchemy, Network } from "alchemy-sdk";

import { Chain } from "../../contracts/types/chain";
import { NFT } from "../types/nft";

export const getNFTsFromAlchemy = async (userAddress: string, chain: Chain): Promise<NFT[]> => {
  const apiKey = process.env.ALCHEMY_API_KEY || "";
  let network;
  if (chain == "polygonMumbai") {
    network = Network.MATIC_MUMBAI;
  } else if (chain == "optimisticGoerli") {
    network = Network.OPT_GOERLI;
  }
  const settings = {
    apiKey,
    network,
  };

  const alchemy = new Alchemy(settings);
  console.log("fetching NFTs for address:", userAddress);
  const nftsForOwner = await alchemy.nft.getNftsForOwner(userAddress);

  const nfts = nftsForOwner.ownedNfts.map((nft) => {
    const metadata = {
      name: "",
      image: "",
    };
    if (nft.rawMetadata) {
      metadata.name = nft.rawMetadata.name || "";
      metadata.image = nft.rawMetadata.image || "";
    }
    return {
      nftContractAddress: nft.contract.address,
      tokenId: nft.tokenId,
      ...metadata,
    };
  });

  return nfts;
};
