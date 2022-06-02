import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Link, Text, useColorMode } from "@chakra-ui/react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import React from "react";

import { injected } from "../lib/web3";

export const Header: React.FC = () => {
  const { activate, account, deactivate } = useWeb3React<Web3Provider>();
  const connect = async () => {
    activate(injected);
  };

  const docs = () => {
    window.open("https://docs.nfthashi.com/");
  };

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box>
      <Flex minH={"64px"} alignItems={"center"} justifyContent={"space-between"} p={{ base: 8 }}>
        <Link fontSize={"lg"} fontWeight={"bold"} href="/" _focus={{ boxShadow: "none" }}>
          NFTHashi
        </Link>
        <Flex gap={"2"}>
          {!account ? (
            <Button onClick={connect} fontSize={"xs"} rounded={"2xl"}>
              Connect Wallet
            </Button>
          ) : (
            <>
              <Button fontSize={"xs"} maxWidth={"32"} rounded={"2xl"} onClick={deactivate}>
                <Text noOfLines={1}>{account}</Text>
              </Button>
            </>
          )}
          <Button rounded="2xl" fontSize={"xs"} onClick={docs}>
            Doc
          </Button>
          <IconButton
            rounded={"2xl"}
            aria-label={"dark mode switch"}
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
          />
        </Flex>
      </Flex>
    </Box>
  );
};
