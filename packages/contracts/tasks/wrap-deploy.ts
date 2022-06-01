import { task } from "hardhat/config";

task("wrap-deploy", "deploy wrap target xNFTs contract")
  .addParam("selfDomain", "self domain")
  .addParam("connext", "connext")
  .addParam("dummyTransactingAssetId", "dummy transacting asset id")
  .addParam("nftImplementation", "nft implementation")
  .setAction(async ({ selfDomain, connext, dummyTransactingAssetId, nftImplementation }, { ethers }) => {
    const NFTWrapBridge = await ethers.getContractFactory("NFTWrapBridge");
    const nftWrapBridge = await NFTWrapBridge.deploy(selfDomain, connext, dummyTransactingAssetId, nftImplementation);
    await nftWrapBridge.deployed();
    console.log("Deployed to: ", nftWrapBridge.address);
    return nftWrapBridge.address;
  });
