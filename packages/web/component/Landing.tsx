import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Image,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { BsPlayCircleFill } from "react-icons/bs";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";

export const Landing: React.FC = () => {
  const communities = [
    { icon: FaDiscord, link: "https://discord.gg/TnQX6ZjN4Z" },
    { icon: FaTwitter, link: "https://twitter.com/nfthashi" },
  ];

  return (
    <Box maxW={"6xl"} px="4">
      <Stack
        align={"center"}
        spacing={{ base: 8, md: 16 }}
        py={{ base: 8, md: 16 }}
        direction={{ base: "column", md: "row" }}
      >
        <Stack flex={1} spacing={{ base: 8, md: 16 }}>
          <Heading lineHeight={1.1} fontWeight={600}>
            <Text
              as={"span"}
              position={"relative"}
              fontSize={{ base: "4xl", md: "6xl" }}
              _after={{
                content: "''",
                width: "full",
                height: "30%",
                position: "absolute",
                bottom: 1,
                left: 0,
                bg: "teal.400",
                zIndex: -1,
              }}
            >
              NFTHashi
            </Text>
            <br />
            <Text fontSize={{ base: "3xl", md: "5xl" }}>
              <Text as={"span"} color={"teal.400"}>
                Trust minimized{" "}
              </Text>
              cross-chain NFT bridge
            </Text>
          </Heading>
          <HStack spacing={{ base: 4, md: 6 }}>
            <Button
              as="a"
              href="/bridge"
              rounded={"full"}
              size={"lg"}
              fontWeight={"normal"}
              px={6}
              colorScheme={"teal"}
              bg={"teal.400"}
              leftIcon={<Icon as={BsPlayCircleFill} color={"gray.300"} />}
            >
              Get started
            </Button>
            <Button
              as="a"
              href="https://docs.nfthashi.com/"
              rounded={"full"}
              size={"lg"}
              fontWeight={"normal"}
              px={6}
              leftIcon={<Icon as={IoDocumentText} color={"gray.300"} />}
            >
              Docs
            </Button>
          </HStack>
        </Stack>
        <Flex flex={1} justify={"center"} align={"center"} position={"relative"} w={"full"}>
          <Box
            position={"relative"}
            height={{ base: "240px", md: "400px" }}
            rounded={"2xl"}
            boxShadow={"2xl"}
            width={"full"}
            overflow={"hidden"}
          >
            <Image
              alt={"Hero Image"}
              fit={"cover"}
              align={"center"}
              w={"100%"}
              h={"100%"}
              src="assets/NFTHashi.png"
            ></Image>
          </Box>
        </Flex>
      </Stack>
      <Stack spacing={4} as={Container} maxW={"3xl"} textAlign={"center"} align={"center"} mb="24">
        <Heading fontSize={"2xl"} my="2">
          Powered By
        </Heading>
        <HStack spacing={4}>
          <Image
            w={36}
            textAlign={"center"}
            src={useColorModeValue("assets/connext_black.png", "assets/connext_white.png")}
            alt={"Connext logo"}
          />
          <Image
            w={36}
            textAlign={"center"}
            src={useColorModeValue("assets/nomad_black.svg", "assets/nomad_white.svg")}
            alt={"Nomad logo"}
          />
        </HStack>
      </Stack>
      <Stack spacing={4} as={Container} maxW={"3xl"} textAlign={"center"} align={"center"} my="16">
        <Heading fontSize={"2xl"} mb="8">
          Join Our Community
        </Heading>
        <Grid
          templateColumns={{
            base: "repeat(2, 1fr)",
            sm: "repeat(2, 1fr)",
          }}
          gap={"12"}
        >
          {communities.map((community, i) => {
            return (
              <GridItem key={i} mx="auto">
                <Link href={community.link} isExternal>
                  <Icon as={community.icon} w={8} h={8} my="auto" />
                </Link>
              </GridItem>
            );
          })}
        </Grid>
      </Stack>
    </Box>
  );
};
