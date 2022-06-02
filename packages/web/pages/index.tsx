import { Box, Flex, Link, useColorModeValue } from "@chakra-ui/react";
import type { NextPage } from "next";

import { Bridge } from "../component/Bridge";
import { Layout } from "../component/Layout";
import { Seo } from "../component/Seo";

const IndexPage: NextPage = () => {
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
          <Bridge />
        </Box>
      </Flex>
      <Link textAlign={"center"} href="./faucet" _focus={{ boxShadow: "none" }}>
        If you do not have NFTs, mint at the faucet!
      </Link>
    </Layout>
  );
};

export default IndexPage;
