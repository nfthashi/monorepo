export interface NFT {
  contractAddress: string;
  tokenId: string;
  metadata: {
    name?: string;
    image?: string;
  };
}
