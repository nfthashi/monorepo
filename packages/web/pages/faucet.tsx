import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import type { NextPage } from "next";

import { Faucet } from "../component/Faucet";
import { Layout } from "../component/Layout";
import { Seo } from "../component/Seo";

const FaucetPage: NextPage = () => {
  return (
    <Layout>
      <Seo />
      <Flex justifyContent="center">
        <Box
          width="xl"
          bgColor={useColorModeValue("white", "gray.700")}
          paddingY={8}
          paddingX={4}
          rounded="2xl"
          shadow="xl"
        >
          <Faucet />
        </Box>
      </Flex>
    </Layout>
  );
};

export default FaucetPage;
