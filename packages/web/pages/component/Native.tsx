import type { NextPage } from "next";
import { Button, Box, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

const Native: NextPage = () => {
  const contractABI = [""];
  const contractAddress = "";
  const [addressFrom, setAddressFrom] = useState("");
  const [addressTo, setAddressTo] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [domainId, setDomainId] = useState("");
  const { library } = useWeb3React<Web3Provider>();
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

  const xCall = async (addressFrom: string, addressTo: string, tokenId: string, domainId: string) => {
    if (!library) return;
    const contract = new ethers.Contract(contractAddress, contractABI, library.getSigner());
    const tx = await contract.xSend(addressFrom, addressTo, tokenId, domainId);
    console.log(tx);
  };

  return (
    <div>
      <Box w="100%" textAlign="center">
        <Text mt="10" textAlign={"center"}>
          Native Bridge
        </Text>
        <Input mt="10" placeholder="address from" onChange={handleAddressFromChange}></Input>
        <Input mt="10" placeholder="address to" onChange={handleAddressToChange}></Input>
        <Input mt="10" placeholder="tokenId" onChange={handleTokenIdChange}></Input>
        <Input mt="10" placeholder="DestinationDomainId" onChange={handleDomainIdChange}></Input>
        <Button
          onClick={() => {
            xCall(addressFrom, addressTo, tokenId, domainId);
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
