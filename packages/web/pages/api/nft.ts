import type { NextApiRequest, NextApiResponse } from "next";

import { getNFTs } from "../../lib/moralis";
import { ethers } from "ethers";
import { isChain } from "../../types/chain";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userAddress, chain, nftAddress } = req.query;
  if (typeof userAddress !== "string" || !ethers.utils.isAddress(userAddress)) {
    return res.status(400).json({ error: "query user address is invalid" });
  }
  if (typeof chain !== "string" || !isChain(chain)) {
    return res.status(400).json({ error: "query network is invalid" });
  }
  if (nftAddress !== undefined && typeof nftAddress !== "string") {
    return res.status(400).json({ error: "query nft address is invalid" });
  }
  const nfts = await getNFTs(userAddress, chain, nftAddress);
  res.status(200).json(nfts);
}
