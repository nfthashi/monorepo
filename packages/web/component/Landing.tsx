import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Button, chakra, Heading, Icon, Image, Link, SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { FaDiscord, FaTwitter } from "react-icons/fa";

export const Landing: React.FC = () => {
  const communities = [
    { icon: FaDiscord, link: "https://discord.com/channels/454734546869551114/982204460266823682" },
    { icon: FaTwitter, link: "https://twitter.com/nfthashi" },
  ];
  return (
    <Box textAlign={"center"}>
      <Heading fontSize={{ base: "3xl", md: "7xl" }} textColor={useColorModeValue("teal.400", "teal.200")} my="4">
        NFTHashi
      </Heading>
      <Text fontWeight={"semibold"} fontSize={{ base: "md", md: "lg" }}>
        <chakra.span color={useColorModeValue("pink.500", "pink.300")} fontWeight={"extrabold"}>
          Trust minimized
        </chakra.span>{" "}
        cross-chain NFT Bridge
      </Text>
      <Box mx="4">
        <Image
          maxW={{ base: "xs", md: "md" }}
          mx="auto"
          src="assets/NFTHashi.png"
          rounded="2xl"
          my="8"
          border="2px"
          shadow={"md"}
        ></Image>
      </Box>
      <Link href="/bridge">
        <Button mt="4" w={{ base: "xs", md: "full" }} size="lg" colorScheme={"teal"} rounded="2xl">
          Bridge Your NFT
          <ArrowForwardIcon />
        </Button>
      </Link>
      <Link href="https://docs.nfthashi.com/operation-guide/how-to-use-sdk">
        <Button mt="2" w={{ base: "xs", md: "full" }} size="lg" rounded="2xl">
          Docs <ArrowForwardIcon />
        </Button>
      </Link>
      <Heading mt="12">Powerd By</Heading>
      <Image
        mx="auto"
        w="3xs"
        src={useColorModeValue("assets/connext_black.png", "assets/connext_white.png")}
        alt={"Connext logo"}
      ></Image>
      <Heading mt="8" mb="4">
        Join Our Community
      </Heading>
      <SimpleGrid columns={2} w={"sm"} mx="auto" mb="8">
        {communities.map((community, i) => {
          return (
            <Link key={i} href={community.link} isExternal>
              <Box
                // eslint-disable-next-line react-hooks/rules-of-hooks
                bgColor={useColorModeValue("gray.200", "gray.700")}
                w={{ base: "32", md: "36" }}
                h={{ base: "20", md: "24" }}
                rounded="2xl"
                display={"flex"}
                justifyContent="center"
                mx="auto"
              >
                <Icon as={community.icon} w={8} h={8} my="auto" />
              </Box>
            </Link>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};
