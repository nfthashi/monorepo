import {
  Box,
  Button,
  Center,
  FormControl,
  HStack,
  Icon,
  IconButton,
  Select,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import { useState } from "react";
import { MdSwapVerticalCircle } from "react-icons/md";

import { Layout } from "@/components/Layout";
import { Modal } from "@/components/Modal";
import { NFT } from "@/components/NFT";
import { SelectNFTButton } from "@/components/SelectNFTButton/SelectNFTButton";
import { Unit } from "@/components/Unit";
import { useIsWagmiConnected } from "@/hooks/isWagmiConnected";
import { useConnectedChainId } from "@/hooks/useConnectedChainId";
import { delay } from "@/lib/utils";
import { NFT as NFTType } from "@/types/NFT";

import networkJsonFile from "../../../contracts/network.json";
import { ChainId } from "../../../contracts/types/ChainId";
import configJsonFile from "../../config.json";

const HomePage: NextPage = () => {
  const { isWagmiConnected } = useIsWagmiConnected();
  const { connectedChainId } = useConnectedChainId();
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const bridgeModalDisclosure = useDisclosure();

  const [source, setSource] = useState<ChainId>("5");
  const [destination, setDestitnaion] = useState<ChainId>("420");
  const [nft, setNFT] = useState<NFTType>();

  const [status, setStatus] = useState<
    | "checkStatus"
    | "waitForApprovalTxSignature"
    | "waitForApprovalTxConfirmation"
    | "waitForBridgeTxSignature"
    | "waitForBridgeTxConfirmation"
    | "confirmed"
  >("checkStatus");

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
                  {!nft && <SelectNFTButton setNFT={setNFT} />}
                  {nft && (
                    <HStack spacing="4">
                      <SelectNFTButton w="full" variant={"secondary"} setNFT={setNFT} />
                      <Button
                        w="full"
                        size={configJsonFile.style.size}
                        fontSize="lg"
                        rounded={configJsonFile.style.radius}
                        fontWeight="bold"
                        onClick={() => {
                          delay(5000).then(() => {
                            setStatus("waitForApprovalTxSignature");
                          });
                          bridgeModalDisclosure.onOpen();
                        }}
                      >
                        Bridge
                      </Button>
                      <Modal
                        header={"Bridge"}
                        isOpen={bridgeModalDisclosure.isOpen}
                        onClose={() => {
                          setStatus("checkStatus");
                          bridgeModalDisclosure.onClose();
                        }}
                      >
                        {status === "checkStatus" && <Box>Check Status</Box>}
                        {status === "waitForApprovalTxSignature" && (
                          <Box>
                            <Button
                              size={configJsonFile.style.size}
                              fontSize="lg"
                              rounded={configJsonFile.style.radius}
                              fontWeight="bold"
                              onClick={() => {
                                setStatus("waitForApprovalTxConfirmation");
                                delay(5000).then(() => {
                                  setStatus("waitForBridgeTxSignature");
                                });
                              }}
                            >
                              Approve
                            </Button>
                          </Box>
                        )}
                        {status === "waitForApprovalTxConfirmation" && <Box>waitForApprovalTxConfirmation</Box>}
                        {status === "waitForBridgeTxSignature" && (
                          <Box>
                            <Button
                              size={configJsonFile.style.size}
                              fontSize="lg"
                              rounded={configJsonFile.style.radius}
                              fontWeight="bold"
                              onClick={() => {
                                setStatus("waitForBridgeTxConfirmation");
                                delay(5000).then(() => {
                                  setStatus("confirmed");
                                });
                              }}
                            >
                              Bridge
                            </Button>
                          </Box>
                        )}
                        {status === "waitForBridgeTxConfirmation" && <Box>waitForBridgeTxConfirmation</Box>}
                        {status === "confirmed" && <Box>confirmed</Box>}
                      </Modal>
                    </HStack>
                  )}
                </>
              )}
            </>
          )}
        </Stack>
      </Unit>
    </Layout>
  );
};

export default HomePage;
