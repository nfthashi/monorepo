import { task } from "hardhat/config";

task("native-deploy", "deploy native xNFTs contract")
  .addParam("selfDomain", "self domain")
  .addParam("connext", "connext")
  .addParam("dummyTransactingAssetId", "dummy transacting asset id")
  .addParam("startTokenId", "start token id")
  .addParam("endTokenId", "end token id")
  .setAction(async ({ selfDomain, connext, dummyTransactingAssetId, startTokenId, endTokenId }, { ethers }) => {
    const XNativeHashi721 = await ethers.getContractFactory("NativeHashi721");
    const NativeHashi721 = await XNativeHashi721.deploy(
      selfDomain,
      connext,
      dummyTransactingAssetId,
      startTokenId,
      endTokenId,
      "TEST",
      "TEST",
      "https://raw.githubusercontent.com/nfthashi/monorepo/main/packages/web/public/assets/metadata/metadata.json"
    );
    await NativeHashi721.deployed();
    console.log("Deployed to: ", NativeHashi721.address);
  });
