import React from "react";
import {
  Button,
  Box,
  FormControl,
  useToast,
  HStack,
  Text,
  Select,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Flex,
  Link,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { xNatibeNFTABI } from "../lib/web3/abis/xNativeNFTABI";
import { injected } from "../lib/web3/injected";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { NFTList } from "./NFTList";
import { Chain } from "../types/chain";
import { NFT } from "../types/nft";

import axios from "axios";

import config from "../lib/web3/config.json";

export const Native: React.FC = () => {
  const contractABI = xNatibeNFTABI;
  const [selectedNFTImage, setSelectedNFTImage] = useState("");
  const [sourceChain, setSourceChain] = useState<Chain>("rinkeby");
  const [nftContractAddress, setNFTContractAddress] = useState("");
  const [isNFTContractAddressInvalid, setIsNFTContractAddressInvalid] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [isTokenIdInvalid, setTokenIdInvalid] = useState(false);
  const [destinationChain, setDestinationChain] = useState<Chain>("kovan");
  const [isDestinationChainInvalid, setIsDestinationChainInvalid] = useState(false);
  const [nftList, setNFTList] = useState<NFT[]>([]);
  const { activate, library, account } = useWeb3React<Web3Provider>();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const clearSelectedNFT = () => {
    setTokenId("");
    setNFTContractAddress("");
  };

  const handleDestinationChainChange = (e: any) => {
    const inputValue = e.target.value;
    setDestinationChain(inputValue);
    if (inputValue === "kovan") {
      setSourceChain("rinkeby");
    } else {
      setSourceChain("kovan");
    }
    clearSelectedNFT();
  };

  const handleSourceChainChange = async (e: any) => {
    const inputValue = e.target.value;
    setSourceChain(inputValue);
    if (inputValue === "kovan") {
      setDestinationChain("rinkeby");
    } else {
      setDestinationChain("kovan");
    }
    clearSelectedNFT();
  };

  const connect = async () => {
    activate(injected);
  };

  const openModal = async () => {
    if (!account || !sourceChain) {
      return;
    }
    const nftAddress = config[sourceChain].contracts.native;
    const { data } = await axios.get(`/api/nft?userAddress=${account}&chain=${sourceChain}&nftAddress=${nftAddress}`);
    setNFTList(data);
    onOpen();
  };

  const xCall = async () => {
    if (!library) {
      return;
    }
    const { chainId } = await library.getNetwork();
    const { ethereum } = window;
    const sourceChainId = config[sourceChain].chainId;
    if (chainId != sourceChainId) {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethers.utils.hexValue(sourceChainId) }],
      });
    }
    const contract = new ethers.Contract(nftContractAddress, contractABI, library.getSigner());
    const destinationDomainId = config[destinationChain].domainId;
    const transaction = await contract.xSend(account, account, tokenId, destinationDomainId, {
      gasLimit: "500000",
    });
    transaction
      .wait(1)
      .then((tx: any) => {
        toast({
          title: `Bridge Tx Hash: ${tx.transactionHash}`,
          status: "success",
          isClosable: true,
        });
      })
      .catch((err: any) => {
        toast({
          title: `${err.message}`,
          status: "error",
          isClosable: true,
        });
      });
  };

  return (
    <Box textAlign="center" experimental_spaceY="5">
      <HStack align="start">
        <VStack spacing="2">
          <Text fontWeight="bold">Source</Text>
          <Select variant="filled" width="60" onChange={handleSourceChainChange} rounded="2xl" value={sourceChain}>
            <option value="rinkeby">Rinkeby</option>
            <option value="kovan">Kovan</option>
          </Select>
          {tokenId ? (
            <Box width="40" padding="4">
              <Flex justify="center">
                <Image
                  src={selectedNFTImage}
                  alt={selectedNFTImage}
                  height="24"
                  width="24"
                  fallbackSrc="/assets/placeholder.png"
                  mb="2"
                />
              </Flex>
              <Text fontSize="xs" noOfLines={1}>
                {nftContractAddress}
              </Text>
              <Text fontSize="xs">ID: {tokenId}</Text>
            </Box>
          ) : (
            <></>
          )}
          <Button width="60" onClick={openModal} rounded="2xl" fontSize={"sm"} variant="outline" disabled={!account}>
            Select NFT
          </Button>
          <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Select NFT</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Flex justify={"center"}>
                  <NFTList
                    nfts={nftList}
                    setNFTContractAddress={setNFTContractAddress}
                    setTokenId={setTokenId}
                    setSelectedNFTImage={setSelectedNFTImage}
                    onClose={onClose}
                  />
                </Flex>
                <Box textAlign={"center"} mt="8" mb="2">
                  <Text>
                    <Link isExternal href={`${""}`} color={useColorModeValue("blue.500", "blue.300")}>
                      Mint test Native NFT
                    </Link>
                  </Text>
                </Box>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </VStack>
        <Box pt="10">
          <ArrowRightIcon w={2} h={2} />
        </Box>
        <VStack spacing="2">
          <Text fontWeight="bold">Destination</Text>
          <FormControl isInvalid={isDestinationChainInvalid}>
            <Select
              variant="filled"
              width="60"
              onChange={handleDestinationChainChange}
              rounded="2xl"
              value={destinationChain}
            >
              <option value="rinkeby">Rinkeby</option>
              <option value="kovan">Kovan</option>
            </Select>
          </FormControl>
        </VStack>
      </HStack>
      {!account ? (
        <Button width="100%" onClick={connect} fontSize={"sm"} rounded="2xl">
          Connect Wallet
        </Button>
      ) : (
        <Button width="100%" onClick={xCall} fontSize={"sm"} colorScheme="blue" rounded="2xl">
          Bridge
        </Button>
      )}
    </Box>
  );
};
