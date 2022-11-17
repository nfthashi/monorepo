import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

import { getNFTsWithAlchemy, getNFTsWithMoralis } from "@/lib/api";
import { NFT } from "@/types/NFT";

import networkJsonFile from "../../../../contracts/network.json";
import { isChainId } from "../../../../contracts/types/ChainId";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userAddress, chainId } = req.query;

  if (typeof userAddress !== "string" || !ethers.utils.isAddress(userAddress)) {
    return res.status(400).json({ error: "user address is invalid" });
  }
  if (typeof chainId !== "string" || !isChainId(chainId)) {
    return res.status(400).json({ error: "chain id is invalid" });
  }
  let nfts: NFT[];
  const api = networkJsonFile[chainId].api;
  if (api === "moralis") {
    nfts = await getNFTsWithMoralis(userAddress, chainId);
  } else if (api === "alchemy") {
    nfts = await getNFTsWithAlchemy(userAddress, chainId);
  } else {
    throw new Error("api config invalid");
  }
  res.status(200).json(nfts);
}
