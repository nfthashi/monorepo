import { ethers, network } from "hardhat";

import { getERC721TransferFromLogs, getTransferIdFromLogs } from "../lib/log";
import networkJsonFile from "../network.json";
import { isChainId } from "../types/ChainId";

async function main() {
  const chainId = String(network.config.chainId);
  if (!isChainId(chainId)) {
    throw new Error("chainId invalid");
  }

  console.log("network", networkJsonFile[chainId].name);
  const [signer] = await ethers.getSigners();
  console.log("signer", signer.address);

  const FaucetHashi721 = await ethers.getContractFactory("FaucetHashi721");
  const faucetHashi721 = await FaucetHashi721.attach(networkJsonFile[chainId].deployments.faucetHashi721);
  const Hashi721Bridge = await ethers.getContractFactory("Hashi721Bridge");
  const hashi721Bridge = await Hashi721Bridge.attach(networkJsonFile[chainId].deployments.hashi721Bridge);

  for (const [, network] of Object.entries(networkJsonFile).filter(([_chainId]) => chainId !== _chainId)) {
    console.log("->", network.name);
    const mintTx = await faucetHashi721.mint();
    console.log("mintTx sent", mintTx.hash);
    const mintReceipt = await mintTx.wait();
    const { tokenId } = getERC721TransferFromLogs(mintReceipt.logs);
    const isApprovedForAll = await faucetHashi721.isApprovedForAll(signer.address, hashi721Bridge.address);
    if (!isApprovedForAll) {
      const setApprovalForAllTx = await faucetHashi721.setApprovalForAll(hashi721Bridge.address, true);
      console.log("setApprovalForAll sent", setApprovalForAllTx.hash);
      await setApprovalForAllTx.wait();
    }
    const destination = network.domainId;
    const relayerFee = 0;
    const asset = faucetHashi721.address;
    const to = signer.address;
    const isTokenURIIgnored = false;
    const xCallTx = await hashi721Bridge.xCall(destination, relayerFee, asset, to, tokenId, isTokenURIIgnored);
    console.log("xCall sent", xCallTx.hash);
    // const xCallTxReceipt = await xCallTx.wait();
    // const xCallTxReceipt = await xCallTx.wait();
    // try {
    //   const transferId = getTransferIdFromLogs(xCallTxReceipt.logs);
    //   console.log(`https://testnet.amarok.connextscan.io/tx/${transferId}`);
    // } catch (e) {
    //   console.log("fail to get log from contract");
    // }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
