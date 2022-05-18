task("wrap", "wrap at target contract")
  .addParam("targetContractAddress", "target contract address")
  .addParam("originDomain", "origin domain")
  .addParam("originSender", "origin sender")
  .addParam("originalNftContractAddress", "original nft contract address")
  .setAction(async ({ targetContractAddress, originDomain, originSender, originalNftContractAddress }) => {
    const XNFTTarget = await ethers.getContractFactory("xNFTTarget");
    const xNFTTarget = await XNFTTarget.attach(targetContractAddress);
    const { hash } = await xNFTTarget.wrap(originDomain, originSender, originalNftContractAddress);
    console.log("Registered at:", hash);
  });
