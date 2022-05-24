import type { NextPage } from "next";
import { Box, Flex, Tabs, TabList, TabPanels, Tab, TabPanel, useColorModeValue } from "@chakra-ui/react";
import { Native } from "../component/Native";
import { Wrap } from "../component/Wrap";
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
          paddingY={10}
          paddingX={4}
          rounded="2xl"
          shadow="xl"
        >
          <Tabs>
            <TabList>
              <Tab>Wrap</Tab>
              <Tab>Native</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Wrap />
              </TabPanel>
              <TabPanel>
                <Native />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Layout>
  );
};

export default IndexPage;
