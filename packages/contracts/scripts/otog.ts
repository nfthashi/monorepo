import { providers, Wallet } from "ethers";
import { ethers } from "hardhat";

const walletPrivateKey = process.env.DEVNET_PRIVKEY || "";

const goerilProvider = new providers.JsonRpcProvider(process.env.goerliRPC);
const optimismProvider = new providers.JsonRpcProvider(process.env.optimismRPC);

const goerliWallet = new Wallet(walletPrivateKey, goerilProvider);
const optimismWallet = new Wallet(walletPrivateKey, optimismProvider);

const tokenId = "0";
const goerliDomainId = "1735353714";
const optimisticGoerliDomainId = "1735356532";
const goerliConnextAddress = "0x99A784d082476E551E5fc918ce3d849f2b8e89B6";
const optimisticGoerliConnextAddress = "0x705791AD27229dd4CCf41b6720528AfE1bcC2910";

const main = async () => {
  // Deploying to Goerli
  const GoerliWrappedHashi = await (await ethers.getContractFactory("WrappedHashi721")).connect(goerliWallet);
  console.log("Deploying GoerliWrappedHashi 👋");
  const goerliWrappedHashi = await GoerliWrappedHashi.deploy();
  await goerliWrappedHashi.deployed();
  console.log(`deployed to ${goerliWrappedHashi.address}`);

  const GoerliHashi721Bridge = await (await ethers.getContractFactory("Hashi721Bridge")).connect(goerliWallet);
  console.log("Deploying GoerliHashi721Bridge 👋");
  const goerliHashi721Bridge = await GoerliHashi721Bridge.deploy();
  await goerliHashi721Bridge.deployed();
  console.log(`deployed to ${goerliHashi721Bridge.address}`);

  const setGoerliInitTx = await goerliHashi721Bridge.initialize(
    goerliDomainId,
    goerliConnextAddress,
    goerliWrappedHashi.address,
    {
      gasLimit: 3000000,
    }
  );
  const setGoerliInitRec = await setGoerliInitTx.wait();
  console.log(`Initialize txn confirmed on Goerli! 🙌 ${setGoerliInitRec.transactionHash}`);

  // Deploying to Optimism
  const OptimismWrappedHashi = await (await ethers.getContractFactory("WrappedHashi721")).connect(optimismWallet);
  console.log("Deploying OptimismWrappedHashi 👋");
  const optimismWrappedHashi = await OptimismWrappedHashi.deploy();
  await optimismWrappedHashi.deployed();
  console.log(`deployed to ${optimismWrappedHashi.address}`);

  const OptimismHashi721Bridge = await (await ethers.getContractFactory("Hashi721Bridge")).connect(optimismWallet);
  console.log("Deploying OptimismHashi721Bridge 👋");
  const optimismHashi721Bridge = await OptimismHashi721Bridge.deploy();
  await optimismHashi721Bridge.deployed();
  console.log(`deployed to ${optimismHashi721Bridge.address}`);

  const setOpInitTx = await optimismHashi721Bridge.initialize(
    optimisticGoerliDomainId,
    optimisticGoerliConnextAddress,
    optimismWrappedHashi.address,
    {
      gasLimit: 3000000,
    }
  );
  const setOpInitRec = await setOpInitTx.wait();
  console.log(`Initialize txn confirmed on Optimism! 🙌 ${setOpInitRec.transactionHash}`);

  // Set Bridge Contract
  console.log(`Updating Optimism Target Address`);
  const updateOpTx = await goerliHashi721Bridge.setBridgeContract(
    optimisticGoerliDomainId,
    optimismHashi721Bridge.address,
    {
      gasLimit: 3000000,
    }
  );
  await updateOpTx.wait();

  console.log(`Updating Goerli Target Address`);
  const updatePolygonTx = await optimismHashi721Bridge.setBridgeContract(goerliDomainId, goerliHashi721Bridge.address, {
    gasLimit: 3000000,
  });
  await updatePolygonTx.wait();
  console.log("Counterpart contract addresses set in both contracts 👍");

  // Deploy, Mint, Approve Test NFTs
  // Optimism
  const TestOpNFT = await (await ethers.getContractFactory("TestNFT")).connect(optimismWallet);
  console.log("Deploying TestGoerliNFT 👋");
  const testOpNFT = await TestOpNFT.deploy();
  await testOpNFT.deployed();
  console.log(`deployed to ${testOpNFT.address}`);

  console.log("Approving TestPolygonNFT");
  const approvedOpTx = await testOpNFT.approve(optimismHashi721Bridge.address, tokenId, {
    gasLimit: 3000000,
  });
  await approvedOpTx.wait();
  console.log("Successfully approved");

  // Set Constructor on Op
  console.log(`Setting Connext Address on Optimism`);
  const setOpConnextTx = await optimismHashi721Bridge.setConnext(optimisticGoerliConnextAddress, {
    gasLimit: 3000000,
  });
  await setOpConnextTx.wait();

  console.log(`Setting Self Domain`);
  const setOpSelfDomainTx = await optimismHashi721Bridge.setSelfDomain(optimisticGoerliDomainId, {
    gasLimit: 3000000,
  });
  await setOpSelfDomainTx.wait();

  console.log(`Setting Connext Address on Goerli`);
  const setGoerliConnextTx = await goerliHashi721Bridge.setConnext(goerliConnextAddress, {
    gasLimit: 3000000,
  });
  await setGoerliConnextTx.wait();
  console.log(`Setting NFT Implementation`);
  const setNftImplementationTx = await goerliHashi721Bridge.setNftImplementation(goerliWrappedHashi.address, {
    gasLimit: 3000000,
  });
  await setNftImplementationTx.wait();

  // Bridge from Polygon to Op
  console.log("Bridge NFT from Optimism to Goerli");
  const setOpXSendTx = await optimismHashi721Bridge.xSend(
    testOpNFT.address,
    optimismWallet.address,
    goerliWallet.address,
    tokenId,
    goerliDomainId,
    true,
    {
      gasLimit: 3000000,
    }
  );
  const setOpXSendRec = await setOpXSendTx.wait();
  console.log(`Bridging txn confirmed on Optimism! 🙌 ${setOpXSendRec.transactionHash}`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
