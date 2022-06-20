import { task } from "hardhat/config";

import { isChain } from "../../types/chain";

task("experimental-create-order", "experimental create order")
  .addParam("mockMarketAddress", "mock market address")
  .setAction(async ({ mockMarketAddress }, { ethers, network }) => {
    const { name } = network;
    if (!isChain(name)) {
      console.log("network invalid");
      return;
    }
    const signer = await ethers.provider.getSigner();
    const signerAddresss = await signer.getAddress();

    const MockNFT = await ethers.getContractFactory("MockNFT");
    const mockNFT = await MockNFT.deploy("http://localhost:3000/");

    await mockNFT.mint(signerAddresss);
    await mockNFT.setApprovalForAll(mockMarketAddress, true);

    console.log("Order", {
      nftContractAddress: mockNFT.address,
      from: signerAddresss,
      tokenId: 0,
    });
  });
