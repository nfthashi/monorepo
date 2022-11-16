import { Button, ButtonProps, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { useAccount } from "wagmi";

import { Modal } from "@/components/Modal";
import { NFT } from "@/components/NFT";
import { useConnectedChainId } from "@/hooks/useConnectedChainId";
import { NFT as NFTType } from "@/types/NFT";

import configJsonFile from "../../../config.json";

export interface SelectNFTButtonProps extends ButtonProps {
  setNFT: (nft: NFTType) => void;
}

export const SelectNFTButton: React.FC<SelectNFTButtonProps> = ({ setNFT, ...buttonProps }) => {
  const { address: connectedAddress } = useAccount();
  const { connectedChainId } = useConnectedChainId();
  const modalDisclosure = useDisclosure();

  const [nfts, setNFTs] = useState<NFTType[]>([]);
  const [isNFTLoading, setIsNFTLoading] = useState(false);

  return (
    <>
      <Button
        size={configJsonFile.style.size}
        fontSize="lg"
        rounded={configJsonFile.style.radius}
        fontWeight="bold"
        isLoading={isNFTLoading}
        onClick={() => {
          setIsNFTLoading(true);
          fetch(`/api/nft?userAddress=${connectedAddress}&chainId=${connectedChainId}`)
            .then((data) => data.json())
            .then((data) => {
              setNFTs(data);
              modalDisclosure.onOpen();
            })
            .catch((e) => {
              console.error(e.message);
            })
            .finally(() => {
              setIsNFTLoading(false);
            });
        }}
        {...buttonProps}
      >
        Select NFT
      </Button>
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
    </>
  );
};
