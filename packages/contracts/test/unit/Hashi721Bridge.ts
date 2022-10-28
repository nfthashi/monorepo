import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { ADDRESS_1, NULL_ADDRESS } from "../../lib/constant";
import {
  Hashi721Bridge,
  MockClone,
  MockExecutor,
  MockNFT,
  WrappedHashi721,
  WrappedHashi721__factory,
} from "../../typechain";

describe("Unit Test for Hashi721Bridge", function () {
  let signer: SignerWithAddress;
  let malicious: SignerWithAddress;

  let hashi721Bridge: Hashi721Bridge;
  let mockExecutor: MockExecutor;
  let WrappedHashi721: WrappedHashi721__factory;
  let wrappedHashi721: WrappedHashi721;
  let mockNFT: MockNFT;
  let mockClone: MockClone;

  const baseTokenURL = "http://localhost:3000/";

  const selfDomain = "0";
  const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

  beforeEach(async function () {
    [signer, malicious] = await ethers.getSigners();

    const MockConnextHandler = await ethers.getContractFactory("MockConnextHandler");
    const mockConnextHandler = await MockConnextHandler.deploy();

    WrappedHashi721 = await ethers.getContractFactory("WrappedHashi721");
    wrappedHashi721 = await WrappedHashi721.deploy();

    const Hashi721Bridge = await ethers.getContractFactory("Hashi721Bridge");
    hashi721Bridge = await Hashi721Bridge.deploy();
    await hashi721Bridge.initialize(selfDomain, mockConnextHandler.address, wrappedHashi721.address);
    await hashi721Bridge.setConnext(mockConnextHandler.address);
    await hashi721Bridge.setSelfDomain(selfDomain);

    const MockNFT = await ethers.getContractFactory("MockNFT");
    mockNFT = await MockNFT.deploy(baseTokenURL);
    await mockNFT.mint(signer.address);
    await mockNFT.mint(signer.address);
    await mockNFT.setApprovalForAll(hashi721Bridge.address, true);
    const MockClone = await ethers.getContractFactory("MockClone");
    mockClone = await MockClone.deploy();
  });

  it("xSend - sender is in birth chain and other tests", async function () {
    const tokenId_1 = "0";
    const tokenId_2 = "1";

    const sendToDomain = "1";
    const toContract = ADDRESS_1;
    await hashi721Bridge.setBridgeContract(sendToDomain, toContract);
    await hashi721Bridge.setIsAllowListRequired(true);

    await expect(
      hashi721Bridge.xSend(mockNFT.address, signer.address, ADDRESS_1, tokenId_1, sendToDomain, true)
    ).to.revertedWith("Hashi721Bridge: invalid nft");

    console.log("a");

    await hashi721Bridge.setAllowList(mockNFT.address, true);
    await expect(
      hashi721Bridge.connect(malicious).xSend(mockNFT.address, signer.address, ADDRESS_1, tokenId_1, sendToDomain, true)
    ).to.revertedWith("Hashi721Bridge: invalid sender");

    console.log("a");

    await expect(
      hashi721Bridge.xSend(mockNFT.address, malicious.address, ADDRESS_1, tokenId_1, sendToDomain, true)
    ).to.revertedWith("Hashi721Bridge: invalid from");

    console.log(await hashi721Bridge.getConnext());

    // for is token uri included = true
    await expect(hashi721Bridge.xSend(mockNFT.address, signer.address, signer.address, tokenId_1, sendToDomain, true))
      .to.emit(mockNFT, "Transfer")
      .withArgs(signer.address, hashi721Bridge.address, tokenId_1);

    await hashi721Bridge.setAllowList(mockNFT.address, false);
    await hashi721Bridge.setIsAllowListRequired(false);

    console.log("a");

    // for is token uri included = false
    // for allowlist
    await expect(hashi721Bridge.xSend(mockNFT.address, signer.address, ADDRESS_1, tokenId_2, sendToDomain, false))
      .to.emit(mockNFT, "Transfer")
      .withArgs(signer.address, hashi721Bridge.address, tokenId_2);
  });

  // this is separated test because it requires receiving asset first
  it("xSend - sender is not in birth chain", async function () {
    const tokenId = "0";

    const birthDomain = "1";

    const fromDomain = birthDomain;
    const fromContract = ADDRESS_1;

    await hashi721Bridge.setBridgeContract(fromDomain, fromContract);
    await mockExecutor.setOriginSender(fromContract);
    await mockExecutor.setOrigin(fromDomain);

    const data = hashi721Bridge.interface.encodeFunctionData("xReceive", [
      mockNFT.address,
      signer.address,
      tokenId,
      birthDomain,
      baseTokenURL,
    ]);

    await mockExecutor.execute(hashi721Bridge.address, data);
    const salt = ethers.utils.solidityKeccak256(["uint32", "address"], [birthDomain, mockNFT.address]);
    const deployedContractAddress = await mockClone.predictDeterministicAddress(
      wrappedHashi721.address,
      salt,
      hashi721Bridge.address
    );
    const deployedContract = WrappedHashi721.attach(deployedContractAddress);

    await expect(hashi721Bridge.xSend(deployedContract.address, signer.address, ADDRESS_1, tokenId, fromDomain, true))
      .to.emit(deployedContract, "Transfer")
      .withArgs(signer.address, NULL_ADDRESS, tokenId);
  });

  it("xReceive - receiver is in birth chain", async function () {
    const tokenId = "0";

    await mockNFT.transferFrom(signer.address, hashi721Bridge.address, tokenId);

    const birthDomain = selfDomain;

    const fromDomain = "1";
    const fromContract = ADDRESS_1;

    await hashi721Bridge.setBridgeContract(fromDomain, fromContract);
    await mockExecutor.setOriginSender(fromContract);
    await mockExecutor.setOrigin(fromDomain);

    const data_1 = hashi721Bridge.interface.encodeFunctionData("xReceive", [
      mockNFT.address,
      signer.address,
      tokenId,
      birthDomain,
      baseTokenURL,
    ]);
    await mockExecutor.execute(hashi721Bridge.address, data_1);
    expect(await mockNFT.ownerOf(tokenId)).to.equal(signer.address);
  });

  it("xReceive - receiver is not in birth chain", async function () {
    const tokenId_1 = "0";

    const birthDomain = "1";
    const fromDomain = "2";
    const fromContract = ADDRESS_1;
    const trunsferId = ethers.utils.solidityKeccak256(["uint256"], ["0"]);
    const mockAmount = "0";

    await hashi721Bridge.setBridgeContract(fromDomain, fromContract);
    await hashi721Bridge.setConnext(signer.address);

    const abi = ethers.utils.defaultAbiCoder;
    const data_A = abi.encode(
      ["address", "address", "uint256", "uint32", "string"],
      [mockNFT.address, signer.address, tokenId_1, birthDomain, baseTokenURL]
    );
    console.log(trunsferId, mockAmount, ADDRESS_ZERO, fromContract, fromDomain, data_A);
    await hashi721Bridge.xReceive(trunsferId, mockAmount, ADDRESS_ZERO, fromContract, fromDomain, data_A);

    const salt = ethers.utils.solidityKeccak256(["uint32", "address"], [birthDomain, mockNFT.address]);
    const deployedContractAddress = await mockClone.predictDeterministicAddress(
      wrappedHashi721.address,
      salt,
      hashi721Bridge.address
    );
    const deployedContract = wrappedHashi721.attach(deployedContractAddress);
    expect(await deployedContract.ownerOf(tokenId_1)).to.equal(signer.address);
  });
});
