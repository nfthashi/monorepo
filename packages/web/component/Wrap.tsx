import React from "react";
import { Button, Box, Input, Radio, RadioGroup, Stack, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { injected } from "../lib/web3/injected";
import config from "../lib/web3/config.json";
import { wrapperSourceABI } from "../lib/web3/abis/wrapperSourceABI";
import { IERC721ABI } from "../lib/web3/abis/IERC721ABI";

export const Wrap: React.FC = () => {
  const [direction, setDirection] = useState("source");
  const [originalNFTContractAddress, setOriginalNFTContractAddress] = useState("");
  const [addressFrom, setAddressFrom] = useState("");
  const [addressTo, setAddressTo] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [domainId, setDomainId] = useState("");
  const toast = useToast();

  const { activate, library, account } = useWeb3React<Web3Provider>();

  const handleDirectionChange = (e: any) => {
    const inputValue = e;
    setDirection(inputValue);
  };

  const handleNFTContractAddressChange = (e: any) => {
    const inputValue = e.target.value;
    setOriginalNFTContractAddress(inputValue);
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
    const { name } = await library.getNetwork();
    const bridgeContract = (config as any).wrap[name][direction];
    const nftContract = new ethers.Contract(originalNFTContractAddress, IERC721ABI, library.getSigner());
    const approvedAddress = await nftContract.getApproved(tokenId);
    const isApprovedForAll = await nftContract.isApprovedForAll(addressFrom, bridgeContract);
    console.log(approvedAddress, "approvedAddress");
    console.log(isApprovedForAll, "isApprovedForAll");

    if (approvedAddress != bridgeContract && isApprovedForAll != true) {
      await nftContract.setApprovalForAll(bridgeContract, true);
    }
    const contract = new ethers.Contract(bridgeContract, wrapperSourceABI, library.getSigner());
    const transaction = await contract.xSend(originalNFTContractAddress, addressFrom, addressTo, tokenId, domainId);
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
      <RadioGroup defaultValue="source" onChange={handleDirectionChange}>
        <Stack spacing={5} direction="row">
          <Radio name="direction" value="source">
            Wrap
          </Radio>
          <Radio name="direction" value="target">
            Unwrap
          </Radio>
        </Stack>
      </RadioGroup>
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
