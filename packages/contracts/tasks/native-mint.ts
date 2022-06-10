import { task } from "hardhat/config";

task("native-mint", "mint native xNFTs")
  .addParam("selfContractAddress", "self contract address")
  .addParam("to", "to")
  .setAction(async ({ selfContractAddress, to }, { ethers }) => {
    const XNativeHashi721 = await ethers.getContractFactory("NativeHashi721");
    const NativeHashi721 = await XNativeHashi721.attach(selfContractAddress);
    const { hash } = await NativeHashi721.mint(to);
    console.log("Minted at:", hash);
  });
