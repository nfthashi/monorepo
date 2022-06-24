import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Image,
  Link,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import React from "react";
import { IoDocumentText } from "react-icons/io5";

import { injected } from "../lib/web3";

export interface HeaderProps {
  isLanding?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isLanding }) => {
  const { activate, account, deactivate } = useWeb3React<Web3Provider>();
  const connect = async () => {
    activate(injected);
  };

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box>
      <Flex minH={"64px"} alignItems={"center"} justifyContent={"space-between"} pb="8" pt="4" px="4">
        <Link fontSize={isLanding ? "2xl" : "lg"} fontWeight={"bold"} href="/" _focus={{ boxShadow: "none" }}>
          <Image src={useColorModeValue("/assets/light_logo.png", "/assets/dark_logo.png")} width={"16"} alt="logo" />
        </Link>
        <Flex gap={"1"}>
          <>
            {!isLanding && (
              <>
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
                <Button rounded="2xl" fontSize={"xs"} as="a" href="https://docs.nfthashi.com/" target="_blank">
                  <Icon as={IoDocumentText} color={"gray.300"} />
                </Button>
              </>
            )}
            <IconButton
              rounded={"2xl"}
              aria-label={"dark mode switch"}
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
            />
          </>
        </Flex>
      </Flex>
    </Box>
  );
};
