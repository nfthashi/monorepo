import {
  Box,
  Button,
  Container,
  createIcon,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Image,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { FaDiscord, FaTwitter } from "react-icons/fa";

export const Landing: React.FC = () => {
  const communities = [
    { icon: FaDiscord, link: "https://discord.com/channels/454734546869551114/982204460266823682" },
    { icon: FaTwitter, link: "https://twitter.com/nfthashi" },
  ];
  const PlayIcon = createIcon({
    displayName: "PlayIcon",
    viewBox: "0 0 58 58",
    d: "M28.9999 0.562988C13.3196 0.562988 0.562378 13.3202 0.562378 29.0005C0.562378 44.6808 13.3196 57.438 28.9999 57.438C44.6801 57.438 57.4374 44.6808 57.4374 29.0005C57.4374 13.3202 44.6801 0.562988 28.9999 0.562988ZM39.2223 30.272L23.5749 39.7247C23.3506 39.8591 23.0946 39.9314 22.8332 39.9342C22.5717 39.9369 22.3142 39.8701 22.0871 39.7406C21.86 39.611 21.6715 39.4234 21.5408 39.1969C21.4102 38.9705 21.3421 38.7133 21.3436 38.4519V19.5491C21.3421 19.2877 21.4102 19.0305 21.5408 18.8041C21.6715 18.5776 21.86 18.3899 22.0871 18.2604C22.3142 18.1308 22.5717 18.064 22.8332 18.0668C23.0946 18.0696 23.3506 18.1419 23.5749 18.2763L39.2223 27.729C39.4404 27.8619 39.6207 28.0486 39.7458 28.2713C39.8709 28.494 39.9366 28.7451 39.9366 29.0005C39.9366 29.2559 39.8709 29.507 39.7458 29.7297C39.6207 29.9523 39.4404 30.1391 39.2223 30.272Z",
  });

  return (
    <Container maxW={"7xl"}>
      <Stack
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
        direction={{ base: "column", md: "row" }}
      >
        <Stack flex={1} spacing={{ base: 5, md: 10 }}>
          <Heading lineHeight={1.1} fontWeight={600} fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}>
            <Text
              as={"span"}
              position={"relative"}
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
            <Text as={"span"}>
              <Text as={"span"} color={"teal.400"}>
                Trust minimized
              </Text>{" "}
              cross-chain bridge
            </Text>
          </Heading>
          <Stack spacing={{ base: 4, sm: 6 }} direction={{ base: "column", sm: "row" }}>
            <Link href="/bridge">
              <Button
                rounded={"full"}
                size={"lg"}
                fontWeight={"normal"}
                px={6}
                colorScheme={"teal"}
                bg={"teal.400"}
                leftIcon={<PlayIcon h={4} w={4} color={"gray.300"} />}
                _hover={{ bg: "teal.500" }}
              >
                Get started
              </Button>
            </Link>
            <Link href="https://docs.nfthashi.com/operation-guide/how-to-use-sdk">
              <Button rounded={"full"} size={"lg"} fontWeight={"normal"} px={6}>
                How It Works
              </Button>
            </Link>
          </Stack>
        </Stack>
        <Flex flex={1} justify={"center"} align={"center"} position={"relative"} w={"full"}>
          <Box
            position={"relative"}
            height={{ base: "300px", md: "400px" }}
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
        <Heading fontSize={"3xl"} my="2">
          Powerd By
        </Heading>
        <Image
          w="2xs"
          textAlign={"center"}
          src={useColorModeValue("assets/connext_black.png", "assets/connext_white.png")}
          alt={"Connext logo"}
        ></Image>
      </Stack>
      <Stack spacing={4} as={Container} maxW={"3xl"} textAlign={"center"} align={"center"} my="16">
        <Heading fontSize={"3xl"} mb="8">
          Join Our Community
        </Heading>
        <Grid
          templateColumns={{
            base: "repeat(2, 1fr)",
            sm: "repeat(2, 1fr)",
          }}
          gap={{ base: "12", sm: "16", md: "20" }}
        >
          {communities.map((community, i) => {
            return (
              <GridItem key={i} mx="auto">
                <Link href={community.link} isExternal>
                  <Icon as={community.icon} w={12} h={12} my="auto" />
                </Link>
              </GridItem>
            );
          })}
        </Grid>
      </Stack>
    </Container>
  );
};
