import Moralis from "moralis";

import { NFT } from "@/types/NFT";

import { ChainId } from "../../../../contracts/types/ChainId";

export const getChain = (chainId: ChainId) => {
  if (chainId !== "5" && chainId !== "80001") {
    throw new Error("not implemented");
  }
  return chainId;
};

export const getNFTsWithMoralis = async (userAddress: string, chainId: ChainId): Promise<NFT[]> => {
  await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
  const chain = getChain(chainId);
  const { result } = await Moralis.EvmApi.nft.getWalletNFTs({ address: userAddress, chain });
  return result.map((nft) => {
    const data = nft.toJSON();
    return {
      contractAddress: data.tokenAddress,
      tokenId: String(data.tokenId),
      metadata: {
        name: data.metadata?.name ? String(data.metadata.name) : undefined,
        image: data.metadata?.image ? String(data.metadata.image) : undefined,
      },
    };
  });
};
