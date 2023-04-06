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
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { MdOutlineSwapVerticalCircle } from "react-icons/md";
import ReactLoading from "react-loading";

import { Layout } from "@/components/Layout";
import { Modal } from "@/components/Modal";
import { NFT } from "@/components/NFT";
import { SelectChain } from "@/components/SelectChain";
import { Step, steps, useStep } from "@/components/Step";
import { Unit } from "@/components/Unit";
import { RELAYER_FEE } from "@/config";
import { useConnectedChainId } from "@/hooks/useConnectedChainId";
import { useCounterfactualBridgedNFT } from "@/hooks/useCounterfactualBridgedNFT";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useIsWalletConnected } from "@/hooks/useIsWalletConnected";
import { useRecentCrosschainTx } from "@/hooks/useRecentCrosschainTx";
import { useSelectedChain } from "@/hooks/useSelectedChain";
import { useSelectedNFTContract } from "@/hooks/useSelectedNFTContract";
import { compareInLowerCase } from "@/lib/utils";
import { NFT as NFTType } from "@/types/NFT";

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

  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const selectNFTModalDisclosure = useDisclosure();
  const stepModalDisclosure = useDisclosure();

  const { handleError } = useErrorHandler();
  const [currentStep, isTxProcessing, { setStep, setIsTxProcessing }] = useStep({
    maxStep: steps.length,
    initialStep: 0,
  });

  const { addRecentCrosschainTx } = useRecentCrosschainTx(connectedAddress);

  const swap = () => {
    setDestinationChainId(originChainId);
    setOriginChainId(destinationChainId);
  };

  useEffect(() => {
    if (!isWalletConnected) {
      setSelectedNFT(undefined);
    }
  }, [isWalletConnected]);

  useEffect(() => {
    if (!connectedChainId) {
      return;
    }
    if (connectedChainId === destinationChainId) {
      swap();
    } else {
      setOriginChainId(connectedChainId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swap, connectedChainId]);

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
          <Stack spacing="4">
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
                  variant={"unstyled"}
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
              <Stack>
                <Text fontSize="sm" fontWeight="bold">
                  Preview
                </Text>
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
              </Stack>
            )}
          </Stack>
          <Stack>
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
                            // isLoading={status !== "initial"}
                            onClick={async () => {
                              stepModalDisclosure.onOpen();
                              try {
                                console.log("process");
                                setStep(0);
                                setIsTxProcessing(true);
                                const resolved = await Promise.all([
                                  selectedNFTContract
                                    .getApproved(selectedNFT.tokenId)
                                    .then((approved) => compareInLowerCase(connectedAddress, approved)),
                                  selectedNFTContract.isApprovedForAll(
                                    connectedAddress,
                                    connectedChainDeployedHashi721BridgeContract.address
                                  ),
                                ]);
                                setIsTxProcessing(false);
                                const approved = resolved.some((v) => v);
                                console.log("approved", approved);
                                if (!approved) {
                                  setStep(1);
                                  const approveTx = await selectedNFTContract.approve(
                                    connectedChainDeployedHashi721BridgeContract.address,
                                    selectedNFT.tokenId
                                  );
                                  setIsTxProcessing(true);
                                  console.log("approve tx sent", approveTx.hash);
                                  await approveTx.wait();
                                  setIsTxProcessing(false);
                                }
                                setStep(2);
                                const xCallTx = await connectedChainDeployedHashi721BridgeContract.xCall(
                                  destinationChainConfig.domainId,
                                  RELAYER_FEE,
                                  selectedNFTContract.address,
                                  destinationChainConfig.deployments.hashi721Bridge,
                                  selectedNFT.tokenId,
                                  false
                                );
                                setIsTxProcessing(true);
                                console.log("xCall tx sent", xCallTx.hash);
                                addRecentCrosschainTx(xCallTx.hash);
                                await xCallTx.wait();
                                setIsTxProcessing(false);
                                setStep(3);
                              } catch (e) {
                                handleError(e);
                                if (currentStep === 3) {
                                  setSelectedNFT(undefined);
                                }
                                stepModalDisclosure.onClose();
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
                            onClick={() => {
                              setSelectedNFT(undefined);
                            }}
                          >
                            Cancel
                          </Button>
                          <Modal
                            header={"NFTHashi Bridge"}
                            onClose={() => {
                              if (currentStep === 3) {
                                setSelectedNFT(undefined);
                              }
                              stepModalDisclosure.onClose();
                            }}
                            isOpen={stepModalDisclosure.isOpen}
                          >
                            {steps.map((step, id) => (
                              <Step
                                key={id}
                                cursor="pointer"
                                onClick={() => setStep(id)}
                                title={step.title}
                                description={step.description}
                                isActive={currentStep === id}
                                isCompleted={currentStep > id}
                                isTxProcessing={isTxProcessing}
                                isLastStep={steps.length === id + 1}
                              />
                            ))}
                          </Modal>
                        </VStack>
                      )}
                    </>
                  )}
                </>
              )}
          </Stack>
        </Stack>
      </Unit>
    </Layout>
  );
};

export default HomePage;
