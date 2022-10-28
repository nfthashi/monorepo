
import { providers, Wallet } from "ethers";
import { ethers } from "hardhat";

const walletPrivateKey = process.env.DEVNET_PRIVKEY || "";

const mumbaiProvider = new providers.JsonRpcProvider(process.env.mumbaiRPC);
const optimismProvider = new providers.JsonRpcProvider(process.env.optimismRPC);

const mumbaiWallet = new Wallet(walletPrivateKey, mumbaiProvider);
const optimismWallet = new Wallet(walletPrivateKey, optimismProvider);

const tokenId = "0";
const polygonMumbaiDomainId = "9991";
const optimisticGoerliDomainId = "1735356532";
const polygonMumbaiConnextAddress = "0xfeBBcfe9a88aadefA6e305945F2d2011493B15b4";
const optimisticGoerliConnextAddress = "0x705791AD27229dd4CCf41b6720528AfE1bcC2910";

const main = async () => {
  // Deploying to Polygon
  const PolygonWrappedHashi = await (await ethers.getContractFactory("WrappedHashi721")).connect(mumbaiWallet);
  console.log("Deploying PolygonWrappedHashi 👋");
  const polygonWrappedHashi = await PolygonWrappedHashi.deploy();
  await polygonWrappedHashi.deployed();
  console.log(`deployed to ${polygonWrappedHashi.address}`);

  const PolygonHashi721Bridge = await (await ethers.getContractFactory("Hashi721Bridge")).connect(mumbaiWallet);
  console.log("Deploying PolygonHashi721Bridge 👋");
  const polygonHashi721Bridge = await PolygonHashi721Bridge.deploy();
  await polygonHashi721Bridge.deployed();
  console.log(`deployed to ${polygonHashi721Bridge.address}`);

  const setPolygonInitTx = await polygonHashi721Bridge.initialize(
    polygonMumbaiDomainId,
    polygonMumbaiConnextAddress,
    polygonWrappedHashi.address,
    {
      gasLimit: 3000000,
    }
  );
  const setPolygonInitRec = await setPolygonInitTx.wait();
  console.log(`Initialize txn confirmed on Polygon! 🙌 ${setPolygonInitRec.transactionHash}`);



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
  const updateOpTx = await polygonHashi721Bridge.setBridgeContract(
    optimisticGoerliDomainId,
    optimismHashi721Bridge.address,
    {
      gasLimit: 3000000,
    }
  );
  await updateOpTx.wait();

  console.log(`Updating Polygon Target Address`);
  const updatePolygonTx = await optimismHashi721Bridge.setBridgeContract(
    polygonMumbaiDomainId,
    polygonHashi721Bridge.address,
    {
      gasLimit: 3000000,
    }
  );
  await updatePolygonTx.wait();
  console.log("Counterpart contract addresses set in both contracts 👍");



// Deploy, Mint, Approve Test NFTs
  // Optimism
  const TestOpNFT = await (await ethers.getContractFactory("TestNFT")).connect(optimismWallet);
  console.log("Deploying TestOpNFT 👋");
  const testOpNFT = await TestOpNFT.deploy();
  await testOpNFT.deployed();
  console.log(`deployed to ${testOpNFT.address}`);

  console.log("Approving TestOpNFT");
  const approvedOpTx = await testOpNFT.approve(optimismHashi721Bridge.address, tokenId, {
    gasLimit: 3000000,
  });
  await approvedOpTx.wait();
  console.log("Successfully approved");



  
  console.log(`Setting polygon NFT Implementation`);
  const setPolygonNftImplementationTx = await polygonHashi721Bridge.setNftImplementation(polygonWrappedHashi.address, {
    gasLimit: 3000000,
  });
  await setPolygonNftImplementationTx.wait();



  // Set Constructors on Optimism
  console.log(`Setting Connext Address`);
  const setOpConnextTx = await optimismHashi721Bridge.setConnext(optimisticGoerliConnextAddress, {
    gasLimit: 3000000,
  });
  await setOpConnextTx.wait();

  console.log(`Setting Self Domain`);
  const setOpSelfDomainTx = await optimismHashi721Bridge.setSelfDomain(optimisticGoerliDomainId, {
    gasLimit: 3000000,
  });
  await setOpSelfDomainTx.wait();



  // Bridge from Op to Polygon
  const opConnextAddress = await optimismHashi721Bridge.getConnext();
  console.log(opConnextAddress);

  console.log("Bridge NFT from Optimism to Mumbai");
  const setOpXSendTx = await optimismHashi721Bridge.xSend(
    testOpNFT.address,
    mumbaiWallet.address,
    optimismWallet.address,
    tokenId,
    polygonMumbaiDomainId,
    true,
    {
      gasLimit: 3000000,
    }
  );
  const setOpXSendRec = await setOpXSendTx.wait();
  console.log(`Bridging txn confirmed on L1! 🙌 ${setOpXSendRec.transactionHash}`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
