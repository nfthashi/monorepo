task("native-mint", "mint native xNFTs")
  .addParam("selfContractAddress", "self contract address")
  .addParam("to", "to")

  .setAction(async ({ selfContractAddress, to }) => {
    const XNativeNFT = await ethers.getContractFactory("xNativeNFT");
    const xNativeNFT = await XNativeNFT.attach(selfContractAddress);
    const { hash } = await xNativeNFT.mint(to);
    console.log("Minted at:", hash);
  });
