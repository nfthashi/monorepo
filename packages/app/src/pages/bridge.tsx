import {
  Box,
  Button,
  Center,
  FormControl,
  HStack,
  Icon,
  IconButton,
  Link,
  Select,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import { useState } from "react";
import { MdSwapVerticalCircle } from "react-icons/md";
import { useAccount } from "wagmi";

import { ButtonWithNFTListModal } from "@/components/ButtonWithNFTListModal/ButtonWithNFTListModal";
import { Layout } from "@/components/Layout";
import { Loading } from "@/components/Loading";
import { Modal } from "@/components/Modal";
import { NFT } from "@/components/NFT";
import { Unit } from "@/components/Unit";
import { MAINNET_CONNEXTSCAN_URL, RELAYER_FEE, SLIPPAGE, TESTNET_CONNEXTSCAN_URL } from "@/config";
import { useConnectedChainConfig } from "@/hooks/useConnectedChainConfig";
import { useConnectedChainDeployedHashi721BridgeContract } from "@/hooks/useConnectedChainDeployedHashi721BridgeContract";
import { useConnectedChainId } from "@/hooks/useConnectedChainId";
import { useConnectedChainSelectedNFTContract } from "@/hooks/useConnectedChainSelectedNFTContract";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useIsWalletConnected } from "@/hooks/useIsWalletConnected";
import { useSelectedChainConfig } from "@/hooks/useSelectedChainConfig";
import { compareInLowerCase } from "@/lib/utils";
import { NFT as NFTType } from "@/types/NFT";

import { getTransferIdFromLogs } from "../../../contracts/lib/log";
import networkJsonFile from "../../../contracts/network.json";
import { ChainId } from "../../../contracts/types/ChainId";
import configJsonFile from "../../config.json";

