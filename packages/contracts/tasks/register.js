task("register", "register")
  .addParam("selfContractAddress", "self contract address")
  .addParam("opponentDomain", "opponent domain")
  .addParam("opponentContractAddress", "opponent contract address")
  .setAction(async ({ selfContractAddress, opponentDomain, opponentContractAddress }) => {
    const XNFTBridge = await ethers.getContractFactory("NFTBridge");
    const NFTBridge = await XNFTBridge.attach(selfContractAddress);
    const { hash } = await NFTBridge.setBridgeContract(opponentDomain, opponentContractAddress);
    console.log("Registered at:", hash);
  });
