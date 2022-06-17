import { Box, Flex, Link, useColorModeValue } from "@chakra-ui/react";
import type { NextPage } from "next";

import { Bridge } from "../component/Bridge";
import { Layout } from "../component/Layout";
import { Seo } from "../component/Seo";

const BridgePage: NextPage = () => {
  return (
    <Layout>
      <Seo />
      <Flex justifyContent="center" mb="2">
        <Box
          width="xl"
          bgColor={useColorModeValue("white", "gray.700")}
          paddingY={8}
          paddingX={4}
          rounded="2xl"
          shadow="xl"
        >
          <Bridge />
        </Box>
      </Flex>
      <Link textAlign={"center"} href="./faucet" _focus={{ boxShadow: "none" }} fontSize="sm">
        If you do not have Test NFTs, mint at the faucet!
      </Link>
    </Layout>
  );
};

export default BridgePage;
