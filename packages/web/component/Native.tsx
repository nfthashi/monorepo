import React from "react";
import { Button, Box, Input, FormErrorMessage, FormControl, Text, Link, Spinner, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { xNatibeNFTABI } from "../lib/web3/abis/xNativeNFTABI";
import { injected } from "../lib/web3/injected";

export const Native: React.FC = () => {
  const contractABI = xNatibeNFTABI;
  const [nftContractAddress, setNFTContractAddress] = useState("");
  const [isNFTContractAddressInvalid, setIsNFTContractAddressInvalid] = useState(false);
  const [sendFromAddress, setSendFromAddress] = useState("");
  const [IsSendFromAddressInvalid, setIsSendFromAddressInvalid] = useState(false);
  const [sendToAddress, setSendToAddress] = useState("");
  const [IsSendToAddressInvalid, setIsSendToAddressInvalid] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [isTokenIdInvalid, setTokenIdInvalid] = useState(false);
  const [destinationDomainId, setDestinationDomainId] = useState("");
  const [isDestinationDomainIdInvalid, setDestinationDomainIdInvalid] = useState(false);
  const { activate, library, account } = useWeb3React<Web3Provider>();
  const toast = useToast();

  const handleNFTContractAddressChange = (e: any) => {
    const inputValue = e.target.value;
    setNFTContractAddress(inputValue);
    setIsNFTContractAddressInvalid(false);
  };
  const handleSendFromAddressChange = (e: any) => {
    const inputValue = e.target.value;
    setSendFromAddress(inputValue);
    setIsSendFromAddressInvalid(false);
  };
  const handleSendToAddressChange = (e: any) => {
    const inputValue = e.target.value;
    setSendToAddress(inputValue);
    setIsSendToAddressInvalid(false);
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
    if (!sendFromAddress) {
      setIsSendFromAddressInvalid(true);
      isError = true;
    } else {
      setIsSendFromAddressInvalid(false);
    }
    if (!sendToAddress) {
      setIsSendToAddressInvalid(true);
      isError = true;
    } else {
      setIsSendToAddressInvalid(false);
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
    const contract = new ethers.Contract(nftContractAddress, contractABI, library.getSigner());
    const transaction = await contract.xSend(sendFromAddress, sendToAddress, tokenId, destinationDomainId);
    transaction
      .wait(1)
      .then((tx: any) => {
        console.log(tx)
        toast({
          title: `Bridge Tx Hash: ${tx.transactionHash}`,
          status: "success",
          isClosable: true,
        });
      })
      .catch((err:any) => {
        toast({
          title: `${err.message}`,
          status: "error",
          isClosable: true,
        });
      });
  };

  return (
    <Box textAlign="center" experimental_spaceY="5">
      <Text>
        <Link
          isExternal
          href="https://kovan.etherscan.io/address/0xf13E44F5afEB9eC7e3A46484F59BaD811b267026#code"
          color="blue"
        >
          Mint kovan xNFTs
        </Link>
      </Text>
      <Text>
        <Link
          isExternal
          href="https://rinkeby.etherscan.io/address/0x4114B9b30E0EF8D60722cebb9E91948cfa4c850e#code"
          color="blue"
        >
          Mint rinkeby xNFTs
        </Link>
      </Text>
      <FormControl isInvalid={isNFTContractAddressInvalid}>
        <Input placeholder="NFT contract address" onChange={handleNFTContractAddressChange} />
        <FormErrorMessage>Required</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={IsSendFromAddressInvalid}>
        <Input placeholder="Send from address" onChange={handleSendFromAddressChange} />
        <FormErrorMessage>Required</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={IsSendToAddressInvalid}>
        <Input placeholder="Send to address" onChange={handleSendToAddressChange} />
        <FormErrorMessage>Required</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={isTokenIdInvalid}>
        <Input placeholder="Token ID" onChange={handleTokenIdChange} />
        <FormErrorMessage>Required</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={isDestinationDomainIdInvalid}>
        <Input placeholder="Destination domain ID" onChange={handleDestinationDomainIdChange} />
        <FormErrorMessage>Required</FormErrorMessage>
      </FormControl>
      {!account ? (
        <Button width="100%" onClick={connect} fontSize={"sm"}>
          Connect Wallet
        </Button>
      ) : (
        <Button width="100%" onClick={xCall} fontSize={"sm"}>
          Bridge
        </Button>
      )}
    </Box>
  );
};
