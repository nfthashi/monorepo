import { task } from "hardhat/config";

task("test-deploy", "deploy Test ERC721").setAction(async (_,{ ethers }) => {
  const TestERC721 = await ethers.getContractFactory("TestERC721");
  const testERC721 = await TestERC721.deploy();
  await testERC721.deployed();
  console.log("Deployed to: ", testERC721.address);
  return testERC721.address;
});
