import type { NextPage } from "next";
import { Box, Flex, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { Native } from "../component/Native";
import { Wrap } from "../component/Wrap";
import { Layout } from "../component/Layout";

const IndexPage: NextPage = () => {
  return (
    <Layout>
      <Flex justifyContent="center">
        <Box width="xl">
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
