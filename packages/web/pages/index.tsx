import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import type { NextPage } from "next";

import { Landing } from "../component/Landing";
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
          <Landing />
        </Box>
      </Flex>
    </Layout>
  );
};

export default IndexPage;
