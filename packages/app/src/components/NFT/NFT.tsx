import { Box, HStack, Icon, Image, Text } from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

import { truncate } from "@/lib/utils";
import { NFT as NFTType } from "@/types/NFT";

import networkJsonFile from "../../../../contracts/network.json";
import configJsonFile from "../../../config.json";

export interface NFTProps {
  nft: NFTType;
  onClick?: MouseEventHandler<HTMLDivElement>;
  width?: number | string;
  height?: number | string;
}

export const NFT: React.FC<NFTProps> = ({ nft, onClick, width, height }) => {
  return (
    <Box cursor={onClick ? "pointer" : ""} position="relative" width={width} height={height}>
      <Image
        src={nft.metadata.image}
        fallbackSrc={"/assets/image-placeholder.png"}
        alt="nft"
        rounded={configJsonFile.style.radius}
        shadow={configJsonFile.style.shadow}
        fit="cover"
        width={width}
        height={height}
        onClick={onClick}
      />
      <Box position="absolute" bottom="1" left="1">
        <Image src={`/assets/chains/${networkJsonFile[nft.chainId].icon}`} w="4" h="4" alt="chain" />
      </Box>
      <Box
        position="absolute"
        top="1"
        right="1"
        py="1"
        px="2"
        backgroundColor={configJsonFile.style.color.black.text.secondary}
        rounded={configJsonFile.style.radius}
        shadow={configJsonFile.style.shadow}
      >
        <HStack
          cursor={"pointer"}
          onClick={() =>
            window.open(
              `${networkJsonFile[nft.chainId].explorer.nft.url}/${nft.contractAddress}/${nft.tokenId}`,
              "_blank"
            )
          }
        >
          <Box>
            <Text fontSize="xx-small" color={configJsonFile.style.color.white.text.secondary} textAlign={"right"}>
              {truncate(nft.contractAddress, 6, 6)}
            </Text>
            <Text fontSize="xx-small" color={configJsonFile.style.color.white.text.secondary} textAlign={"right"}>
              # {truncate(nft.tokenId, 8)}
            </Text>
          </Box>
          <Icon w={2} h={2} as={FaExternalLinkAlt} color={configJsonFile.style.color.white.text.secondary} />
        </HStack>
      </Box>
    </Box>
  );
};
