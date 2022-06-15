import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { ADDRESS_1, NULL_ADDRESS } from "../lib/constant";

describe("Hashi721Bridge", function () {
  let signer: SignerWithAddress;
  let malicious: SignerWithAddress;

  let Hashi721Bridge: any;
  let mockExecutor: any;
  let XWrappedHashi721: any;
  let WrappedHashi721: any;
  let mockNFT: any;
  let mockClone: any;

  let mockERC165: any;
  const baseTokenURL = "http://localhost:3000/";

  const selfDomain = "0";
  const dummyTransactingAssetId = ADDRESS_1;

  beforeEach(async function () {
    [signer, malicious] = await ethers.getSigners();

    const MockConnextHandler = await ethers.getContractFactory("MockConnextHandler");
    const mockConnextHandler = await MockConnextHandler.deploy();

    const MockExecutor = await ethers.getContractFactory("MockExecutor");
    mockExecutor = await MockExecutor.deploy();
    await mockConnextHandler.setExecutor(mockExecutor.address);

    XWrappedHashi721 = await ethers.getContractFactory("WrappedHashi721");
    WrappedHashi721 = await XWrappedHashi721.deploy();

    const XHashi721Bridge = await ethers.getContractFactory("Hashi721Bridge");
    Hashi721Bridge = await XHashi721Bridge.deploy(
      selfDomain,
      mockConnextHandler.address,
      dummyTransactingAssetId,
      WrappedHashi721.address
    );

    const MockERC165 = await ethers.getContractFactory("MockERC165");
    mockERC165 = await MockERC165.deploy();

    const MockNFT = await ethers.getContractFactory("MockNFT");
    mockNFT = await MockNFT.deploy(baseTokenURL);
    await mockNFT.mint(signer.address);
    await mockNFT.mint(signer.address);
    await mockNFT.setApprovalForAll(Hashi721Bridge.address, true);
    const MockClone = await ethers.getContractFactory("MockClone");
    mockClone = await MockClone.deploy();
  });

  it("xSend - sender is in birth chain and other tests", async function () {
    const tokenId_1 = "0";
    const tokenId_2 = "1";

    const sendToDomain = "1";
    const toContract = ADDRESS_1;
    await Hashi721Bridge.setBridgeContract(sendToDomain, toContract);

    await expect(
      Hashi721Bridge.xSend(mockERC165.address, signer.address, ADDRESS_1, tokenId_1, sendToDomain, true)
    ).to.revertedWith("Hashi721Bridge: invalid nft");

    await expect(
      Hashi721Bridge.connect(malicious).xSend(mockNFT.address, signer.address, ADDRESS_1, tokenId_1, sendToDomain, true)
    ).to.revertedWith("Hashi721Bridge: invalid sender");

    await expect(
      Hashi721Bridge.xSend(mockNFT.address, malicious.address, ADDRESS_1, tokenId_1, sendToDomain, true)
    ).to.revertedWith("Hashi721Bridge: invalid from");

    // for is token uri included = true
    await expect(Hashi721Bridge.xSend(mockNFT.address, signer.address, ADDRESS_1, tokenId_1, sendToDomain, true))
      .to.emit(mockNFT, "Transfer")
      .withArgs(signer.address, Hashi721Bridge.address, tokenId_1);

    // for is token uri included = false
    await expect(Hashi721Bridge.xSend(mockNFT.address, signer.address, ADDRESS_1, tokenId_2, sendToDomain, false))
      .to.emit(mockNFT, "Transfer")
      .withArgs(signer.address, Hashi721Bridge.address, tokenId_2);
  });

  // this is separated test because it requires receiving asset first
  it("xSend - sender is not in birth chain", async function () {
    const tokenId = "0";

    const birthDomain = "1";

    const fromDomain = birthDomain;
    const fromContract = ADDRESS_1;

    await Hashi721Bridge.setBridgeContract(fromDomain, fromContract);

    await mockExecutor.setOriginSender(fromContract);
    await mockExecutor.setOrigin(fromDomain);

    const data = Hashi721Bridge.interface.encodeFunctionData("xReceive", [
      mockNFT.address,
      signer.address,
      tokenId,
      birthDomain,
      baseTokenURL,
    ]);

    await mockExecutor.execute(Hashi721Bridge.address, data);
    const salt = ethers.utils.solidityKeccak256(["uint32", "address"], [birthDomain, mockNFT.address]);
    const deployedContractAddress = await mockClone.predictDeterministicAddress(
      WrappedHashi721.address,
      salt,
      Hashi721Bridge.address
    );
    const deployedContract = XWrappedHashi721.attach(deployedContractAddress);

    await expect(Hashi721Bridge.xSend(deployedContract.address, signer.address, ADDRESS_1, tokenId, fromDomain, true))
      .to.emit(deployedContract, "Transfer")
      .withArgs(signer.address, NULL_ADDRESS, tokenId);
  });

  it("xReceive - receiver is in birth chain", async function () {
    const tokenId = "0";

    await mockNFT.transferFrom(signer.address, Hashi721Bridge.address, tokenId);

    const birthDomain = selfDomain;

    const fromDomain = "1";
    const fromContract = ADDRESS_1;

    await Hashi721Bridge.setBridgeContract(fromDomain, fromContract);
    await mockExecutor.setOriginSender(fromContract);
    await mockExecutor.setOrigin(fromDomain);

    const data_1 = Hashi721Bridge.interface.encodeFunctionData("xReceive", [
      mockNFT.address,
      signer.address,
      tokenId,
      birthDomain,
      baseTokenURL,
    ]);
    await mockExecutor.execute(Hashi721Bridge.address, data_1);
    expect(await mockNFT.ownerOf(tokenId)).to.equal(signer.address);
  });

  it("xReceive - receiver is not in birth chain", async function () {
    const tokenId_1 = "0";
    const tokenId_2 = "1";

    const birthDomain = "1";

    const fromDomain = "2";
    const fromContract = ADDRESS_1;

    await Hashi721Bridge.setBridgeContract(fromDomain, fromContract);

    await mockExecutor.setOriginSender(fromContract);
    await mockExecutor.setOrigin(fromDomain);

    const data_1 = Hashi721Bridge.interface.encodeFunctionData("xReceive", [
      mockNFT.address,
      signer.address,
      tokenId_1,
      birthDomain,
      baseTokenURL,
    ]);
    await mockExecutor.execute(Hashi721Bridge.address, data_1);

    const data_2 = Hashi721Bridge.interface.encodeFunctionData("xReceive", [
      mockNFT.address,
      signer.address,
      tokenId_2,
      birthDomain,
      baseTokenURL,
    ]);
    await mockExecutor.execute(Hashi721Bridge.address, data_2);
    const salt = ethers.utils.solidityKeccak256(["uint32", "address"], [birthDomain, mockNFT.address]);
    const deployedContractAddress = await mockClone.predictDeterministicAddress(
      WrappedHashi721.address,
      salt,
      Hashi721Bridge.address
    );
    const deployedContract = XWrappedHashi721.attach(deployedContractAddress);
    expect(await deployedContract.ownerOf(tokenId_1)).to.equal(signer.address);
    expect(await deployedContract.ownerOf(tokenId_2)).to.equal(signer.address);
  });
});