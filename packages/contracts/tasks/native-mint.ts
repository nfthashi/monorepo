import { task } from "hardhat/config";

task("native-mint", "mint native xNFTs")
  .addParam("selfContractAddress", "self contract address")
  .addParam("to", "to")
  .setAction(async ({ selfContractAddress, to }, { ethers }) => {
    const NativeHashi721Example = await ethers.getContractFactory("NativeHashi721Example");
    const nativeHashi721Example = await NativeHashi721Example.attach(selfContractAddress);
    const { hash } = await nativeHashi721Example.mint(to);
    console.log("Minted at:", hash);
  });
