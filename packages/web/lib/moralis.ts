import Moralis from "moralis/node";
import { NFT } from "../types/nft";
import { Chain } from "../types/chain";

const serverUrl = process.env.MORALIS_SERVER_URL;
const appId = process.env.MORALIS_APP_ID;
const moralisSecret = process.env.MORALIS_SECRET;

export const initMorarils = async () => {
  if (!Moralis.isInitialized) {
    await Moralis.start({ serverUrl, appId, moralisSecret });
  }
};

export const getNFTs = async (userAddress: string, chain: Chain, nftAddress?: string): Promise<NFT[]> => {
  await initMorarils();
  const options = { address: userAddress, chain };
  let { result } = await Moralis.Web3API.account.getNFTs(options);
  if (!result) {
    return [];
  }
  if (nftAddress) {
    result = result.filter((nft) => nft.token_address.toLowerCase() == nftAddress.toLowerCase());
  }
  const nfts = result.map((nft) => {
    let metadata = {
      name: "",
      image: "",
    };
    if (nft.metadata) {
      const parsedMetadata = JSON.parse(nft.metadata);
      metadata.name = parsedMetadata.name || "";
      metadata.image = parsedMetadata.image || "";
    }
    return {
      nftContractAddress: nft.token_address,
      tokenId: nft.token_id,
      ...metadata,
    };
  });
  return nfts;
};
