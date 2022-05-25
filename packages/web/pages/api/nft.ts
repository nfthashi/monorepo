import type { NextApiRequest, NextApiResponse } from "next";

import { getNFTs } from "../../lib/moralis";
import { ethers } from "ethers";
import { isChain } from "../../types/chain";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address, chain } = req.query;
  if (typeof address !== "string" || !ethers.utils.isAddress(address)) {
    return res.status(400).json({ error: "query address is invalid" });
  }
  if (typeof chain !== "string" || !isChain(chain)) {
    return res.status(400).json({ error: "query network is invalid" });
  }
  const nfts = await getNFTs(address, chain);
  res.status(200).json(nfts);
}
