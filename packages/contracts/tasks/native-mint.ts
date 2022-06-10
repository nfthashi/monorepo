import { task } from "hardhat/config";

task("native-mint", "mint native xNFTs")
  .addParam("selfContractAddress", "self contract address")
  .addParam("to", "to")
  .setAction(async ({ selfContractAddress, to }, { ethers }) => {
    const XNativeHashi721Example = await ethers.getContractFactory("NativeHashi721Example");
    const NativeHashi721Example = await XNativeHashi721Example.attach(selfContractAddress);
    const { hash } = await NativeHashi721Example.mint(to);
    console.log("Minted at:", hash);
  });
