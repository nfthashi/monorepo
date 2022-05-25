task("wrap-deploy-implementation", "deploy wrap target xNFTs contract").setAction(async () => {
  const XWrappedNFT = await ethers.getContractFactory("WrappedNFT");
  const WrappedNFT = await XWrappedNFT.deploy();
  await WrappedNFT.deployed();
  console.log("Deployed to: ", WrappedNFT.address);
});
