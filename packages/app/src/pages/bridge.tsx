import {
  Box,
  Button,
  Center,
  HStack,
  Icon,
  IconButton,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { MdSwapVerticalCircle } from "react-icons/md";
import ReactLoading from "react-loading";
import { useAccount } from "wagmi";

import { Layout } from "@/components/Layout";
import { Modal } from "@/components/Modal";
import { NFT } from "@/components/NFT";
import { SelectChain } from "@/components/SelectChain";
import { Unit } from "@/components/Unit";
import { MAINNET_CONNEXTSCAN_URL, RELAYER_FEE, SLIPPAGE, TESTNET_CONNEXTSCAN_URL } from "@/config";
import { useConnectedChainConfig } from "@/hooks/useConnectedChainConfig";
import { useConnectedChainDeployedHashi721BridgeContract } from "@/hooks/useConnectedChainDeployedHashi721BridgeContract";
import { useConnectedChainId } from "@/hooks/useConnectedChainId";
import { useConnectedChainSelectedNFTContract } from "@/hooks/useConnectedChainSelectedNFTContract";
import { useDestinationNFT } from "@/hooks/useDestinationNFT";
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
  const [destinationChainId, setDestinationChainId] = useState<ChainId>("420");

  const { selectedChainConfig: destinationChainConfig } = useSelectedChainConfig(destinationChainId);

  const [nft, setNFT] = useState<NFTType>();
  const { destinationNFT } = useDestinationNFT(nft, destinationChainId);

  const { connectedChainSelectedNFTContract } = useConnectedChainSelectedNFTContract(nft?.contractAddress);

  const [nfts, setNFTs] = useState<NFTType[]>([]);
  const [isNFTLoading, setIsNFTLoading] = useState(false);

  const [status, setStatus] = useState<
    | "preview"
    | "checkApprovalStatus"
    | "waitForApprovalTxSignature"
    | "waitForApprovalTxConfirmation"
    | "waitForBridgeTxSignature"
    | "waitForBridgeTxConfirmation"
    | "confirmed"
  >("preview");

  const [transferId, setTransferId] = useState("0x3fbcb1cce1b00bd9f8b5a28014fed17e3fbc9e0cc1638fbca485b7b6e0596996");

  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const selectNFTModalDisclosure = useDisclosure();
  const bridgeModalDisclosure = useDisclosure();

  const errorHandler = useErrorHandler();

  const swap = () => {
    setDestinationChainId(originChainId);
    setOriginChainId(destinationChainId);
  };

  useEffect(() => {
    if (!isWalletConnected) {
      setNFT(undefined);
    }
  }, [isWalletConnected]);

  return (
    <Layout>
      <Unit header={configJsonFile.name} description={configJsonFile.description}>
        <Stack spacing="8">
          <Box>
            <SelectChain
              type="origin"
              value={originChainId}
              disabled={!!nft}
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
                icon={<Icon w={6} h={6} as={MdSwapVerticalCircle} />}
                aria-label="swap"
                rounded="full"
                size="xs"
                isDisabled={!!nft}
                onClick={swap}
              />
            </VStack>
            <SelectChain
              type="destination"
              value={destinationChainId}
              disabled={!!nft}
              onChange={(e) => {
                if (e.target.value === originChainId) {
                  swap();
                } else {
                  setDestinationChainId(e.target.value as ChainId);
                }
              }}
            />
          </Box>
          {nft && (
            <Stack spacing="4">
              <HStack justify={"space-around"}>
                <NFT height="36" width="36" nft={nft} />
                <ReactLoading type={"bars"} color={configJsonFile.style.color.accent} width={24} height={24} />
                {destinationNFT && <NFT height="36" width="36" nft={destinationNFT} />}
                {!destinationNFT && (
                  <Center height="36" width="36">
                    <Spinner color={configJsonFile.style.color.accent} />
                  </Center>
                )}
              </HStack>
            </Stack>
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
                    {!nft && (
                      <>
                        <Button
                          isLoading={isNFTLoading}
                          onClick={() => {
                            setIsNFTLoading(true);
                            fetch(`/api/nft?userAddress=${connectedAddress}&chainId=${connectedChainId}`)
                              .then((data) => data.json())
                              .then((data) => {
                                setNFTs(data);
                                selectNFTModalDisclosure.onOpen();
                              })
                              .catch((e) => {
                                console.error(e.message);
                              })
                              .finally(() => {
                                setIsNFTLoading(false);
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
                            {nfts.map((nft, i) => {
                              return (
                                <NFT
                                  key={`list_nft_${i}`}
                                  nft={nft}
                                  onClick={() => {
                                    setNFT(nft);
                                    selectNFTModalDisclosure.onClose();
                                  }}
                                />
                              );
                            })}
                          </SimpleGrid>
                        </Modal>
                      </>
                    )}
                    {nft && connectedChainSelectedNFTContract && (
                      <VStack>
                        <Button
                          w="full"
                          size={configJsonFile.style.size}
                          rounded={configJsonFile.style.radius}
                          shadow={configJsonFile.style.shadow}
                          fontWeight="bold"
                          onClick={async () => {
                            setStatus("preview");
                            bridgeModalDisclosure.onOpen();
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
                          onClick={() => {
                            setNFT(undefined);
                          }}
                        >
                          Cancel
                        </Button>
                        <Modal
                          header={"Bridge"}
                          isOpen={bridgeModalDisclosure.isOpen}
                          onClose={() => {
                            setStatus("preview");
                            bridgeModalDisclosure.onClose();
                          }}
                        >
                          <Stack spacing="6">
                            <Text
                              textAlign={"center"}
                              fontWeight={"bold"}
                              color={configJsonFile.style.color.black.text.secondary}
                            >
                              {status === "preview"
                                ? "Preview"
                                : status === "checkApprovalStatus"
                                ? "Check Approval Status..."
                                : status === "waitForApprovalTxSignature"
                                ? "Please Approve NFTHashi Bridge"
                                : status === "waitForApprovalTxConfirmation"
                                ? "Waiting the Approval Tx Confirmation..."
                                : status === "waitForBridgeTxSignature"
                                ? "Please Confirm Bridge Tx"
                                : status === "waitForBridgeTxConfirmation"
                                ? "Waiting the Bridge Tx Confirmation..."
                                : "Congratulation!"}
                            </Text>

                            <Button
                              onClick={async () => {
                                try {
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
                                  setStatus("preview");
                                }
                              }}
                            >
                              Confirm
                            </Button>
                          </Stack>
                        </Modal>
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
