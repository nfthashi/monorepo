import { task } from "hardhat/config";

task("native-mint", "mint native xNFTs")
  .addParam("selfContractAddress", "self contract address")
  .addParam("to", "to")
  .setAction(async ({ selfContractAddress, to }, { ethers }) => {
    const XNativeNFT = await ethers.getContractFactory("NativeNFT");
    const NativeNFT = await XNativeNFT.attach(selfContractAddress);
    const { hash } = await NativeNFT.mint(to);
    console.log("Minted at:", hash);
  });
