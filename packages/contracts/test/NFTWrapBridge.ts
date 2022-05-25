import { expect } from "chai";
import { ethers } from "hardhat";
import { NULL_ADDRESS, ADDRESS_1 } from "../lib/constant";

describe("NativeNFT", function () {
  let NFTWrapBridge: any;
  let mockExecuter: any;
  let XWrappedNFT: any;
  let WrappedNFT: any;
  let mockNFT: any;
  let mockClone: any;
  let signer: any;

  const startTokenId = 0;

  const selfDomain = "0";
  const dummyTransactingAssetId = ADDRESS_1;

  beforeEach(async function () {
    [signer] = await ethers.getSigners();

    const MockConnextHandler = await ethers.getContractFactory("MockConnextHandler");
    const mockConnextHandler = await MockConnextHandler.deploy();

    const MockExecuter = await ethers.getContractFactory("MockExecuter");
    mockExecuter = await MockExecuter.deploy();
    await mockConnextHandler.setExecuter(mockExecuter.address);

    XWrappedNFT = await ethers.getContractFactory("WrappedNFT");
    WrappedNFT = await XWrappedNFT.deploy();

    const XNFTWrapBridge = await ethers.getContractFactory("NFTWrapBridge");
    NFTWrapBridge = await XNFTWrapBridge.deploy(
      selfDomain,
      mockConnextHandler.address,
      dummyTransactingAssetId,
      WrappedNFT.address
    );

    const MockNFT = await ethers.getContractFactory("MockNFT");
    mockNFT = await MockNFT.deploy();
    await mockNFT.mint(signer.address);
    await mockNFT.setApprovalForAll(NFTWrapBridge.address, true);

    const MockClone = await ethers.getContractFactory("MockClone");
    mockClone = await MockClone.deploy();
  });

  it("xSend - sender is in birth chain", async function () {
    const tokenId = startTokenId;

    const sendToDomain = "1";
    const toContract = ADDRESS_1;

    await NFTWrapBridge.setBridgeContract(sendToDomain, toContract);
    await expect(NFTWrapBridge.xSend(mockNFT.address, signer.address, ADDRESS_1, tokenId, sendToDomain))
      .to.emit(mockNFT, "Transfer")
      .withArgs(signer.address, NFTWrapBridge.address, tokenId);
  });

  it("xSend - sender is not in birth chain", async function () {
    const tokenId = startTokenId;

    const birthDomain = "1";

    const fromDomain = birthDomain;
    const fromContract = ADDRESS_1;

    const sendToDomain = selfDomain;

    await NFTWrapBridge.setBridgeContract(fromDomain, fromContract);

    await mockExecuter.setOriginSender(fromContract);
    await mockExecuter.setOrigin(fromDomain);

    const data = NFTWrapBridge.interface.encodeFunctionData("xReceive", [
      mockNFT.address,
      signer.address,
      tokenId,
      birthDomain,
      sendToDomain,
    ]);

    await mockExecuter.execute(NFTWrapBridge.address, data);
    const salt = ethers.utils.solidityKeccak256(["uint32", "address"], [birthDomain, mockNFT.address]);
    const deployedContractAddress = await mockClone.predictDeterministicAddress(
      WrappedNFT.address,
      salt,
      NFTWrapBridge.address
    );
    const deployedContract = XWrappedNFT.attach(deployedContractAddress);

    await expect(NFTWrapBridge.xSend(deployedContract.address, signer.address, ADDRESS_1, tokenId, fromDomain))
      .to.emit(mockNFT, "Transfer")
      .withArgs(signer.address, NULL_ADDRESS, tokenId);
  });

  it("xReceive - receiver is not in birth chain", async function () {
    const tokenId = startTokenId;

    const birthDomain = "1";

    const fromDomain = "2";
    const fromContract = ADDRESS_1;

    const sendToDomain = selfDomain;

    await NFTWrapBridge.setBridgeContract(fromDomain, fromContract);

    await mockExecuter.setOriginSender(fromContract);
    await mockExecuter.setOrigin(fromDomain);

    const data = NFTWrapBridge.interface.encodeFunctionData("xReceive", [
      mockNFT.address,
      signer.address,
      tokenId,
      birthDomain,
      sendToDomain,
    ]);
    await mockExecuter.execute(NFTWrapBridge.address, data);
    const salt = ethers.utils.solidityKeccak256(["uint32", "address"], [birthDomain, mockNFT.address]);
    const deployedContractAddress = await mockClone.predictDeterministicAddress(
      WrappedNFT.address,
      salt,
      NFTWrapBridge.address
    );
    const deployedContract = XWrappedNFT.attach(deployedContractAddress);
    expect(await deployedContract.ownerOf(tokenId)).to.equal(signer.address);
  });

  it("xReceive - receiver is in birth chain - unwrap", async function () {
    const tokenId = startTokenId;
    await mockNFT.transferFrom(signer.address, NFTWrapBridge.address, tokenId);

    const birthDomain = selfDomain;

    const fromDomain = "1";
    const fromContract = ADDRESS_1;

    const sendToDomain = selfDomain;

    await NFTWrapBridge.setBridgeContract(fromDomain, fromContract);
    await mockExecuter.setOriginSender(fromContract);
    await mockExecuter.setOrigin(fromDomain);

    const data = NFTWrapBridge.interface.encodeFunctionData("xReceive", [
      mockNFT.address,
      signer.address,
      tokenId,
      birthDomain,
      sendToDomain,
    ]);
    await mockExecuter.execute(NFTWrapBridge.address, data);
    expect(await mockNFT.ownerOf(tokenId)).to.equal(signer.address);
  });

  it("xReceive - receiver is in birth chain - proxy", async function () {
    const tokenId = startTokenId;
    await mockNFT.transferFrom(signer.address, NFTWrapBridge.address, tokenId);

    const birthDomain = selfDomain;

    const fromDomain = "1";
    const fromContract = ADDRESS_1;

    const sendToDomain = "2";
    const toContract = ADDRESS_1;

    await NFTWrapBridge.setBridgeContract(fromDomain, fromContract);
    await NFTWrapBridge.setBridgeContract(sendToDomain, toContract);
    await mockExecuter.setOriginSender(fromContract);
    await mockExecuter.setOrigin(fromDomain);

    const data = NFTWrapBridge.interface.encodeFunctionData("xReceive", [
      mockNFT.address,
      signer.address,
      tokenId,
      birthDomain,
      sendToDomain,
    ]);
    await mockExecuter.execute(NFTWrapBridge.address, data);
    expect(await mockNFT.ownerOf(tokenId)).to.equal(NFTWrapBridge.address);
  });
});
