/* eslint-disable camelcase */
import { ArrowRightIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { Box, FormControl, HStack, IconButton, Select, Text, useDisclosure } from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import { VscArrowSwap } from "react-icons/vsc";

import { Layout } from "@/components/Layout";
import { Modal } from "@/components/Modal";
import { Unit } from "@/components/Unit";

import networkJsonFile from "../../../contracts/network.json";
import configJsonFile from "../../config.json";

const HomePage: NextPage = () => {
  const modalDisclosure = useDisclosure();

  const [source, setSource] = useState("5");
  const [destination, setDestitnaion] = useState("420");

  const swap = () => {
    console.log("swap");

    setDestitnaion(source);
    setSource(destination);
  };

  return (
    <Layout>
      <Unit header={configJsonFile.name} description={configJsonFile.description}>
        <HStack spacing={"2"} justify={"space-between"} py="4">
          <Box width={"full"}>
            <Text
              align={"center"}
              color={configJsonFile.style.color.black.text.secondary}
              fontWeight="bold"
              mb={2}
              fontSize={"sm"}
            >
              Origin
            </Text>
            <FormControl>
              <Select
                variant={"filled"}
                onChange={(e) => setSource(e.target.value)}
                value={source}
                rounded={"2xl"}
                fontSize={{ base: "x-small", md: "sm" }}
                fontWeight="medium"
                // disabled={!!selectedNFT}
              >
                {Object.entries(networkJsonFile).map(([chainId, network]) => {
                  return (
                    <option key={`origin_${chainId}`} value={chainId}>
                      {network.name}
                    </option>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
          <Box textAlign={"center"} mt={9}>
            <IconButton
              color="gray.800"
              onClick={swap}
              aria-label="swap"
              icon={<VscArrowSwap size="12px" />}
              background="white"
              rounded="full"
              size="xs"
              variant={"outline"}
            />
          </Box>
          <Box width={"full"}>
            <Text
              align={"center"}
              color={configJsonFile.style.color.black.text.secondary}
              fontWeight="bold"
              mb={2}
              fontSize={"sm"}
            >
              Destination
            </Text>
            <FormControl>
              <Select
                variant={"filled"}
                onChange={(e) => setDestitnaion(e.target.value)}
                value={source}
                rounded={"2xl"}
                fontSize={{ base: "x-small", md: "sm" }}
                fontWeight="medium"
                // disabled={!!selectedNFT}
              >
                {Object.entries(networkJsonFile).map(([chainId, network]) => {
                  return (
                    <option key={`destination_${chainId}`} value={chainId}>
                      {network.name}
                    </option>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </HStack>
        <Modal header={"modal header goes here"} onClose={modalDisclosure.onClose} isOpen={modalDisclosure.isOpen}>
          modal content goes here
        </Modal>
      </Unit>
    </Layout>
  );
};

export default HomePage;
