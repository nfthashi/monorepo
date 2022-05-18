import type { NextPage } from "next";
import { Button, Box, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { xNatibeNFTABI } from "../lib/web3/abis/xNativeNFTABI";
import { injected } from "../lib/web3/injected";

const Native: NextPage = () => {
  const contractABI = xNatibeNFTABI;
  const [NFTContractAddress, setNFTContractAddress] = useState("");
  const [addressFrom, setAddressFrom] = useState("");
  const [addressTo, setAddressTo] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [domainId, setDomainId] = useState("");
  const { activate, library } = useWeb3React<Web3Provider>();

  const handleNFTContractAddressChange = (e: any) => {
    const inputValue = e.target.value;
    setNFTContractAddress(inputValue);
  };
  const handleAddressFromChange = (e: any) => {
    const inputValue = e.target.value;
    setAddressFrom(inputValue);
  };
  const handleAddressToChange = (e: any) => {
    const inputValue = e.target.value;
    setAddressTo(inputValue);
  };
  const handleTokenIdChange = (e: any) => {
    const inputValue = e.target.value;
    setTokenId(inputValue);
  };
  const handleDomainIdChange = (e: any) => {
    const inputValue = e.target.value;
    setDomainId(inputValue);
  };

  const xCall = async (NFTContractAddress: string, addressFrom: string, addressTo: string, tokenId: string, domainId: string) => {
    activate(injected).then(async () => {
      const contract = new ethers.Contract(NFTContractAddress, contractABI, library?.getSigner());
      const tx = await contract.xSend(addressFrom, addressTo, tokenId, domainId);
      console.log(tx);
    });
  };

  return (
    <div>
      <Box w="100%" textAlign="center">
        <Text mt="10" textAlign={"center"}>
          Native Bridge
        </Text>
        <Input mt="10" placeholder="NFT Contract Address" onChange={handleNFTContractAddressChange}></Input>
        <Input mt="10" placeholder="address from" onChange={handleAddressFromChange}></Input>
        <Input mt="10" placeholder="address to" onChange={handleAddressToChange}></Input>
        <Input mt="10" placeholder="tokenId" onChange={handleTokenIdChange}></Input>
        <Input mt="10" placeholder="DestinationDomainId" onChange={handleDomainIdChange}></Input>
        <Button
          onClick={() => {
            xCall(NFTContractAddress,addressFrom, addressTo, tokenId, domainId);
          }}
          mt="10"
        >
          Bridge
        </Button>
      </Box>
    </div>
  );
};

export default Native;
