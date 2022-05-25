import React from "react";
import {
  Button,
  Box,
  FormControl,
  useToast,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
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
import { NFTList } from "./NFTList";
import { NFT } from "../types/nft";
import { Chain } from "../types/chain";
import { ArrowDownIcon } from "@chakra-ui/icons";

declare global {
  interface Window {
    ethereum: any;
  }
}

export const Bridge: React.FC = () => {
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

    //TODO: update category detection
    const bridgeCategory = "source";

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
    <Box>
      {!tokenId ? (
        <Box>
          <Flex mb={"8"} gap={"1"} direction={"column"}>
            <Box width={"100%"}>
              <Select
                variant={"filled"}
                onChange={handleSourceChainChange}
                value={sourceChain}
                rounded={"2xl"}
                fontSize={"sm"}
              >
                <option value={"rinkeby"}>Rinkeby</option>
                <option value={"kovan"}>Kovan</option>
              </Select>
            </Box>
            <Box textAlign={"center"}>
              <ArrowDownIcon />
            </Box>
            <Box width={"100%"}>
              <FormControl>
                <Select
                  variant={"filled"}
                  onChange={handleDestinationChainChange}
                  value={destinationChain}
                  rounded={"2xl"}
                  fontSize={"sm"}
                >
                  <option value={"rinkeby"}>Rinkeby</option>
                  <option value={"kovan"}>Kovan</option>
                </Select>
              </FormControl>
            </Box>
          </Flex>
          <Modal isOpen={isOpen} onClose={onClose} scrollBehavior={"inside"}>
            <ModalOverlay />
            <ModalContent padding={"4"}>
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
            </ModalContent>
          </Modal>
          {!account ? (
            <Button width={"100%"} onClick={connect} fontSize={"sm"} rounded={"2xl"}>
              Connect Wallet
            </Button>
          ) : (
            <Button width={"100%"} onClick={openModal} fontSize={"sm"} colorScheme={"blue"} rounded={"2xl"}>
              Select NFT
            </Button>
          )}
        </Box>
      ) : (
        <Box>
          <Flex justify={"center"}>
            <Box padding="8">
              <Image
                src={selectedNFTImage}
                alt={selectedNFTImage}
                height={"48"}
                width={"48"}
                fit="cover"
                fallbackSrc={"/assets/placeholder.png"}
                mb={"2"}
              />
            </Box>
          </Flex>
          <Flex gap="4">
            <Button width={"50%"} onClick={clearSelectedNFT} fontSize={"sm"} rounded={"2xl"} variant="outline">
              Back
            </Button>
            <Button width={"50%"} onClick={xCall} fontSize={"sm"} colorScheme={"blue"} rounded={"2xl"}>
              Bridge NFT
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};
