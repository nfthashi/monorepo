import { Button, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";

import { Layout } from "@/components/Layout";

import configJsonFile from "../../config.json";

const HomePage: NextPage = () => {
  const router = useRouter();
  return (
    <Layout>
      <VStack spacing="6" py="24">
        <Image src="/assets/logo.png" w="60" mx="auto" alt="logo" />
        <Text fontSize={"lg"} fontWeight={"bold"} color={configJsonFile.style.color.white.text.primary}>
          {configJsonFile.description}
        </Text>
        <HStack spacing="4" w="48">
          <Button w="full" variant="secondary" onClick={() => router.push(configJsonFile.url.docs)}>
            Docs
          </Button>
          <Button w="full" fontWeight={"bold"} onClick={() => router.push("/bridge")}>
            App
          </Button>
        </HStack>
      </VStack>
    </Layout>
  );
};

export default HomePage;
