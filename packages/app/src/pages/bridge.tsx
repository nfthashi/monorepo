import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useAddRecentTransaction, useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { MdOutlineSwapVerticalCircle } from "react-icons/md";
import ReactLoading from "react-loading";

import { Layout } from "@/components/Layout";
import { Modal } from "@/components/Modal";
import { NFT } from "@/components/NFT";
import { SelectChain } from "@/components/SelectChain";
import { Unit } from "@/components/Unit";
import { RELAYER_FEE, SLIPPAGE } from "@/config";
import { useConnectedChainId } from "@/hooks/useConnectedChainId";
import { useCounterfactualBridgedNFT } from "@/hooks/useCounterfactualBridgedNFT";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useIsWalletConnected } from "@/hooks/useIsWalletConnected";
import { useSelectedChain } from "@/hooks/useSelectedChain";
import { useSelectedNFTContract } from "@/hooks/useSelectedNFTContract";
import { compareInLowerCase } from "@/lib/utils";
import { NFT as NFTType } from "@/types/NFT";

import { getTransferIdFromLogs } from "../../../contracts/lib/log";
import networkJsonFile from "../../../contracts/network.json";
import { ChainId } from "../../../contracts/types/ChainId";
import configJsonFile from "../../config.json";

const HomePage: NextPage = () => {
  const { isWalletConnected, connectedAddress } = useIsWalletConnected();
  const { connectedChainId } = useConnectedChainId();
  const { config: connectedChainConfig, deployedHashi721BridgeContract: connectedChainDeployedHashi721BridgeContract } =
    useSelectedChain(connectedChainId);
  const [originChainId, setOriginChainId] = useState<ChainId>("5");
  const [destinationChainId, setDestinationChainId] = useState<ChainId>("420");
  const { config: destinationChainConfig } = useSelectedChain(destinationChainId);
  const [selectedNFT, setSelectedNFT] = useState<NFTType>();
  const { selectedNFTContract } = useSelectedNFTContract(selectedNFT?.contractAddress);
  const { counterfactualBridgedNFT } = useCounterfactualBridgedNFT(originChainId, destinationChainId, selectedNFT);

  const [nftList, setNFTList] = useState<NFTType[]>([]);
  const [isNFTListLoading, setIsNFTListLoading] = useState(false);

  const [status, setStatus] = useState<
    | "initial"
    | "checkApprovalStatus"
    | "waitForApprovalTxSignature"
    | "waitForApprovalTxConfirmation"
    | "waitForBridgeTxSignature"
    | "waitForBridgeTxConfirmation"
    | "confirmed"
  >("initial");

  const addRecentTransaction = useAddRecentTransaction();
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const selectNFTModalDisclosure = useDisclosure();

  const { handleError } = useErrorHandler();

  const swap = () => {
    setDestinationChainId(originChainId);
    setOriginChainId(destinationChainId);
  };

  useEffect(() => {
    if (!isWalletConnected) {
      setSelectedNFT(undefined);
    }
  }, [isWalletConnected]);

  return (
    <Layout>
      <Unit
        header={configJsonFile.name}
        description={"Bridge NFTs by Connext Amarok AMB"}
        learnMore={{ text: "Learn more", href: "https://blog.connext.network/amarok-amb-update-77f142c22db3" }}
        position="relative"
      >
        <Flex position="absolute" top="0" right="0" p="4">
          <Text fontSize="xs" fontWeight={"bold"}>
            <Link href="https://faucet.paradigm.xyz/" target={"_blank"} color={configJsonFile.style.color.accent}>
              Faucet
            </Link>
          </Text>
        </Flex>
        <Stack spacing="8">
          <Box>
            <SelectChain
              type="origin"
              value={originChainId}
              disabled={!!selectedNFT}
              onChange={(e) => {
                if (e.target.value === destinationChainId) {
                  swap();
                } else {
                  setOriginChainId(e.target.value as ChainId);
                }
              }}
            />
            <VStack>
              <IconButton
                top="3.5"
                icon={<Icon w={6} h={6} as={MdOutlineSwapVerticalCircle} color="accent" />}
                aria-label="swap"
                rounded="full"
                shadow="none"
                size="xs"
                variant={"ghost"}
                isDisabled={!!selectedNFT}
                onClick={swap}
              />
            </VStack>
            <SelectChain
              type="destination"
              value={destinationChainId}
              disabled={!!selectedNFT}
              onChange={(e) => {
                if (e.target.value === originChainId) {
                  swap();
                } else {
                  setDestinationChainId(e.target.value as ChainId);
                }
              }}
            />
          </Box>
          {selectedNFT && (
            <HStack justify={"space-around"}>
              <NFT height="36" width="36" nft={selectedNFT} />
              <VStack>
                <ReactLoading type={"bars"} color={configJsonFile.style.color.accent} width={24} height={24} />
              </VStack>
              {counterfactualBridgedNFT && <NFT height="36" width="36" nft={counterfactualBridgedNFT} />}
              {!counterfactualBridgedNFT && (
                <Center height="36" width="36">
                  <Spinner color={configJsonFile.style.color.accent} />
                </Center>
              )}
            </HStack>
          )}
          {!isWalletConnected && <Button onClick={openConnectModal}>Connect Wallet</Button>}
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
                    shadow={configJsonFile.style.shadow}
                    fontWeight="bold"
                    onClick={openChainModal}
                  >
                    Connect {networkJsonFile[originChainId].name}
                  </Button>
                )}
                {connectedChainId === originChainId && (
                  <>
                    {!selectedNFT && (
                      <>
                        <Button
                          isLoading={isNFTListLoading}
                          onClick={() => {
                            setIsNFTListLoading(true);
                            fetch(`/api/nft?userAddress=${connectedAddress}&chainId=${connectedChainId}`)
                              .then((data) => data.json())
                              .then((data) => {
                                setNFTList(data);
                                selectNFTModalDisclosure.onOpen();
                              })
                              .catch((e) => {
                                console.error(e.message);
                              })
                              .finally(() => {
                                setIsNFTListLoading(false);
                              });
                          }}
                        >
                          Select NFT
                        </Button>
                        <Modal
                          header={"Select NFT"}
                          onClose={selectNFTModalDisclosure.onClose}
                          isOpen={selectNFTModalDisclosure.isOpen}
                        >
                          <SimpleGrid columns={2} gap={4}>
                            {nftList.map((nft, i) => {
                              return (
                                <NFT
                                  key={`list_nft_${i}`}
                                  nft={nft}
                                  onClick={() => {
                                    setSelectedNFT(nft);
                                    selectNFTModalDisclosure.onClose();
                                  }}
                                />
                              );
                            })}
                          </SimpleGrid>
                        </Modal>
                      </>
                    )}
                    {selectedNFT && selectedNFTContract && (
                      <VStack>
                        <Button
                          w="full"
                          size={configJsonFile.style.size}
                          rounded={configJsonFile.style.radius}
                          shadow={configJsonFile.style.shadow}
                          fontWeight="bold"
                          spinnerPlacement="end"
                          isLoading={status !== "initial"}
                          loadingText={
                            status === "checkApprovalStatus"
                              ? "Check Approval Status..."
                              : status === "waitForApprovalTxSignature"
                              ? "Approve NFTHashi Bridge"
                              : status === "waitForApprovalTxConfirmation"
                              ? "Waiting Tx Confirmation..."
                              : status === "waitForBridgeTxSignature"
                              ? "Confirm Bridge Tx"
                              : "Waiting Tx Confirmation..."
                          }
                          onClick={async () => {
                            try {
                              const resolved = await Promise.all([
                                selectedNFTContract
                                  .getApproved(selectedNFT.tokenId)
                                  .then((approved) => compareInLowerCase(connectedAddress, approved)),
                                selectedNFTContract.isApprovedForAll(
                                  connectedAddress,
                                  connectedChainDeployedHashi721BridgeContract.address
                                ),
                              ]);
                              const approved = resolved.some((v) => v);
                              if (!approved) {
                                setStatus("waitForApprovalTxSignature");
                                const approveTx = await selectedNFTContract.setApprovalForAll(
                                  connectedChainDeployedHashi721BridgeContract.address,
                                  true
                                );
                                console.log("setApprovalForAll tx sent", approveTx.hash);
                                addRecentTransaction({ hash: approveTx.hash, description: "setApprovalForAll" });
                                setStatus("waitForApprovalTxConfirmation");
                                await approveTx.wait();
                              }
                              setStatus("waitForBridgeTxSignature");
                              const xCallTx = await connectedChainDeployedHashi721BridgeContract.xCall(
                                destinationChainConfig.domainId,
                                RELAYER_FEE,
                                SLIPPAGE,
                                selectedNFTContract.address,
                                destinationChainConfig.deployments.hashi721Bridge,
                                selectedNFT.tokenId,
                                false
                              );
                              console.log("xCall tx sent", xCallTx.hash);
                              addRecentTransaction({ hash: xCallTx.hash, description: "xCall" });
                              setStatus("waitForBridgeTxConfirmation");
                              const xCallTxReciept = await xCallTx.wait();
                              const transferId = getTransferIdFromLogs(xCallTxReciept.logs);

                              setSelectedNFT(undefined);
                            } catch (e) {
                              handleError(e);
                            } finally {
                              setStatus("initial");
                            }
                          }}
                        >
                          Bridge
                        </Button>
                        <Button
                          w="full"
                          size={configJsonFile.style.size}
                          rounded={configJsonFile.style.radius}
                          shadow={configJsonFile.style.shadow}
                          fontWeight="bold"
                          variant={"secondary"}
                          disabled={status !== "initial"}
                          onClick={() => {
                            setSelectedNFT(undefined);
                          }}
                        >
                          Cancel
                        </Button>
                      </VStack>
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
