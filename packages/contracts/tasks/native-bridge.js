task("native-bridge", "bridge native xNFTs")
  .addParam("sourceContractAddress", "self contract address")
  .addParam("from", "from")
  .addParam("to", "to")
  .addParam("tokenId", "token id")
  .addParam("destinationDomain", "destination domain")
  .setAction(async ({ sourceContractAddress, from, to, tokenId, destinationDomain }) => {
    const XNativeNFT = await ethers.getContractFactory("NativeNFT");
    const NativeNFT = await XNativeNFT.attach(sourceContractAddress);
    const { hash } = await NativeNFT.xSend(from, to, tokenId, destinationDomain, { gasLimit: 1000000 });
    console.log("Bridged at:", hash);
  });
