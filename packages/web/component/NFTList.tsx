import { Box,Image, LinkBox, LinkOverlay, SimpleGrid, Text } from "@chakra-ui/react";

import { NFT } from "../types/nft";

export interface NFTListProps {
  nfts: NFT[];
  setNFTContractAddress: (nftContractAddress: string) => void;
  setTokenId: (tokenId: string) => void;
  setSelectedNFTImage: (selectedNFTImage: string) => void;
  setSelectedNFTName: (slectedNFTName: string) => void;
  onClose: () => void;
}

export const NFTList: React.FC<NFTListProps> = ({
  nfts,
  setNFTContractAddress,
  setTokenId,
  setSelectedNFTImage,
  setSelectedNFTName,
  onClose,
}) => {
  const handleNFTContractAddressChange = (index: number) => {
    const nft = nfts[index];
    setNFTContractAddress(nft.nftContractAddress);
    setTokenId(nft.tokenId);
    setSelectedNFTImage(nft.image);
    setSelectedNFTName(nft.name);
    onClose();
  };

  return (
    <SimpleGrid columns={2} gap={8}>
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
              <Box textAlign={"center"}>

              <Text fontSize="xs" noOfLines={1}>
                {name}
              </Text>
              <Text fontSize="xs">ID: {tokenId}</Text>
              </Box>
            </LinkOverlay>
          </LinkBox>
        );
      })}
    </SimpleGrid>
  );
};
