import React from "react";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import { injected } from "../lib/web3/injected";

export const Header: React.FC = () => {
  const { activate, account } = useWeb3React<Web3Provider>();

  const connect = async () => {
    activate(injected);
  };

  return (
    <Box>
      <Flex minH={"64px"} alignItems={"center"} justifyContent={"space-between"} p={{ base: 8 }}>
        <Text fontSize={"lg"} fontWeight={"bold"}>
          xNFTs
        </Text>
        <Flex gap={"16px"}>
          {!account ? (
            <Button onClick={connect} fontSize={"sm"}>
              Connect Wallet
            </Button>
          ) : (
            <Button disabled fontSize={"sm"}>
              {account}
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};
