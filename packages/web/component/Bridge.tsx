import { ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Image,
  Link,
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

import IERC721 from "../../contracts/artifacts/@openzeppelin/contracts/token/ERC721/IERC721.sol/IERC721.json";
import IERC165 from "../../contracts/artifacts/@openzeppelin/contracts/utils/introspection/IERC165.sol/IERC165.json";
import NFTNativeBridge from "../../contracts/artifacts/contracts/native/NFTNativeBridge.sol/NFTNativeBridge.json";
import NFTWrapBridge from "../../contracts/artifacts/contracts/wrap/NFTWrapBridge.sol/NFTWrapBridge.json";
import { NFT_NATIVE_BRIDGE_INTERFACE_ID } from "../../contracts/lib/constant";
import config from "../../contracts/networks.json";
import { injected } from "../lib/web3";
import { Chain } from "../types/chain";
import { NFT } from "../types/nft";
import { NFTList } from "./NFTList";

declare global {
  interface Window {
    ethereum: any;
  }
}

export const Bridge: React.FC = () => {
  const [selectedNFT, setSelectedNFT] = useState<NFT>();
  const [sourceChain, setSourceChain] = useState<Chain>("rinkeby");
  const [isLoading, setIsLoading] = useState(false);

  const [destinationChain, setDestinationChain] = useState<Chain>("kovan");
  const [nftList, setNFTList] = useState<NFT[]>([]);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { activate, library, account } = useWeb3React<Web3Provider>();

  const clearSelectedNFT = () => {
    setSelectedNFT(undefined);
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
    setIsLoading(true);
    const { data } = await axios.get(`/api/nft?userAddress=${account}&chain=${sourceChain}`);
    setNFTList(data);
    onOpen();
    setIsLoading(false);
  };

  const xCall = async () => {
    if (!library || !selectedNFT) {
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

    const nftContractERC165 = new ethers.Contract(selectedNFT.nftContractAddress, IERC165.abi, library.getSigner());
    const isNativeBridgeIntegrated = await nftContractERC165.supportsInterface(NFT_NATIVE_BRIDGE_INTERFACE_ID);
    const nftContract = new ethers.Contract(selectedNFT.nftContractAddress, IERC721.abi, library.getSigner());
    const destinationDomainId = config[destinationChain].domainId;

    let transaction;
    if (isNativeBridgeIntegrated) {
      const bridgeContract = selectedNFT.nftContractAddress;
      const contract = new ethers.Contract(bridgeContract, NFTNativeBridge.abi, library.getSigner());
      transaction = await contract.xSend(account, account, selectedNFT.tokenId, destinationDomainId, {
        gasLimit: "500000",
      });
    } else {
      const bridgeContract = config[sourceChain].contracts.bridge;
      const approvedAddress = await nftContract.getApproved(selectedNFT.tokenId);
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
      transaction = await contract.xSend(
        selectedNFT.nftContractAddress,
        account,
        account,
        selectedNFT.tokenId,
        destinationDomainId,
        {
          gasLimit: "500000",
        }
      );
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
            disabled={!!selectedNFT}
          >
            <NetworkSelectOptions />
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
              disabled={!!selectedNFT}
            >
              <NetworkSelectOptions />
            </Select>
          </FormControl>
        </Box>
      </Flex>
      {!selectedNFT ? (
        <Box>
          <Modal isOpen={isOpen} onClose={onClose} scrollBehavior={"inside"}>
            <ModalOverlay />
            <ModalContent padding={"4"}>
              <ModalCloseButton />
              <ModalBody>
                <Flex justify={"center"}>
                  <NFTList nfts={nftList} setSelectedNFT={setSelectedNFT} onClose={onClose} />
                </Flex>
              </ModalBody>
            </ModalContent>
          </Modal>
          {!account ? (
            <Button width={"100%"} onClick={connect} fontSize={"sm"} rounded={"2xl"}>
              Connect Wallet
            </Button>
          ) : (
            <Button
              width={"100%"}
              onClick={openModal}
              fontSize={"sm"}
              colorScheme={"blue"}
              rounded={"2xl"}
              disabled={isLoading}
            >
              Select NFT {isLoading && <Spinner ml="2" h={4} w={4} />}
            </Button>
          )}
        </Box>
      ) : (
        <Box>
          <Flex justify={"center"}>
            <Box>
              <Image
                src={selectedNFT.image}
                alt={"Selected NFT Image"}
                height={"32"}
                width={"32"}
                fit="cover"
                fallbackSrc={"/assets/placeholder.png"}
              />
            </Box>
          </Flex>
          <Box padding="8">
            <Text textAlign={"center"} fontSize={"sm"} mb="1">
              {selectedNFT.name ? selectedNFT.name : "untitled"} - #{selectedNFT.tokenId}
            </Text>
            <Text textAlign={"center"} fontSize={"xs"}>
              <Link target={"_blank"} href={`${config[sourceChain].exproler}address/${selectedNFT.nftContractAddress}`}>
                {selectedNFT.nftContractAddress}
              </Link>
            </Text>
          </Box>
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
