import React from "react";
import { Button, Box, Input, Radio, RadioGroup, Stack } from "@chakra-ui/react";
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

  const { activate, library } = useWeb3React<Web3Provider>();

  const handleDirectionChange = (e: any) => {
    const inputValue = e;
    setDirection(inputValue);
  };

  const handleAddressChange = (e: any) => {
    const inputValue = e.target.value;
    setOriginalNFTContractAddress(inputValue);
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

  const xCall = async () => {
    console.log(direction);
    activate(injected).then(async () => {
      if (!library) return;
      const { name } = await library.getNetwork();
      const bridgeContract = (config as any).wrap[name][direction];
      const nftContract = new ethers.Contract(originalNFTContractAddress, IERC721ABI, library.getSigner());
      await nftContract.setApprovalForAll(bridgeContract, true);
      const contract = new ethers.Contract(bridgeContract, wrapperSourceABI, library.getSigner());
      const tx = await contract.xSend(originalNFTContractAddress, addressFrom, addressTo, tokenId, domainId);
      console.log(tx);
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
      <Input placeholder="NFT contract address" onChange={handleAddressChange}></Input>
      <Input placeholder="Address from" onChange={handleAddressFromChange}></Input>
      <Input placeholder="Address to" onChange={handleAddressToChange}></Input>
      <Input placeholder="Token ID" onChange={handleTokenIdChange}></Input>
      <Input placeholder="Destination domain ID" onChange={handleDomainIdChange}></Input>
      <Button width="100%" onClick={xCall}>
        Bridge
      </Button>
    </Box>
  );
};
