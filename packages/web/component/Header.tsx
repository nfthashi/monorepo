import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Image,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useClipboard,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import React from "react";
import { IoDocumentText } from "react-icons/io5";

import { injected } from "../lib/web3";
import { OrderHistory } from "./OrderHistory";
import { truncate } from "./utils/truncate";

export interface HeaderProps {
  isLanding?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isLanding }) => {
  const { activate, account, deactivate } = useWeb3React<Web3Provider>();
  const [value, setValue] = React.useState("");
  const { hasCopied, onCopy } = useClipboard(value);
  const connect = async () => {
    activate(injected);
  };
  const openModal = async () => {
    if (!account) {
      return;
    }
    setValue(account);
    onOpen();
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
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
                <Modal isOpen={isOpen} onClose={onClose} scrollBehavior={"inside"}>
                  <ModalOverlay />
                  <ModalContent padding={"4"}>
                    <Flex mb={2}>
                      <Text>Account</Text>
                      <ModalCloseButton mb={2} />
                    </Flex>
                    <Flex>
                      <Input value={value} isReadOnly placeholder="Welcome" size={"md"} borderRadius={"8px"} />
                      <Button onClick={onCopy} ml={2} size={"md"}>
                        {hasCopied ? "Copied" : "Copy"}
                      </Button>
                    </Flex>
                    <Button
                      mt={"2"}
                      fontSize={"xs"}
                      rounded={"2xl"}
                      onClick={() => {
                        deactivate(), onClose();
                      }}
                    >
                      <Text noOfLines={1}>Disconnect</Text>
                    </Button>
                    <ModalBody>
                      <Flex justify={"center"}></Flex>
                      <OrderHistory />
                    </ModalBody>
                  </ModalContent>
                </Modal>
                {!account ? (
                  <Button onClick={connect} fontSize={"xs"} rounded={"2xl"}>
                    Connect Wallet
                  </Button>
                ) : (
                  <>
                    <Button width={"100%"} onClick={openModal} fontSize={"sm"} rounded={"2xl"}>
                      {truncate(account, 5, 5)}
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
