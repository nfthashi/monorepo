import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  chakra,
  Heading,
  Icon,
  Image,
  Link,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";

export const Landing: React.FC = () => {
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
        bgColor={"gray.900"}
        my="8"
        rounded="lg"
        textAlign={"left"}
        p="4"
        fontSize={"xs"}
        textColor="white"
        overflowY={"scroll"}
        height="md"
      >
        <Text>
          <chakra.span color="gray.500">
            {"/"}
            {"/"} SPDX-License-Identifier: UNLICENSED
          </chakra.span>
        </Text>
        <Text>
          <chakra.span color="purple.300">pragma</chakra.span> <chakra.span color="red">solidity</chakra.span>{" "}
          <chakra.span color="orange">^0.8.0</chakra.span>;
        </Text>
        <Text mt="4">
          <chakra.span color="purple.300">import</chakra.span> &quot;../NFTNativeBridge.sol&quot;;
        </Text>

        <Text mt="4">
          <chakra.span color="purple.300">contract</chakra.span> <chakra.span color="yellow.400">NativeNFT</chakra.span>{" "}
          <chakra.span color="purple.300">is</chakra.span> NFTNativeBridge {"{"}
        </Text>
        <Text ml="8">
          <chakra.span color="yellow.400">uint256</chakra.span> <chakra.span color="purple.300">private</chakra.span>{" "}
          immutable _startTokenId;
        </Text>
        <Text ml="8">
          <chakra.span color="yellow.400">uint256</chakra.span> <chakra.span color="purple.300">private</chakra.span>{" "}
          immutable _endTokenId;
        </Text>
        <Text ml="8">
          <chakra.span color="yellow.400">uint256</chakra.span> <chakra.span color="purple.300">private</chakra.span>{" "}
          _supplied;
        </Text>

        <Text ml="8" mt="4">
          <chakra.span color="yellow.400">string</chakra.span> <chakra.span color="purple.300">private</chakra.span>{" "}
          _baseTokenURI;
        </Text>

        <Text ml="8" mt="4">
          <chakra.span color="purple.300">constructor</chakra.span>(
        </Text>
        <Text ml="16">
          <chakra.span color="yellow.400">uint32</chakra.span> selfDomain,
        </Text>
        <Text ml="16">
          <chakra.span color="yellow.400">address</chakra.span> connext,
        </Text>
        <Text ml="16">
          <chakra.span color="yellow.400">address</chakra.span> dummyTransactingAssetId,
        </Text>
        <Text ml="16">
          <chakra.span color="yellow.400">uint256</chakra.span> startTokenId,
        </Text>
        <Text ml="16">
          <chakra.span color="yellow.400">uint256</chakra.span> endTokenId,
        </Text>
        <Text ml="16">
          <chakra.span color="yellow.400">string</chakra.span> <chakra.span color="purple.300">memory</chakra.span>{" "}
          name,
        </Text>
        <Text ml="16">
          <chakra.span color="yellow.400">string</chakra.span> <chakra.span color="purple.300">memory</chakra.span>{" "}
          symbol,
        </Text>
        <Text ml="16">
          <chakra.span color="yellow.400">string</chakra.span> <chakra.span color="purple.300">memory</chakra.span>{" "}
          baseTokenURI
        </Text>
        <Text ml="8">
          ) NFTNativeBridge(selfDomain, connext, dummyTransactingAssetId){" "}
          <chakra.span color="orange">ERC721</chakra.span> (name, symbol) {"{"}
        </Text>
        <Text ml="16"> _startTokenId = startTokenId;</Text>
        <Text ml="16"> _endTokenId = endTokenId;</Text>
        <Text ml="16"> _baseTokenURI = baseTokenURI;</Text>
        <Text ml="8">{"}"}</Text>
        <Text>{"}"}</Text>
      </Box>
      <Text fontWeight={"semibold"} my="8">
        Easily create native xchain NFTs or upgrade your existing ones so they seamlessly move across any chain. Very
        Simple to implement, trust minimized, and many usecases.Supported by Connext technology.
      </Text>
      <Button mt="2" w="full" size="lg" rounded="2xl">
        Develop with NFTHashi <ArrowForwardIcon />
      </Button>
      <Link href="/bridge">
        <Button mt="2" w="full" size="lg" colorScheme={"teal"} rounded="2xl">
          Try Demo Bridge
          <ArrowForwardIcon />
        </Button>
      </Link>
      <Heading mt="12" mb="2">
        Secured By
      </Heading>
      <Image
        mx="auto"
        w="3xs"
        src={useColorModeValue("assets/connext.png", "assets/connext__Logo.png")}
        alt={"Connext logo"}
      ></Image>

      <Heading mt="12" mb="4">
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
      <Heading mt="12" mb="4">
        Use cases
      </Heading>
      <List spacing={3} textAlign="left">
        <ListItem>
          <ListIcon as={MdCheckCircle} color="green.500" />
          Bring a Punk xchain and fractionalize it
        </ListItem>
        <ListItem>
          <ListIcon as={MdCheckCircle} color="green.500" />
          Bring a Uniswap V3 LP to another chain to use it as a collateral for a lending protocol
        </ListItem>
        <ListItem>
          <ListIcon as={MdCheckCircle} color="green.500" />
          Create a xchain NFT marketplace
        </ListItem>
      </List>
      <Heading mt="12" mb="4">
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
