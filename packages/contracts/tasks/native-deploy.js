task("native-deploy", "deploy native xNFTs contract")
  .addParam("selfDomain", "self domain")
  .addParam("connext", "connext")
  .addParam("dummyTransactingAssetId", "dummy transacting asset id")
  .addParam("startTokenId", "start token id")
  .addParam("endTokenId", "end token id")
  .setAction(async ({ selfDomain, connext, dummyTransactingAssetId, startTokenId, endTokenId }) => {
    const XNativeNFT = await ethers.getContractFactory("xNativeNFT");
    const xNativeNFT = await XNativeNFT.deploy(selfDomain, connext, dummyTransactingAssetId, startTokenId, endTokenId);
    await xNativeNFT.deployed();
    console.log("Deployed to: ", xNativeNFT.address);
  });
