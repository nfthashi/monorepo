import { ethers, network } from "hardhat";

import { getERC721TransferFromLogs, getTransferIdFromLogs } from "../lib/log";
import networkJsonFile from "../network.json";
import { isChainId } from "../types/ChainId";

const isE2ETest = process.env.IS_E2E_TEST === "true";
const onlyForE2ETest = isE2ETest ? describe.only : describe.skip;

onlyForE2ETest("E2E Test", function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config = network.config as any;
  const selfChainId = String(config.chainId);

  if (!isE2ETest || !isChainId(selfChainId) || config.forking) {
    return;
  }

  const selfNetwork = networkJsonFile[selfChainId];
  async function fixture() {
    const [signer] = await ethers.getSigners();
    const FaucetHashi721 = await ethers.getContractFactory("FaucetHashi721");
    const faucetHashi721 = await FaucetHashi721.attach(selfNetwork.deployments.faucetHashi721);

    const Hashi721Bridge = await ethers.getContractFactory("Hashi721Bridge");
    const hashi721Bridge = await Hashi721Bridge.attach(selfNetwork.deployments.hashi721Bridge);

    return { signer, faucetHashi721, hashi721Bridge };
  }

  for (const [, targetNetwork] of Object.entries(networkJsonFile).filter(
    ([targetChainId]) => selfChainId !== targetChainId
  )) {
    describe(`${selfNetwork.name} -> ${targetNetwork.name} `, function () {
      it("should work", async function () {
        const { signer, faucetHashi721, hashi721Bridge } = await fixture();
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
        const destination = targetNetwork.domainId;
        const relayerFee = 0;
        const slippage = 100;
        const asset = faucetHashi721.address;
        const to = signer.address;
        const isTokenURIIgnored = false;
        const xCallTx = await hashi721Bridge.xCall(
          destination,
          relayerFee,
          slippage,
          asset,
          to,
          tokenId,
          isTokenURIIgnored
        );
        console.log("xCall sent", xCallTx.hash);
        const xCallTxReceipt = await xCallTx.wait();
        const transferId = getTransferIdFromLogs(xCallTxReceipt.logs);
        console.log(`https://testnet.amarok.connextscan.io/tx/${transferId}`);
      });
    });
  }
});
