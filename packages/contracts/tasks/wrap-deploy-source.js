task("wrap-deploy-source", "deploy wrap source xNFTs contract")
  .addParam("selfDomain", "self domain")
  .addParam("connext", "connext")
  .addParam("dummyTransactingAssetId", "dummy transacting asset id")
  .setAction(async ({ selfDomain, connext, dummyTransactingAssetId }) => {
    const XNFTSource = await ethers.getContractFactory("xNFTSource");
    const xNFTSource = await XNFTSource.deploy(selfDomain, connext, dummyTransactingAssetId);
    await xNFTSource.deployed();
    console.log("Deployed to: ", xNFTSource.address);
  });
