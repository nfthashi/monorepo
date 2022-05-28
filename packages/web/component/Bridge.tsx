import { ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Select,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { ethers } from "ethers";
import React, { useState } from "react";

import config from "../lib/web3/config.json";
import { NFT_NATIVE_BRIDGE_INTERFACE_ID } from "../lib/web3/constant";
import IERC165 from "../lib/web3/IERC165.json";
import IERC721 from "../lib/web3/IERC721.json";
import { injected } from "../lib/web3/injected";
import NFTNativeBridge from "../lib/web3/NFTNativeBridge.json";
import NFTWrapBridge from "../lib/web3/NFTWrapBridge.json";
import { Chain } from "../types/chain";
import { NFT } from "../types/nft";
import { NFTList } from "./NFTList";

declare global {
  interface Window {
    ethereum: any;
  }
}

export const Bridge: React.FC = () => {
  const [selectedNFTImage, setSelectedNFTImage] = useState("");
  const [selectedNFTName, setSelectedNFTName] = useState("");
  const [sourceChain, setSourceChain] = useState<Chain>("rinkeby");
  const [nftContractAddress, setNFTContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [load, setLoad] = useState("");
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
    if (inputValue === sourceChain) {
      setSourceChain(destinationChain);
    }
    setDestinationChain(inputValue);
    clearSelectedNFT();
  };

  const handleSourceChainChange = async (e: any) => {
    const inputValue = e.target.value;
    if (inputValue === destinationChain) {
      setDestinationChain(sourceChain);
    }
    setSourceChain(inputValue);
    clearSelectedNFT();
  };

  const connect = async () => {
    activate(injected);
  };

  const openModal = async () => {
    if (!account || !sourceChain) {
      return;
    }
    onOpen();
    const { data } = await axios.get(`/api/nft?userAddress=${account}&chain=${sourceChain}`);
    setLoad("none")
    setNFTList(data);
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

    const nftContractERC165 = new ethers.Contract(nftContractAddress, IERC165.abi, library.getSigner());
    const isNativeBridgeIntegrated = await nftContractERC165.supportsInterface(NFT_NATIVE_BRIDGE_INTERFACE_ID);
    const nftContract = new ethers.Contract(nftContractAddress, IERC721.abi, library.getSigner());
    const destinationDomainId = config[destinationChain].domainId;

    let transaction;
    if (isNativeBridgeIntegrated) {
      const bridgeContract = nftContractAddress;
      const contract = new ethers.Contract(bridgeContract, NFTNativeBridge.abi, library.getSigner());
      transaction = await contract.xSend(account, account, tokenId, destinationDomainId, {
        gasLimit: "500000",
      });
    } else {
      const bridgeContract = config[sourceChain].contracts.bridge;
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
      const contract = new ethers.Contract(bridgeContract, NFTWrapBridge.abi, library.getSigner());
      transaction = await contract.xSend(nftContractAddress, account, account, tokenId, destinationDomainId, {
        gasLimit: "500000",
      });
    }

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
      <Flex mb={"8"} gap={"1"} justify={"space-between"}>
        <Box width={"45%"}>
          <Text align={"center"} fontWeight="bold" mb={2} fontSize={"sm"}>
            Source
          </Text>
          <Select
            variant={"filled"}
            onChange={handleSourceChainChange}
            value={sourceChain}
            rounded={"2xl"}
            fontSize={"sm"}
            disabled={!!tokenId}
          >
            <option value={"rinkeby"}>Rinkeby</option>
            <option value={"kovan"}>Kovan</option>
            <option value={"goerli"}>Goerli</option>
          </Select>
        </Box>
        <Box textAlign={"center"} mt={9}>
          <ArrowRightIcon w={2} h={2} />
        </Box>
        <Box width={"45%"}>
          <Text align={"center"} fontWeight="bold" mb={2} fontSize={"sm"}>
            Destination
          </Text>
          <FormControl>
            <Select
              variant={"filled"}
              onChange={handleDestinationChainChange}
              value={destinationChain}
              rounded={"2xl"}
              fontSize={"sm"}
              disabled={!!tokenId}
            >
              <option value={"rinkeby"}>Rinkeby</option>
              <option value={"kovan"}>Kovan</option>
              <option value={"goerli"}>Goerli</option>
            </Select>
          </FormControl>
        </Box>
      </Flex>
      {!tokenId ? (
        <Box>
          <Modal isOpen={isOpen} onClose={onClose} scrollBehavior={"inside"}>
            <ModalOverlay />
            <ModalContent padding={"4"}>
              {/* <Box textAlign={"center"}display={load}> */}
              <Center display={load} h={"100%"} minH={1 / 2} >
                <Flex verticalAlign={"middle"}>
                  <Spinner />
                  <Text ml={"10"}>Loading NFT</Text>
                </Flex>
              </Center>
              {/* </Box> */}
              <ModalCloseButton />
              <ModalBody>
                <Flex justify={"center"}>
                  <NFTList
                    nfts={nftList}
                    setNFTContractAddress={setNFTContractAddress}
                    setTokenId={setTokenId}
                    setSelectedNFTImage={setSelectedNFTImage}
                    setSelectedNFTName={setSelectedNFTName}
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
          <Text textAlign={"center"}>{selectedNFTName}</Text>
          <Flex gap="4" mt={"10"}>
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
