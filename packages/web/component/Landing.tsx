import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Button, Heading, Icon, Image, SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { FaDiscord, FaTwitter } from "react-icons/fa";

export const Landing: React.FC = () => {
  const Teams = [
    { image: "assets/logo.png", link: "", name: "NFTHashi" },
    { image: "assets/connext__Logo.png", link: "", name: "connext" },
  ];
  const supportedChains = [
    { image: "assets/connext__Logo.png", link: "" },
    { image: "assets/connext__Logo.png", link: "" },
    { image: "assets/connext__Logo.png", link: "" },
    { image: "assets/connext__Logo.png", link: "" },
  ];
  const communities = [
    { icon: FaDiscord, link: "" },
    { icon: FaTwitter, link: "" },
  ];

  return (
    <Box textAlign={"center"} mb="8">
      <Heading fontSize={{ base: "3xl", md: "7xl" }} textColor={"teal.200"} my="4">
        NFTHashi
      </Heading>
      <Text fontWeight={"semibold"} fontSize="lg">
        Trust minimized cross-chain NFT Bridge
      </Text>
      <Button mt="4" w="full" size="lg" colorScheme={"teal"} rounded="2xl">
        Develop with NFTHashi <ArrowForwardIcon />
      </Button>
      <Box
        my="8"
        as="iframe"
        width={{ base: "full", md: "xl" }}
        minHeight="sm"
        mx="auto"
        src="https://codesandbox.io/embed/react-new?fontsize=14&hidenavigation=1&theme=dark&view=editor"
      ></Box>
      <Text fontWeight={"semibold"} my="4">
        You can develop an NFT project that natively supports cross-chain bridge using NFTHashi. It is supported by
        Connext technology. Very Simple to implement, trust minimized, and many usecases.
      </Text>
      <Button mt="2" w="full" size="lg" rounded="2xl">
        Develop with NFTHashi <ArrowForwardIcon />
      </Button>
      <Button mt="2" w="full" size="lg" colorScheme={"teal"} rounded="2xl">
        Try Demo Bridge
        <ArrowForwardIcon />
      </Button>
      <Heading mt="10" mb="4">
        Team
      </Heading>
      <SimpleGrid columns={2} spacing="1" w="sm" mx="auto">
        {Teams.map((team, i) => {
          return (
            <Box
              padding="2"
              // eslint-disable-next-line react-hooks/rules-of-hooks
              bgColor={useColorModeValue("gray.200", "gray.700")}
              w="40"
              h="24"
              rounded="2xl"
              display={"flex"}
              justifyContent="center"
              key={i}
              mx="auto"
            >
              <Image my="auto" src={team.image} alt={team.name}></Image>
            </Box>
          );
        })}
      </SimpleGrid>
      <Heading mt="10" mb="4">
        Supported Chains
      </Heading>
      <SimpleGrid columns={3} spacing="4">
        {supportedChains.map((chain, i) => {
          return (
            <Box
              padding="2"
              rounded="2xl"
              // eslint-disable-next-line react-hooks/rules-of-hooks
              bgColor={useColorModeValue("gray.200", "gray.700")}
              w="40"
              h="24"
              display={"flex"}
              justifyContent="center"
              key={i}
            >
              <Image my="auto" src={chain.image} alt={chain.link}></Image>
            </Box>
          );
        })}
      </SimpleGrid>
      <Heading mt="10" mb="4">
        Projects
      </Heading>
      <Text>Coming soon ...</Text>
      <Heading mt="10" mb="4">
        Join Our Community
      </Heading>
      <SimpleGrid columns={2} spacing="1" w={"sm"} mx="auto">
        {communities.map((community, i) => {
          return (
            <Box
              padding="2"
              // eslint-disable-next-line react-hooks/rules-of-hooks
              bgColor={useColorModeValue("gray.200", "gray.700")}
              w="40"
              h="24"
              rounded="2xl"
              display={"flex"}
              justifyContent="center"
              key={i}
              mx="auto"
            >
              <Icon as={community.icon} w={8} h={8} my="auto" />
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};
