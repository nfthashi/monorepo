import { Button, Flex, HStack, Image, Stack, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";

import { Layout } from "@/components/Layout";

import configJsonFile from "../../config.json";

const HomePage: NextPage = () => {
  const router = useRouter();

  return (
    <Layout>
      <Stack spacing="6" py="24">
        <Stack spacing="6">
          <Image src="/assets/logo.png" w="xs" mx="auto" alt="logo" px="12" />
          <Text
            textAlign={"center"}
            fontSize={{ base: "md", md: "xl" }}
            fontWeight={"medium"}
            color={configJsonFile.style.color.white.text.primary}
          >
            {configJsonFile.description}
          </Text>
        </Stack>
        <Flex justify={"center"}>
          <HStack px="12" w="xs" spacing="4">
            <Button
              w="full"
              variant="secondary"
              fontWeight={"bold"}
              rounded={configJsonFile.style.radius}
              size={configJsonFile.style.size}
              fontSize="lg"
              onClick={() => router.push(configJsonFile.url.docs)}
            >
              Docs
            </Button>
            <Button
              w="full"
              fontWeight={"bold"}
              rounded={configJsonFile.style.radius}
              size={configJsonFile.style.size}
              fontSize="lg"
              onClick={() => router.push("/bridge")}
            >
              App
            </Button>
          </HStack>
        </Flex>
      </Stack>
    </Layout>
  );
};

export default HomePage;
