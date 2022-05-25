import { NFT } from "../types/nft";
import { Grid, Image, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";

export interface NFTListProps {
  nfts: NFT[];
  setNFTContractAddress: (nftContractAddress: string) => void;
  setTokenId: (tokenId: string) => void;
  setSelectedNFTImage: (selectedNFTImage: string) => void;
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
    const nft = nfts[index];
    setNFTContractAddress(nft.nftContractAddress);
    setTokenId(nft.tokenId);
    setSelectedNFTImage(nft.image);
    onClose();
  };

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={8}>
      {nfts.map((nft, index) => {
        const { image, name, nftContractAddress, tokenId } = nft;
        return (
          <LinkBox key={index} cursor="pointer" width="40">
            <LinkOverlay onClick={() => handleNFTContractAddressChange(index)}>
              <Image
                src={image}
                alt={name}
                height="40"
                width="40"
                fallbackSrc="/assets/placeholder.png"
                fit="cover"
                mb="2"
              />
              <Text fontSize="xs" noOfLines={1}>
                {nftContractAddress}
              </Text>
              <Text fontSize="xs">ID: {tokenId}</Text>
            </LinkOverlay>
          </LinkBox>
        );
      })}
    </Grid>
  );
};
