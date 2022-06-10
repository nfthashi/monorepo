import { task } from "hardhat/config";

task("native-deploy", "deploy native xNFTs contract")
  .addParam("selfDomain", "self domain")
  .addParam("connext", "connext")
  .addParam("dummyTransactingAssetId", "dummy transacting asset id")
  .addParam("startTokenId", "start token id")
  .addParam("endTokenId", "end token id")
  .setAction(async ({ selfDomain, connext, dummyTransactingAssetId, startTokenId, endTokenId }, { ethers }) => {
    const XNativeHashi721Example = await ethers.getContractFactory("NativeHashi721Example");
    const NativeHashi721Example = await XNativeHashi721Example.deploy(
      selfDomain,
      connext,
      dummyTransactingAssetId,
      startTokenId,
      endTokenId,
      "TEST",
      "TEST",
      "https://raw.githubusercontent.com/nfthashi/monorepo/main/packages/web/public/assets/metadata/metadata.json"
    );
    await NativeHashi721Example.deployed();
    console.log("Deployed to: ", NativeHashi721Example.address);
  });
