task("wrap-deploy-implementation", "deploy wrap target xNFTs contract").setAction(async () => {
  const WrappedNFT = await ethers.getContractFactory("WrappedNFT");
  const wrappedNFT = await WrappedNFT.deploy();
  await wrappedNFT.deployed();
  console.log("Deployed to: ", wrappedNFT.address);
});
