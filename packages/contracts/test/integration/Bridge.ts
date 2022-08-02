import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { ADDRESS_1 } from "../../lib/constant";
import networks from "../../networks.json";
import { Hashi721Bridge, MockNFT } from "../../typechain";

describe("Integration Test for Bridge", function () {
  let signer: SignerWithAddress;

  let hashi721Bridge: Hashi721Bridge;
  let mockNFT: MockNFT;

  beforeEach(async function () {
    [signer] = await ethers.getSigners();

    const WrappedHashi721 = await ethers.getContractFactory("WrappedHashi721");
    const wrappedHashi721 = await WrappedHashi721.deploy();

    const selfDomain = "1111";
    const connextHandlerAddress = networks.rinkeby.contracts.connext;
    const baseTokenURL = "http://localhost:3000/";

    const Hashi721Bridge = await ethers.getContractFactory("Hashi721Bridge");
    hashi721Bridge = await Hashi721Bridge.deploy();
    await hashi721Bridge.initialize(
      selfDomain,
      connextHandlerAddress,
      wrappedHashi721.address
    );

    const MockNFT = await ethers.getContractFactory("MockNFT");
    mockNFT = await MockNFT.deploy(baseTokenURL);
    await mockNFT.mint(signer.address);
    await mockNFT.setApprovalForAll(hashi721Bridge.address, true);
  });

  it("Bridge NFT from Rinkeby to Goerli", async function () {
    const tokenId = "0";
    const sendToDomain = "3331";
    const toContract = ADDRESS_1;
    await hashi721Bridge.setBridgeContract(sendToDomain, toContract);
    await expect(hashi721Bridge.xSend(mockNFT.address, signer.address, ADDRESS_1, tokenId, sendToDomain, true))
      .to.emit(mockNFT, "Transfer")
      .withArgs(signer.address, hashi721Bridge.address, tokenId);
  });
});
