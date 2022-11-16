import { Box, BoxProps, Image, Text } from "@chakra-ui/react";
import React from "react";

import { truncate } from "@/lib/utils";
import { NFT as NFTType } from "@/types/NFT";

import configJsonFile from "../../../config.json";

export interface NFTProps extends BoxProps {
  nft: NFTType;
}

export const NFT: React.FC<NFTProps> = ({ nft, ...boxProps }) => {
  return (
    <Box position="relative" {...boxProps}>
      <Image
        shadow={configJsonFile.style.shadow}
        src={nft.metadata.image}
        alt="nft"
        rounded={configJsonFile.style.radius}
        fallbackSrc="/img/utils/placeholder.png"
        fit="cover"
      />
      <Box
        position="absolute"
        top="1"
        right="1"
        py="1"
        px="2"
        backgroundColor={configJsonFile.style.color.accent}
        rounded={configJsonFile.style.radius}
      >
        <Text fontSize="xx-small" color={configJsonFile.style.color.white.text.primary} textAlign={"right"}>
          {truncate(nft.contractAddress, 8, 8)}
        </Text>
        <Text fontSize="xx-small" color={configJsonFile.style.color.white.text.primary} textAlign={"right"}>
          #{truncate(nft.tokenId, 12)}
        </Text>
      </Box>
    </Box>
  );
};
