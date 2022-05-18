task("register", "register")
  .addParam("selfContractAddress", "self contract address")
  .addParam("opponentDomain", "opponent domain")
  .addParam("opponentContractAddress", "opponent contract address")
  .setAction(async ({ selfContractAddress, opponentDomain, opponentContractAddress }) => {
    const XNFTBridge = await ethers.getContractFactory("xNFTBridge");
    const xNFTBridge = await XNFTBridge.attach(selfContractAddress);
    const { hash } = await xNFTBridge.register(opponentDomain, opponentContractAddress);
    console.log("Registered at:", hash);
  });
