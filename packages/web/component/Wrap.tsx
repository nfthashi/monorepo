import React from "react";
import {
  Button,
  Box,
  Radio,
  RadioGroup,
  Stack,
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
  Image,
} from "@chakra-ui/react";
import { useState } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import axios from "axios";

import { injected } from "../lib/web3/injected";
import config from "../lib/web3/config.json";
import { wrapperSourceABI } from "../lib/web3/abis/wrapperSourceABI";
import { IERC721ABI } from "../lib/web3/abis/IERC721ABI";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { NFTList } from "./NFTList";
import { NFT } from "../types/nft";
import { Chain } from "../types/chain";

declare global {
  interface Window {
    ethereum: any;
  }
}

export const Wrap: React.FC = () => {
  const [bridgeCategory, setBridgeCategory] = useState<"source" | "target">("source");
  const [selectedNFTImage, setSelectedNFTImage] = useState("");
  const [sourceChain, setSourceChain] = useState<Chain>("rinkeby");
  const [nftContractAddress, setNFTContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [destinationChain, setDestinationChain] = useState<Chain>("kovan");
  const [nftList, setNFTList] = useState<NFT[]>([]);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { activate, library, account } = useWeb3React<Web3Provider>();

  const clearSelectedNFT = () => {
    setTokenId("");
    setNFTContractAddress("");
  };

  const handleBridgeCategoryChange = (e: any) => {
    const inputValue = e;
    setBridgeCategory(inputValue);
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
    const { data } = await axios.get(`/api/nft?userAddress=${account}&chain=${sourceChain}`);
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
    const bridgeContract = config[sourceChain].contracts.wrap[bridgeCategory];
    const nftContract = new ethers.Contract(nftContractAddress, IERC721ABI, library.getSigner());
    const approvedAddress = await nftContract.getApproved(tokenId);
    const isApprovedForAll = await nftContract.isApprovedForAll(account, bridgeContract);

    if (approvedAddress != bridgeContract && isApprovedForAll != true) {
      const approveTx = await nftContract.setApprovalForAll(bridgeContract, true);
      toast({
        title: `Approve Tx Hash: ${approveTx.hash}, please wait for confirmation`,
        status: "success",
        isClosable: true,
      });
      await approveTx.wait(1);
    }
    const contract = new ethers.Contract(bridgeContract, wrapperSourceABI, library.getSigner());
    const destinationDomainId = config[destinationChain].domainId;
    const transaction = await contract.xSend(nftContractAddress, account, account, tokenId, destinationDomainId, {
      gasLimit: "500000",
    });
    transaction
      .wait(1)
      .then((tx: any) => {
        console.log(tx);
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
      <RadioGroup defaultValue="source" onChange={handleBridgeCategoryChange}>
        <Stack spacing={5} direction="row">
          <Radio name="bridgeCategory" value="source">
            Wrap
          </Radio>
          <Radio name="bridgeCategory" value="target">
            Unwrap
          </Radio>
        </Stack>
      </RadioGroup>
      <HStack align="start">
        <VStack spacing="2">
          <Text fontWeight="bold">Source</Text>
          <Select variant="filled" width="60" onChange={handleSourceChainChange} value={sourceChain} rounded="2xl">
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
          <FormControl>
            <Select
              variant="filled"
              width="60"
              onChange={handleDestinationChainChange}
              value={destinationChain}
              rounded="2xl"
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
