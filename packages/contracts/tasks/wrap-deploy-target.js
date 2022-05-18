task("wrap-deploy-target", "deploy wrap target xNFTs contract")
  .addParam("selfDomain", "self domain")
  .addParam("connext", "connext")
  .addParam("dummyTransactingAssetId", "dummy transacting asset id")
  .addParam("nftImplementation", "nft implementation")
  .setAction(async ({ selfDomain, connext, dummyTransactingAssetId, nftImplementation }) => {
    const XNFTTarget = await ethers.getContractFactory("xNFTTarget");
    const xNFTTarget = await XNFTTarget.deploy(selfDomain, connext, dummyTransactingAssetId, nftImplementation);
    await xNFTTarget.deployed();
    console.log("Deployed to: ", xNFTTarget.address);
  });
