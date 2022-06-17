import { Flex } from "@chakra-ui/react";
import type { NextPage } from "next";

import { Landing } from "../component/Landing";
import { Layout } from "../component/Layout";
import { Seo } from "../component/Seo";

const IndexPage: NextPage = () => {
  return (
    <Layout isLanding={true}>
      <Seo />
      <Flex justifyContent="center">
        <Landing />
      </Flex>
    </Layout>
  );
};

export default IndexPage;
