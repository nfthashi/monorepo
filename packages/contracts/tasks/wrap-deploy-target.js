task("wrap-deploy-target", "deploy wrap target xNFTs contract")
  .addParam("selfDomain", "self domain")
  .addParam("connext", "connext")
  .addParam("dummyTransactingAssetId", "dummy transacting asset id")
  .setAction(async ({ selfDomain, connext, dummyTransactingAssetId }) => {
    const XNFTTarget = await ethers.getContractFactory("xNFTTarget");
    const xNFTTarget = await XNFTTarget.deploy(selfDomain, connext, dummyTransactingAssetId);
    await xNFTTarget.deployed();
    console.log("Deployed to: ", xNFTTarget.address);
  });
