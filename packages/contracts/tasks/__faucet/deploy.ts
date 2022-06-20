import { task } from "hardhat/config";

task("deploy", "deploy faucet").setAction(async (_, { ethers }) => {
  const HashiFaucetERC721 = await ethers.getContractFactory("HashiFaucetERC721");
  const hashiFaucetERC721 = await HashiFaucetERC721.deploy();
  await hashiFaucetERC721.deployed();
  console.log("Deployed to: ", hashiFaucetERC721.address);
  return hashiFaucetERC721.address;
});
