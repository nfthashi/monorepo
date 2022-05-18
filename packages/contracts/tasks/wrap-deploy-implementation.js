task("wrap-deploy-implementation", "deploy wrap target xNFTs contract").setAction(async () => {
  const XWrappedNFT = await ethers.getContractFactory("xWrappedNFT");
  const xWrappedNFT = await XWrappedNFT.deploy();
  await xWrappedNFT.deployed();
  console.log("Deployed to: ", xWrappedNFT.address);
});
