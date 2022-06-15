import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { ADDRESS_1, NULL_ADDRESS } from "../lib/constant";
import { MockExecutor, NativeHashi721 } from "../typechain";

describe("NativeHashi721", function () {
  let signer: SignerWithAddress;
  let malicious: SignerWithAddress;

  let nativeHashi721: NativeHashi721;
  let mockExecutor: MockExecutor;

  const selfDomain = "0";
  const opponentDomain = "1";
  const opponentContract = ADDRESS_1;
  const dummyTransactingAssetId = ADDRESS_1;
  const name = "name";
  const symbol = "symbol";

  beforeEach(async function () {
    [signer, malicious] = await ethers.getSigners();

    const MockConnextHandler = await ethers.getContractFactory("MockConnextHandler");
    const mockConnextHandler = await MockConnextHandler.deploy();
    const MockExecutor = await ethers.getContractFactory("MockExecutor");
    mockExecutor = await MockExecutor.deploy();
    await mockExecutor.setOriginSender(opponentContract);
    await mockExecutor.setOrigin(opponentDomain);
    await mockConnextHandler.setExecutor(mockExecutor.address);
    const NativeHashi721 = await ethers.getContractFactory("NativeHashi721");
    nativeHashi721 = await NativeHashi721.deploy(
      selfDomain,
      mockConnextHandler.address,
      dummyTransactingAssetId,
      name,
      symbol
    );
    await nativeHashi721.setBridgeContract(opponentDomain, opponentContract);
  });

  it("xReceive", async function () {
    const tokenId = 0;
    const data = nativeHashi721.interface.encodeFunctionData("xReceive", [signer.address, tokenId]);
    await mockExecutor.execute(nativeHashi721.address, data);
    expect(await nativeHashi721.ownerOf(tokenId)).to.equal(signer.address);
  });

  it("xSend", async function () {
    const tokenId = 0;
    const data = nativeHashi721.interface.encodeFunctionData("xReceive", [signer.address, tokenId]);
    await mockExecutor.execute(nativeHashi721.address, data);

    await expect(
      nativeHashi721.connect(malicious).xSend(signer.address, ADDRESS_1, tokenId, opponentDomain)
    ).to.revertedWith("NativeHashi721: invalid sender");

    await expect(nativeHashi721.xSend(malicious.address, ADDRESS_1, tokenId, opponentDomain)).to.revertedWith(
      "NativeHashi721: invalid from"
    );

    await expect(nativeHashi721.xSend(signer.address, ADDRESS_1, tokenId, opponentDomain))
      .to.emit(nativeHashi721, "Transfer")
      .withArgs(signer.address, NULL_ADDRESS, tokenId);
  });

  it("isNativeHashi721", async function () {
    expect(await nativeHashi721.isNativeHashi721()).to.equal(true);
  });

  it("supportsInterface", async function () {
    const nativeHashi721InterfaceId = "0x01c831d2";
    const erc721InterfaceId = "0x80ac58cd";
    expect(await nativeHashi721.supportsInterface(nativeHashi721InterfaceId)).to.equal(true);
    expect(await nativeHashi721.supportsInterface(erc721InterfaceId)).to.equal(true);
  });
});
