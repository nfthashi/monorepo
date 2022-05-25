import React from "react";
import { Box, Flex, Text, Button, IconButton, useColorMode } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

import { injected } from "../lib/web3/injected";

export const Header: React.FC = () => {
  const { activate, account, deactivate } = useWeb3React<Web3Provider>();

  const connect = async () => {
    activate(injected);
  };
  const docs = () => {
    window.open("https://docs.nfthashi.com/");
  }

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box>
      <Flex minH={"64px"} alignItems={"center"} justifyContent={"space-between"} p={{ base: 8 }}>
        <Text fontSize={"lg"} fontWeight={"bold"}>
          NFT Hashi
        </Text>
        <Flex gap={"16px"}>
          <Button rounded="2xl" fontSize={"sm"} onClick={docs}>
            Document
          </Button>
          {!account ? (
            <Button onClick={connect} fontSize={"sm"} rounded="2xl">
              Connect Wallet
            </Button>
          ) : (
            <>
              <Button disabled fontSize={"sm"} maxWidth="40" rounded="2xl">
                <Text noOfLines={1}>{account} ...</Text>
              </Button>
              <Button fontSize={"xs"} colorScheme="yellow" onClick={deactivate} rounded="2xl">
                Disconnect
              </Button>
            </>
          )}
          <IconButton
            rounded="2xl"
            aria-label="DarkMode Switch"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />} //自分の好みでSunアイコンはreact-iconsを使用しています
            onClick={toggleColorMode}
          />
        </Flex>
      </Flex>
    </Box>
  );
};
