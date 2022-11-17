import { ChainId } from "../../../contracts/types/ChainId";

export interface NFT {
  chainId: ChainId;
  contractAddress: string;
  tokenId: string;
  metadata: {
    name?: string;
    image?: string;
  };
}
