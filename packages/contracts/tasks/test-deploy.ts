import { task } from "hardhat/config";

task("test-deploy", "deploy Test ERC721").setAction(async (_,{ ethers }) => {
  const XTestERC721 = await ethers.getContractFactory("TestERC721");
  const TestERC721 = await XTestERC721.deploy();
  await TestERC721.deployed();
  console.log("Deployed to: ", TestERC721.address);
  return TestERC721.address;
});
