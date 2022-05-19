import React from "react";
import { Button, Box, Input, Spinner, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { xNatibeNFTABI } from "../lib/web3/abis/xNativeNFTABI";
import { injected } from "../lib/web3/injected";

export const Native: React.FC = () => {
  const contractABI = xNatibeNFTABI;
  const [NFTContractAddress, setNFTContractAddress] = useState("");
  const [addressFrom, setAddressFrom] = useState("");
  const [addressTo, setAddressTo] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [domainId, setDomainId] = useState("");
  const { activate, library, account } = useWeb3React<Web3Provider>();
  const toast = useToast();

  const handleNFTContractAddressChange = (e: any) => {
    const inputValue = e.target.value;
    setNFTContractAddress(inputValue);
  };
  const handleSendFromAddressChange = (e: any) => {
    const inputValue = e.target.value;
    setAddressFrom(inputValue);
  };
  const handleSendToAddressChange = (e: any) => {
    const inputValue = e.target.value;
    setAddressTo(inputValue);
  };
  const handleTokenIdChange = (e: any) => {
    const inputValue = e.target.value;
    setTokenId(inputValue);
  };
  const handleDestinationDomainIdChange = (e: any) => {
    const inputValue = e.target.value;
    setDomainId(inputValue);
  };

  const connect = async () => {
    activate(injected);
  };

  const xCall = async () => {
    if (!library) {
      return;
    }
    const contract = new ethers.Contract(NFTContractAddress, contractABI, library.getSigner());
    const transaction = await contract.xSend(addressFrom, addressTo, tokenId, domainId);
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
      <Input placeholder="NFT contract address" onChange={handleNFTContractAddressChange} />
      <Input placeholder="Send from address" onChange={handleSendFromAddressChange} />
      <Input placeholder="Send to address" onChange={handleSendToAddressChange} />
      <Input placeholder="Token ID" onChange={handleTokenIdChange} />
      <Input placeholder="Destination domain ID" onChange={handleDestinationDomainIdChange} />
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
