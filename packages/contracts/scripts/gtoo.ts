
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
const goerliConnextAddress = "0x549CE89d40Cf1D28597CbC535F669d1FEEFfbC6f";
const optimisticGoerliConnextAddress = "0x2DB8F4D9D1dbE8787FF3131b64b0ae335e08Dc93";

const main = async () => {
  // Deploying to Goerli
  const GoerliWrappedHashi = await(await ethers.getContractFactory("WrappedHashi721")).connect(goerliWallet);
  console.log("Deploying GoerliWrappedHashi 👋");
  const goerliWrappedHashi = await GoerliWrappedHashi.deploy();
  await goerliWrappedHashi.deployed();
  console.log(`deployed to ${goerliWrappedHashi.address}`);

  const GoerliHashi721Bridge = await(await ethers.getContractFactory("Hashi721Bridge")).connect(goerliWallet);
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
  console.log(`Initialize txn confirmed on Polygon! 🙌 ${setGoerliInitRec.transactionHash}`);

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
  // Polygon
  const TestGoerliNFT = await (await ethers.getContractFactory("TestNFT")).connect(goerliWallet);
  console.log("Deploying TestGoerliNFT 👋");
  const testGoerliNFT = await TestGoerliNFT.deploy();
  await testGoerliNFT.deployed();
  console.log(`deployed to ${testGoerliNFT.address}`);

  console.log("Approving TestPolygonNFT");
  const approvedGoerliTx = await testGoerliNFT.approve(goerliHashi721Bridge.address, tokenId, {
    gasLimit: 3000000,
  });
  await approvedGoerliTx.wait();
  console.log("Successfully approved");



  // Set Constructor on Polygon
  console.log(`Setting Connext Address`);
  const setPolygonConnextTx = await goerliHashi721Bridge.setConnext(goerliConnextAddress, {
    gasLimit: 3000000,
  });
  await setPolygonConnextTx.wait();

  console.log(`Setting Self Domain`);
  const setPolygonSelfDomainTx = await goerliHashi721Bridge.setSelfDomain(goerliDomainId, {
    gasLimit: 3000000,
  });
  await setPolygonSelfDomainTx.wait();


  console.log(`Setting NFT Implementation`);
  const setNftImplementationTx = await optimismHashi721Bridge.setNftImplementation(optimismWrappedHashi.address, {
    gasLimit: 3000000,
  });
  await setNftImplementationTx.wait();


  // Bridge from Polygon to Op
  console.log("Bridge NFT from Mumbai to Optimism");
  const setGoerliXSendTx = await goerliHashi721Bridge.xSend(
    testGoerliNFT.address,
    goerliWallet.address,
    optimismWallet.address,
    tokenId,
    goerliDomainId,
    true,
    {
      gasLimit: 3000000,
    }
  );
  const setGoerliXSendRec = await setGoerliXSendTx.wait();
  console.log(`Bridging txn confirmed on L1! 🙌 ${setGoerliXSendRec.transactionHash}`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
