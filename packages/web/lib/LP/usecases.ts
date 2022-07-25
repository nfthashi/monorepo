import { AiOutlinePicture } from "react-icons/ai";
import { BsShopWindow } from "react-icons/bs";
import { GiBank, GiGamepad, GiKeyCard, GiVote } from "react-icons/gi";

export const usecases = [
  {
    name: "Cross-Chain NFT collections.",
    description:
      "New types of NFTs can be created, including Birth Chains and those with attributes that change with the chain you are in.",
    icon: AiOutlinePicture,
  },
  {
    name: "Cross-Chain NFT marketplaces.",
    description: "Allows you to buy NFTs of your favorite chain without native tokens of other chains.",
    icon: BsShopWindow,
  },
  {
    name: "Cross-Chain NFT games",
    description: "Enables BCGs to be built across multiple chains, rather than being tied to one chain.",
    icon: GiGamepad,
  },
  {
    name: "Cross-Chain NFT governance",
    description: "Allows two or more chains of NFTs to be the voting NFTs for governance.",
    icon: GiVote,
  },
  {
    name: "Cross-Chain NFT lending ",
    description: "Allows NFTs to be used as collateral to borrow assets from other chains.",
    icon: GiBank,
  },
  {
    name: "Cross-Chain NFT Rental",
    description: "Allows you to lent NFTs of your favorite chain without native tokens of other chains..",
    icon: GiKeyCard,
  },
];
