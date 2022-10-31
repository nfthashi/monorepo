// deployer for timelock
import { providers, Wallet } from "ethers";
import { ethers } from "hardhat";

async function main() {
  const walletPrivateKey = process.env.DEVNET_PRIVKEY || "";
  const goerilProvider = new providers.JsonRpcProvider(process.env.goerliRPC);
  const goerliWallet = new Wallet(walletPrivateKey, goerilProvider);
  const delayTime = 150; // minimum delay timer in seconds
  const proposersArray = ["0xb4b664FC3Aeb8D9b03a356ab56b6748290cb654b"]; // Proposers Array
  const executorsArray = ["0xb4b664FC3Aeb8D9b03a356ab56b6748290cb654b"]; // Executors Array

  const Token = await (await ethers.getContractFactory("TimelockController")).connect(goerliWallet);
  const token = await Token.deploy(delayTime, proposersArray, executorsArray);

  console.log("Timelock address:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
