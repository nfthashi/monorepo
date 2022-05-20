import React from "react";
import {
  Button,
  Box,
  Input,
  FormErrorMessage,
  FormControl,
  Text,
  Link,
  useToast,
  HStack,
  VStack,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { xNatibeNFTABI } from "../lib/web3/abis/xNativeNFTABI";
import { injected } from "../lib/web3/injected";
import { ArrowRightIcon } from "@chakra-ui/icons";

export const Native: React.FC = () => {
  const contractABI = xNatibeNFTABI;
  const [sourceChainId, setSourceChainId] = useState<"4" | "42">("4");
  const [nftContractAddress, setNFTContractAddress] = useState("");
  const [isNFTContractAddressInvalid, setIsNFTContractAddressInvalid] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [isTokenIdInvalid, setTokenIdInvalid] = useState(false);
  const [destinationDomainId, setDestinationDomainId] = useState("");
  const [isDestinationDomainIdInvalid, setDestinationDomainIdInvalid] = useState(false);
  const { activate, library, account } = useWeb3React<Web3Provider>();
  const toast = useToast();
  const testNFTs = {
    "4": "https://rinkeby.etherscan.io/address/0x4114B9b30E0EF8D60722cebb9E91948cfa4c850e#code",
    "42": "https://kovan.etherscan.io/address/0xf13E44F5afEB9eC7e3A46484F59BaD811b267026#code",
  };

  const handleNFTContractAddressChange = (e: any) => {
    const inputValue = e.target.value;
    setNFTContractAddress(inputValue);
    setIsNFTContractAddressInvalid(false);
  };
  const handleTokenIdChange = (e: any) => {
    const inputValue = e.target.value;
    setTokenId(inputValue);
    setTokenIdInvalid(false);
  };
  const handleDestinationDomainIdChange = (e: any) => {
    const inputValue = e.target.value;
    setDestinationDomainId(inputValue);
    setDestinationDomainIdInvalid(false);
  };

  const handleNetwork = async (e: any) => {
    const inputValue = e.target.value;
    setSourceChainId(inputValue);
  };

  const connect = async () => {
    activate(injected);
  };

  const xCall = async () => {
    if (!library) {
      return;
    }
    let isError = false;
    if (!nftContractAddress) {
      setIsNFTContractAddressInvalid(true);
      isError = true;
    } else {
      setIsNFTContractAddressInvalid(false);
    }
    if (!tokenId) {
      setTokenIdInvalid(true);
      isError = true;
    } else {
      setTokenIdInvalid(false);
    }
    if (!destinationDomainId) {
      setDestinationDomainIdInvalid(true);
      isError = true;
    } else {
      setDestinationDomainIdInvalid(false);
    }
    if (isError) {
      return;
    }
    const { chainId } = await library.getNetwork();
    const { ethereum } = window;
    if (chainId != Number(sourceChainId)) {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethers.utils.hexValue(Number(sourceChainId)) }],
      });
    }
    const contract = new ethers.Contract(nftContractAddress, contractABI, library.getSigner());
    const transaction = await contract.xSend(account, account, tokenId, destinationDomainId);
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
          <Select variant="filled" width="60" onChange={handleNetwork} rounded="2xl">
            <option value="4">Rinkeby</option>
            <option value="42">Kovan</option>
          </Select>
          <FormControl isInvalid={isNFTContractAddressInvalid}>
            <Input
              variant="filled"
              placeholder="NFT contract address"
              onChange={handleNFTContractAddressChange}
              rounded="2xl"
            />
            <FormErrorMessage>Required</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={isTokenIdInvalid}>
            <Input variant="filled" placeholder="Token ID" onChange={handleTokenIdChange} rounded="2xl" />
            <FormErrorMessage>Required</FormErrorMessage>
          </FormControl>
        </VStack>
        <Box pt="10">
          <ArrowRightIcon />
        </Box>
        <VStack spacing="2">
          <Text fontWeight="bold">Destination</Text>
          <FormControl isInvalid={isDestinationDomainIdInvalid}>
            <Select variant="filled" width="60" onChange={handleDestinationDomainIdChange} rounded="2xl">
              <option value="1111">Rinkeby</option>
              <option value="2221">Kovan</option>
            </Select>
            <FormErrorMessage>Required</FormErrorMessage>
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
      <Text>
        <Link isExternal href={testNFTs[sourceChainId]} color={useColorModeValue("blue.500", "blue.300")}>
          Mint your test xNFTs
        </Link>
      </Text>
    </Box>
  );
};
