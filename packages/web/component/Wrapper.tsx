import type { NextPage } from "next";
import { Button, Box, Text, Input, Radio, RadioGroup ,Stack} from "@chakra-ui/react";
import { useState } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { injected } from "../lib/web3/injected";
import config from "../lib/web3/config.json"
import { wrapperSourceABI } from "../lib/web3/abis/wrapperSourceABI";
import { IERC721ABI } from "../lib/web3/abis/IERC721ABI";

const Wrapper: NextPage = () => {const [originalNFTContractAddress, setOriginalNFTContractAddress] = useState("");
  const [addressFrom, setAddressFrom] = useState("");
  const [addressTo, setAddressTo] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [domainId, setDomainId] = useState("");
  const [direction, setDirection] = useState("");
  const { activate, library } = useWeb3React<Web3Provider>();
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
  const handleDirectionChange = (e: any) => {
    const inputValue = e;
    setDirection(inputValue);
  };

  const xCall = async (
    originalNFTContractAddress: string,
    addressFrom: string,
    addressTo: string,
    tokenId: string,
    domainId: string
  ) => {
    console.log(direction)
    activate(injected).then(async () => {
      if (!library) return;

      
      // const chainid = library._network.chainId;
      const { name } = await library.getNetwork();
      const bridgeContract = config.wrap[name][direction];
      const nftContract = new ethers.Contract(originalNFTContractAddress, IERC721ABI, library.getSigner());
      await nftContract.setApprovalForAll(bridgeContract, true);
      const contract = new ethers.Contract(bridgeContract, wrapperSourceABI, library.getSigner());
      const tx = await contract.xSend(originalNFTContractAddress, addressFrom, addressTo, tokenId, domainId);
    });
  };

  return (
    <div>
      <Box w="75%" textAlign="center">
        <Text textAlign={"center"} mt="10">
          Wrapper Bridge
        </Text>
        <RadioGroup defaultValue="2" onChange={handleDirectionChange}>
          <Stack spacing={5} direction="row">
            <Radio colorScheme="red" value="source">
              Wrap
            </Radio>
            <Radio colorScheme="green" value="target">
              Unwrap
            </Radio>
          </Stack>
        </RadioGroup>
        <Input mt="10" placeholder="originalNFTContractAddress" onChange={handleAddressChange}></Input>
        <Input mt="10" placeholder="address from" onChange={handleAddressFromChange}></Input>
        <Input mt="10" placeholder="address to" onChange={handleAddressToChange}></Input>
        <Input mt="10" placeholder="tokenId" onChange={handleTokenIdChange}></Input>
        <Input mt="10" placeholder="DestinationDomainId" onChange={handleDomainIdChange}></Input>
        <Button
          onClick={() => {
            xCall(originalNFTContractAddress, addressFrom, addressTo, tokenId, domainId);
          }}
          mt="10"
        >
          Bridge
        </Button>
      </Box>
    </div>
  );
};

export default Wrapper;
