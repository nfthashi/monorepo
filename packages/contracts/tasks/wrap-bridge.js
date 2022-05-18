task("wrap-bridge", "bridge native xNFTs")
  .addParam("sourceContractAddress", "self contract address")
  .addParam("originalNftContractAddress", "original nft contract address")
  .addParam("from", "from")
  .addParam("to", "to")
  .addParam("tokenId", "token id")
  .addParam("destinationDomain", "destination domain")
  .setAction(async ({ sourceContractAddress, originalNftContractAddress, from, to, tokenId, destinationDomain }) => {
    const XNFTSource = await ethers.getContractFactory("xNFTSource");
    const xNFTSource = await XNFTSource.attach(sourceContractAddress);

    const ERC721 = await ethers.getContractFactory("ERC721");
    const erc721 = await ERC721.attach(originalNftContractAddress);
    await erc721.setApprovalForAll(sourceContractAddress, true);

    const { hash } = await xNFTSource.xSend(originalNftContractAddress, from, to, tokenId, destinationDomain, {
      gasLimit: 1000000,
    });
    console.log("Bridged at:", hash);
  });
