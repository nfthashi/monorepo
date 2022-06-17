import { task } from "hardhat/config";

import { isChain } from "../../types/chain";

task("experimental-x-fill-order", "experimental cross fill order")
  .addParam("traderAddress", "cross nft trader address")
  .addParam("from", "from")
  .addParam("nftContractAddress", "nft contract address")
  .addParam("tokenId", "token id")
  .addParam("opponentDomain", "opponent domain")
  .setAction(async ({ traderAddress, from, nftContractAddress, tokenId, opponentDomain }, { ethers, network }) => {
    const { name } = network;
    if (!isChain(name)) {
      console.log("network invalid");
      return;
    }

    const XNFTTrader = await ethers.getContractFactory("XNFTTrader");
    const xNFTTrader = await XNFTTrader.attach(traderAddress);

    const { hash } = await xNFTTrader.xSend({ nftContractAddress, from, tokenId }, false, opponentDomain);
    console.log(hash);
  });
