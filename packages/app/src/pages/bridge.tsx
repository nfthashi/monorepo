import {
  Box,
  Button,
  Center,
  FormControl,
  HStack,
  Icon,
  IconButton,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import { useState } from "react";
import { MdSwapVerticalCircle } from "react-icons/md";
import { useAccount } from "wagmi";

import { Layout } from "@/components/Layout";
import { Modal } from "@/components/Modal";
import { NFT } from "@/components/NFT";
import { Unit } from "@/components/Unit";
import { useIsWagmiConnected } from "@/hooks/isWagmiConnected";
import { useConnectedChainId } from "@/hooks/useConnectedChainId";
import { NFT as NFTType } from "@/types/NFT";

import networkJsonFile from "../../../contracts/network.json";
import { ChainId } from "../../../contracts/types/ChainId";
import configJsonFile from "../../config.json";

const HomePage: NextPage = () => {
  const { isWagmiConnected } = useIsWagmiConnected();
  const { address: connectedAddress } = useAccount();
  const { connectedChainId } = useConnectedChainId();

  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const modalDisclosure = useDisclosure();

  const [source, setSource] = useState<ChainId>("5");
  const [destination, setDestitnaion] = useState<ChainId>("420");
  const [nfts, setNFTs] = useState<NFTType[]>([]);
  const [nft, setNFT] = useState<NFTType>();

  const swap = () => {
    setDestitnaion(source);
    setSource(destination);
  };

  return (
    <Layout>
      <Unit header={configJsonFile.name} description={configJsonFile.description}>
        <Stack spacing="8">
          <Stack spacing={"0"} position="relative">
            <Center position="absolute" w="full" h="full">
              <IconButton
                aria-label="swap"
                mt="7"
                icon={<Icon w={6} h={6} as={MdSwapVerticalCircle} />}
                rounded="full"
                cursor="pointer"
                onClick={swap}
                size="xs"
                isDisabled={!!nft}
              />
            </Center>
            <Stack spacing="4">
              <Stack>
                <Text color={configJsonFile.style.color.black.text.secondary} fontSize="sm" fontWeight="bold">
                  Origin
                </Text>
                <FormControl>
                  <Select
                    value={source}
                    size={configJsonFile.style.size}
                    fontSize="sm"
                    rounded={configJsonFile.style.radius}
                    color={configJsonFile.style.color.black.text.secondary}
                    disabled={!!nft}
                    onChange={(e) => {
                      if (e.target.value === destination) {
                        swap();
                      } else {
                        setSource(e.target.value as ChainId);
                      }
                    }}
                  >
                    {Object.entries(networkJsonFile).map(([chainId, network]) => {
                      return (
                        <option key={`select_origin_${chainId}`} value={chainId}>
                          {network.name}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
              </Stack>
              <Stack>
                <Text color={configJsonFile.style.color.black.text.secondary} fontSize="sm" fontWeight="bold">
                  Destination
                </Text>
                <FormControl>
                  <Select
                    value={destination}
                    size={configJsonFile.style.size}
                    fontSize="sm"
                    rounded={configJsonFile.style.radius}
                    color={configJsonFile.style.color.black.text.secondary}
                    disabled={!!nft}
                    onChange={(e) => {
                      if (e.target.value === origin) {
                        swap();
                      } else {
                        setSource(e.target.value as ChainId);
                      }
                    }}
                  >
                    {Object.entries(networkJsonFile).map(([chainId, network]) => {
                      return (
                        <option key={`select_destination_${chainId}`} value={chainId}>
                          {network.name}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </Stack>
          {nft && (
            <Box>
              <NFT nft={nft} />
            </Box>
          )}
          {!isWagmiConnected && (
            <Button
              size={configJsonFile.style.size}
              fontSize="lg"
              rounded={configJsonFile.style.radius}
              fontWeight="bold"
              onClick={openConnectModal}
            >
              Connect Wallet
            </Button>
          )}
          {isWagmiConnected && (
            <>
              {connectedChainId !== source && (
                <Button
                  size={configJsonFile.style.size}
                  fontSize="lg"
                  rounded={configJsonFile.style.radius}
                  fontWeight="bold"
                  onClick={openChainModal}
                >
                  Switch Network
                </Button>
              )}
              {connectedChainId === source && (
                <>
                  {!nft && (
                    <Button
                      size={configJsonFile.style.size}
                      fontSize="lg"
                      rounded={configJsonFile.style.radius}
                      fontWeight="bold"
                      onClick={() => {
                        fetch(`/api/nft?userAddress=${connectedAddress}&chainId=${connectedChainId}`)
                          .then((data) => data.json())
                          .then((data) => {
                            setNFTs(data);
                            modalDisclosure.onOpen();
                          })
                          .catch((e) => {
                            console.error(e.message);
                          });
                      }}
                    >
                      Select NFT
                    </Button>
                  )}
                  {nft && (
                    <HStack spacing="4">
                      <Button
                        w="full"
                        variant="secondary"
                        size={configJsonFile.style.size}
                        fontSize="lg"
                        rounded={configJsonFile.style.radius}
                        fontWeight="bold"
                        onClick={() => {
                          fetch(`/api/nft?userAddress=${connectedAddress}&chainId=${connectedChainId}`)
                            .then((data) => data.json())
                            .then((data) => {
                              setNFTs(data);
                              modalDisclosure.onOpen();
                            })
                            .catch((e) => {
                              console.error(e.message);
                            });
                        }}
                      >
                        Select NFT
                      </Button>
                      <Button
                        w="full"
                        size={configJsonFile.style.size}
                        fontSize="lg"
                        rounded={configJsonFile.style.radius}
                        fontWeight="bold"
                        onClick={() => {
                          console.log("bridge");
                        }}
                      >
                        Bridge
                      </Button>
                    </HStack>
                  )}
                </>
              )}
            </>
          )}
        </Stack>
      </Unit>
      <Modal header={"Select NFT"} onClose={modalDisclosure.onClose} isOpen={modalDisclosure.isOpen}>
        <SimpleGrid columns={2} gap={4}>
          {nfts.map((nft, i) => {
            return (
              <NFT
                cursor="pointer"
                key={`list_nft_${i}`}
                nft={nft}
                onClick={() => {
                  setNFT(nft);
                  modalDisclosure.onClose();
                }}
              />
            );
          })}
        </SimpleGrid>
      </Modal>
    </Layout>
  );
};

export default HomePage;
