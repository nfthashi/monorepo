task("native-deploy", "deploy native xNFTs contract")
  .addParam("selfDomain", "self domain")
  .addParam("connext", "connext")
  .addParam("dummyTransactingAssetId", "dummy transacting asset id")
  .addParam("startTokenId", "start token id")
  .addParam("endTokenId", "end token id")
  .setAction(async ({ selfDomain, connext, dummyTransactingAssetId, startTokenId, endTokenId }) => {
    const XNativeNFT = await ethers.getContractFactory("NativeNFT");
    const NativeNFT = await XNativeNFT.deploy(selfDomain, connext, dummyTransactingAssetId, startTokenId, endTokenId);
    await NativeNFT.deployed();
    console.log("Deployed to: ", NativeNFT.address);
  });
