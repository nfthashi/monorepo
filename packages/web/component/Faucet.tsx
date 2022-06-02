import { Box, Button, Heading, Link, Select, Text, useToast } from "@chakra-ui/react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import React, { useState } from "react";

import NativeNFT from "../../contracts/artifacts/contracts/native/exmaple/NativeNFT.sol/NativeNFT.json";
import config from "../../contracts/networks.json";
import { injected } from "../lib/web3";
import { Chain } from "../types/chain";

export const Faucet: React.FC = () => {
  const [chain, setChain] = useState<Chain>("rinkeby");
  const { activate, library, account } = useWeb3React<Web3Provider>();
  const toast = useToast();
  const connect = async () => {
    activate(injected);
  };

  const handleSourceChainChange = async (e: any) => {
    const inputValue = e.target.value;
    setChain(inputValue);
  };

  const mintNFT = async () => {
    if (!library) {
      return;
    }
    const { chainId } = await library.getNetwork();
    const { ethereum } = window;
    const sourceChainId = config[chain].chainId;
    if (chainId != sourceChainId) {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethers.utils.hexValue(sourceChainId) }],
      });
    }
    console.log(chain);
    const faucetContract = config[chain].contracts.faucet;
    const nftContract = new ethers.Contract(faucetContract, NativeNFT.abi, library.getSigner());
    const tx = await nftContract.mint(account);
    toast({
      title: `Approve Tx Hash: ${tx.hash}, please wait for confirmation`,
      status: "success",
      isClosable: true,
    });
    await tx.wait(1);
  };

  const NetworkSelectOptions: React.FC = () => {
    return (
      <>
        {Object.entries(config).map(([key, { name }], i) => {
          return (
            <option key={i} value={key}>
              {name}
            </option>
          );
        })}
      </>
    );
  };

  return (
    <Box textAlign={"center"}>
      <Heading fontSize={"xl"} my="4">
        NativeBridge NFT Faucet
      </Heading>
      <Select variant={"filled"} onChange={handleSourceChainChange} value={chain} rounded={"2xl"} fontSize={"sm"}>
        <NetworkSelectOptions />
      </Select>
      <Box mt="4">
        {!account ? (
          <Button width={"100%"} onClick={connect} fontSize={"sm"} rounded={"2xl"}>
            Connect Wallet
          </Button>
        ) : (
          <Button width={"100%"} onClick={mintNFT} fontSize={"sm"} colorScheme={"blue"} rounded={"2xl"}>
            Mint Sample NFT
          </Button>
        )}
      </Box>
      <Text fontSize={"sm"} mt="4">
        For testing wrap pattern, please get some testnet NFTs from{" "}
        <Link href="https://faucet.paradigm.xyz/" isExternal>
          https://faucet.paradigm.xyz/
        </Link>
      </Text>
    </Box>
  );
};
