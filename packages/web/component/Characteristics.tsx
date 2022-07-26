import { Box, Divider, Flex, Heading, Icon, SimpleGrid, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import { ReactElement } from "react";
import { FcMindMap, FcNoIdea, FcUnlock } from "react-icons/fc";

interface FeatureProps {
  title: string;
  text: string;
  icon: ReactElement;
}

const Feature = ({ title, text, icon }: FeatureProps) => {
  return (
    <Stack>
      <Flex w={16} h={16} align={"center"} justify={"center"} color={"white"} rounded={"full"} bg={"gray.100"} mb={1}>
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={"gray.600"}>{text}</Text>
    </Stack>
  );
};

export const Characteristics: React.FC = () => {
  return (
    <Box p={4}>
      <Heading size={useBreakpointValue({ base: "md", md: "lg" })} textAlign="center" py={{ base: 8, md: 16 }}>
        Why NFTHashi?
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        <Feature
          icon={<Icon as={FcUnlock} w={10} h={10} />}
          title={"Trust-minimized"}
          text={
            "We use Connext, and Connext provides trust-minimized cross-chain messaging using optimistic verification provided by Nomad, the most trust-minimized protocol for cross-chain messaging so you can safely bridge your valuable NFTs!"
          }
        />
        <Feature
          icon={<Icon as={FcMindMap} w={10} h={10} />}
          title={"Versatile"}
          text={
            "NFTs that have already been issued can be bridged to other chains. That means your Punks or BAYC can go beyond Ethereum and can be used on any chain you like"
          }
        />
        <Feature
          icon={<Icon as={FcNoIdea} w={10} h={10} />}
          title={"Simple"}
          text={
            "Easily bridge your NFTs with our intuitive portal. For creators, it is easy to create NFTs that are natively cross-chain by adding the NFTHashi SDK into the NFT contract."
          }
        />
      </SimpleGrid>
      <Divider mb={12} />
    </Box>
  );
};
