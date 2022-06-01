import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import type { NextPage } from "next";

import { Bridge } from "../component/Bridge";
import { Layout } from "../component/Layout";
import { Seo } from "../component/Seo";

const BridgePage: NextPage = () => {
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
    </Layout>
  );
};

export default BridgePage;
