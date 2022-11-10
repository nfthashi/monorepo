import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

import networks from "../../../contracts/networks.json";
import { isChain } from "../../../contracts/types/chain";
import { getNFTsFromAlchemy } from "../../lib/alchemy";
import { getNFTsFromMoralis } from "../../lib/moralis";
import { NFT } from "../../types/nft";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let nfts: NFT[];
  const { userAddress, chain } = req.query;

  if (typeof userAddress !== "string" || !ethers.utils.isAddress(userAddress)) {
    return res.status(400).json({ error: "query user address is invalid" });
  }
  if (typeof chain !== "string" || !isChain(chain)) {
    return res.status(400).json({ error: "query network is invalid" });
  }
  const apiType = networks[chain].nft_api.type;
  if (apiType == "moralis") {
    console.log("Fetch NFT data from Moralis");
    nfts = await getNFTsFromMoralis(userAddress, chain);
  } else {
    console.log("Fetch NFT data from Alchemy");
    nfts = await getNFTsFromAlchemy(userAddress, chain);
  }

  res.status(200).json(nfts);
}
