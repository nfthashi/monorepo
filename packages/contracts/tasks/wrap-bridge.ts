import { task } from "hardhat/config";

task("wrap-bridge", "bridge native xNFTs")
  .addParam("sourceContractAddress", "self contract address")
  .addParam("originalNftContractAddress", "original nft contract address")
  .addParam("from", "from")
  .addParam("to", "to")
  .addParam("tokenId", "token id")
  .addParam("destinationDomain", "destination domain")
  .setAction(
    async ({ sourceContractAddress, originalNftContractAddress, from, to, tokenId, destinationDomain }, { ethers }) => {
      const [signer] = await ethers.getSigners();

      const NFTWrapBridge = await ethers.getContractFactory("NFTWrapBridge");
      const nftWrapBridge = await NFTWrapBridge.attach(sourceContractAddress);

      const ERC721 = await ethers.getContractFactory("ERC721");
      const erc721 = await ERC721.attach(originalNftContractAddress);

      const isApprovedForAll = await erc721.isApprovedForAll(signer.address, sourceContractAddress);
      if (!isApprovedForAll) {
        await erc721.setApprovalForAll(sourceContractAddress, true);
      }
      const { hash } = await nftWrapBridge.xSend(originalNftContractAddress, from, to, tokenId, destinationDomain, {
        gasLimit: 1000000,
      });
      console.log("Bridged at:", hash);
    }
  );