const HomePage: NextPage = () => {
  const { isWalletConnected } = useIsWalletConnected();
  const { connectedChainId } = useConnectedChainId();
  const { address: connectedAddress } = useAccount();
  const { connectedChainConfig } = useConnectedChainConfig();
  const { connectedChainDeployedHashi721BridgeContract } = useConnectedChainDeployedHashi721BridgeContract();

  const [originChainId, setOriginChainId] = useState<ChainId>("5");
  const [destinationChainId, setDestitnaionChainId] = useState<ChainId>("420");

  const { selectedChainConfig: destinationChainConfig } = useSelectedChainConfig(destinationChainId);

  const [nft, setNFT] = useState<NFTType>();
  const { connectedChainSelectedNFTContract } = useConnectedChainSelectedNFTContract(nft?.contractAddress);

  const [status, setStatus] = useState<
    | "initial"
    | "waitForApprovalTxSignature"
    | "waitForApprovalTxConfirmation"
    | "waitForBridgeTxSignature"
    | "waitForBridgeTxConfirmation"
    | "confirmed"
  >("initial");

  const [transferId, setTransferId] = useState("0x3fbcb1cce1b00bd9f8b5a28014fed17e3fbc9e0cc1638fbca485b7b6e0596996");

  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const bridgeModalDisclosure = useDisclosure();

  const errorHandler = useErrorHandler();

  const swap = () => {
    setDestitnaionChainId(originChainId);
    setOriginChainId(destinationChainId);
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
                    value={originChainId}
                    size={configJsonFile.style.size}
                    fontSize="sm"
                    rounded={configJsonFile.style.radius}
                    color={configJsonFile.style.color.black.text.secondary}
                    disabled={!!nft}
                    onChange={(e) => {
                      if (e.target.value === destinationChainId) {
                        swap();
                      } else {
                        setOriginChainId(e.target.value as ChainId);
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
                    value={destinationChainId}
                    size={configJsonFile.style.size}
                    fontSize="sm"
                    rounded={configJsonFile.style.radius}
                    color={configJsonFile.style.color.black.text.secondary}
                    disabled={!!nft}
                    onChange={(e) => {
                      if (e.target.value === originChainId) {
                        swap();
                      } else {
                        setOriginChainId(e.target.value as ChainId);
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
          {!isWalletConnected && (
            <Button
              size={configJsonFile.style.size}
              rounded={configJsonFile.style.radius}
              fontWeight="bold"
              onClick={openConnectModal}
            >
              Connect Wallet
            </Button>
          )}
          {isWalletConnected &&
            connectedAddress &&
            connectedChainConfig &&
            connectedChainDeployedHashi721BridgeContract &&
            destinationChainConfig && (
              <>
                {connectedChainId !== originChainId && (
                  <Button
                    size={configJsonFile.style.size}
                    rounded={configJsonFile.style.radius}
                    fontWeight="bold"
                    onClick={openChainModal}
                  >
                    Connect {networkJsonFile[originChainId].name}
                  </Button>
                )}
                {connectedChainId === originChainId && (
                  <>
                    {!nft && <ButtonWithNFTListModal setNFT={setNFT}>Select NFT</ButtonWithNFTListModal>}
                    {nft && connectedChainSelectedNFTContract && (
                      <HStack spacing="4">
                        <ButtonWithNFTListModal w="full" variant={"secondary"} setNFT={setNFT}>
                          Back
                        </ButtonWithNFTListModal>
                        <Button
                          w="full"
                          size={configJsonFile.style.size}
                          rounded={configJsonFile.style.radius}
                          fontWeight="bold"
                          onClick={async () => {
                            try {
                              bridgeModalDisclosure.onOpen();
                              setStatus("confirmed");
                              return;
                              setStatus("initial");
                              const resolved = await Promise.all([
                                connectedChainSelectedNFTContract
                                  .getApproved(nft.tokenId)
                                  .then((approved) => compareInLowerCase(connectedAddress, approved)),
                                connectedChainSelectedNFTContract.isApprovedForAll(
                                  connectedAddress,
                                  connectedChainDeployedHashi721BridgeContract.address
                                ),
                              ]);
                              const approved = resolved.some((v) => v);
                              if (!approved) {
                                setStatus("waitForApprovalTxSignature");
                                const approveTx = await connectedChainSelectedNFTContract.setApprovalForAll(
                                  connectedChainDeployedHashi721BridgeContract.address,
                                  true
                                );
                                console.log("setApprovalForAll tx sent", approveTx.hash);
                                setStatus("waitForApprovalTxConfirmation");
                                await approveTx.wait();
                              }
                              setStatus("waitForBridgeTxSignature");
                              const xCallTx = await connectedChainDeployedHashi721BridgeContract.xCall(
                                destinationChainConfig.domainId,
                                RELAYER_FEE,
                                SLIPPAGE,
                                connectedChainSelectedNFTContract.address,
                                destinationChainConfig.deployments.hashi721Bridge,
                                nft.tokenId,
                                false
                              );
                              console.log("xCall tx sent", xCallTx.hash);
                              setStatus("waitForBridgeTxConfirmation");
                              const xCallTxReciept = await xCallTx.wait();
                              const transferId = getTransferIdFromLogs(xCallTxReciept.logs);
                              setNFT(undefined);
                              setTransferId(transferId);
                              setStatus("confirmed");
                            } catch (e) {
                              errorHandler.handle(e);
                              bridgeModalDisclosure.onClose();
                              setStatus("initial");
                            }
                          }}
                        >
                          Bridge
                        </Button>
                        <Modal
                          header={"Bridge"}
                          isOpen={bridgeModalDisclosure.isOpen}
                          onClose={() => {
                            setStatus("initial");
                            bridgeModalDisclosure.onClose();
                          }}
                        >
                          {status === "initial" && <Loading h="400" />}
                          {status === "waitForApprovalTxSignature" && <Box h="400"></Box>}
                          {status === "waitForApprovalTxConfirmation" && <Loading h="400" />}
                          {status === "waitForBridgeTxSignature" && <Box h="400"></Box>}
                          {status === "waitForBridgeTxConfirmation" && <Loading h="400" />}
                          {status === "confirmed" && (
                            <Box>
                              <Stack spacing="6">
                                <Text
                                  textAlign={"center"}
                                  fontWeight={"bold"}
                                  color={configJsonFile.style.color.black.text.secondary}
                                >
                                  Congratulation!!
                                </Text>
                                <Box px="8">
                                  <NFT nft={nft} />
                                </Box>

                                <Text fontSize="sm" textAlign="center">
                                  <Link
                                    color={configJsonFile.style.color.accent}
                                    fontWeight="bold"
                                    href={`
                                  ${
                                    connectedChainConfig.env === "mainnet"
                                      ? MAINNET_CONNEXTSCAN_URL
                                      : TESTNET_CONNEXTSCAN_URL
                                  }/tx/${transferId}`}
                                  >
                                    Connextscan
                                  </Link>
                                </Text>
                              </Stack>
                            </Box>
                          )}
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
