import { task } from "hardhat/config";

task("native-bridge", "bridge native xNFTs")
  .addParam("sourceContractAddress", "self contract address")
  .addParam("from", "from")
  .addParam("to", "to")
  .addParam("tokenId", "token id")
  .addParam("destinationDomain", "destination domain")
  .setAction(async ({ sourceContractAddress, from, to, tokenId, destinationDomain }, { ethers }) => {
    const XNativeHashi721Example = await ethers.getContractFactory("NativeHashi721Example");
    const NativeHashi721Example = await XNativeHashi721Example.attach(sourceContractAddress);
    const { hash } = await NativeHashi721Example.xSend(from, to, tokenId, destinationDomain, { gasLimit: 1000000 });
    console.log("Bridged at:", hash);
  });
