import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import type { NextPage } from "next";

import { Bridge } from "../component/Bridge";
import { Layout } from "../component/Layout";
import { Seo } from "../component/Seo";

const IndexPage: NextPage = () => {
  return (
    <Layout>
      <Seo />
      <Flex justifyContent="center"></Flex>
    </Layout>
  );
};

export default IndexPage;
