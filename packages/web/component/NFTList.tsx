import { NFT } from "../types/nft";
import { Box, Grid, GridItem, Image, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";

export interface NFTListProps {
  nfts: NFT[];
  setNFTContractAddress: (arg: string) => void;
  setTokenId: (arg: string) => void;
  setSelectedNFTImage: (arg: string) => void;
  onClose: () => void;
}

export const NFTList: React.FC<NFTListProps> = ({
  nfts,
  setNFTContractAddress,
  setTokenId,
  setSelectedNFTImage,
  onClose,
}) => {
  const handleNFTContractAddressChange = (index: number) => {
    setNFTContractAddress(nfts[index].tokenAddress);
    setTokenId(nfts[index].tokenId);
    setSelectedNFTImage(nfts[index].image);
    onClose();
  };

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={2}>
      {nfts.map((nft, index) => {
        const { image, name, tokenAddress, tokenId } = nft;
        return (
          <LinkBox key={index} width="40">
            <LinkOverlay onClick={() => handleNFTContractAddressChange(index)}>
              <Image src={image} alt={name} width="40" />
              <Text>{name}</Text>
              <Text fontSize="xs" noOfLines={1}>
                {tokenAddress}
              </Text>
              <Text>{tokenId}</Text>
            </LinkOverlay>
          </LinkBox>
        );
      })}
    </Grid>
  );
};
