import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

import { isChain } from "../../../contracts/types/chain";
import { getNFTs } from "../../lib/moralis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userAddress, chain } = req.query;

  if (typeof userAddress !== "string" || !ethers.utils.isAddress(userAddress)) {
    return res.status(400).json({ error: "query user address is invalid" });
  }
  if (typeof chain !== "string" || !isChain(chain)) {
    return res.status(400).json({ error: "query network is invalid" });
  }
  const nfts = await getNFTs(userAddress, chain);

  res.status(200).json(nfts);
}
