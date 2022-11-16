import { ethers } from "ethers";

export const getERC721TransferFromLogs = (logs: ethers.providers.Log[]) => {
  const topic = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
  const transferInterface = new ethers.utils.Interface([
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  ]);
  const [erc721Transfer] = logs
    .filter(({ topics }) => topics[0] === topic && topics.length === 4)
    .map((log) => {
      const { blockNumber, transactionIndex, logIndex, address: contract } = log;
      const {
        args: { from, to, tokenId },
      } = transferInterface.parseLog(log);
      return {
        blockNumber,
        transactionIndex,
        logIndex,
        contract,
        from,
        to,
        tokenId: tokenId.toString(),
      };
    });
  if (!erc721Transfer) {
    throw new Error("not found");
  }
  return erc721Transfer;
};

export const getTransferIdFromLogs = (logs: ethers.providers.Log[]) => {
  const topic = "0x20e46be18a5337a5e2c807dcecc16382a2c9d4f4a4620ef7492c620fb89e9e22";
  const log = logs.find(({ topics }) => topics[0] === topic);
  if (!log) {
    throw new Error("not found");
  }
  const [, transferId] = log.topics;
  return transferId;
};
