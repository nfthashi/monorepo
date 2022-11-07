import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumberish, Contract } from "ethers";
import { ethers, upgrades } from "hardhat";

import { ADDRESS_1, ADDRESS_2 } from "../../lib/constant";
import { TimelockController } from "../../typechain";

describe.only("Integration Test for Timelock Upgrade", function () {
  let signer: SignerWithAddress;

  let hashi721Bridge: Contract; 
  let timelockController: TimelockController;
  let minTime: BigNumberish;
  const NULL_DATA = "0x0000000000000000000000000000000000000000000000000000000000000000";
  const proxyAdminAddress = "0x9308CbD733A2922fb052a6aa3957D53c4b61a02f";

  beforeEach(async function () {
    [signer] = await ethers.getSigners();

    const selfDomain = "0";
    minTime = "2";
    const proposers = [signer.address];
    const executors = [signer.address];

    const Hashi721Bridge = await ethers.getContractFactory("Hashi721Bridge");
    hashi721Bridge = await upgrades.deployProxy(Hashi721Bridge, [selfDomain, ADDRESS_1, ADDRESS_1], {
      initializer: "initialize",
    });
    console.log("Proxy Address at: ", hashi721Bridge.address);

    const TimelockController = await ethers.getContractFactory("TimelockController");
    timelockController = await TimelockController.deploy(minTime, proposers, executors);

    await hashi721Bridge.transferOwnership(timelockController.address);
  });

  it("Upgrade contract", async function () {
    const count = "32";
    const proxyAdmin = await ethers.getContractAt("ProxyAdmin", proxyAdminAddress);
    await proxyAdmin.transferOwnership(timelockController.address);

    const MockHashi721BridgeV2 = await ethers.getContractFactory("MockHashi721BridgeV2");
    const mockHashi721BridgeV2Address = await upgrades.prepareUpgrade(hashi721Bridge.address, MockHashi721BridgeV2);
    console.log("New Implementation Address at:", mockHashi721BridgeV2Address);
    const data = proxyAdmin.interface.encodeFunctionData("upgrade", [
      hashi721Bridge.address,
      mockHashi721BridgeV2Address,
    ]);
    await expect(timelockController.schedule(proxyAdminAddress, "0", data, NULL_DATA, NULL_DATA, minTime)).to.emit(
      timelockController,
      "CallScheduled"
    );
    await expect(timelockController.execute(proxyAdminAddress, "0", data, NULL_DATA, NULL_DATA)).to.revertedWith(
      "TimelockController: operation is not ready"
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await timelockController.execute(proxyAdminAddress, "0", data, NULL_DATA, NULL_DATA);
    const mockHashi721BridgeV2 = MockHashi721BridgeV2.attach(hashi721Bridge.address);
    expect(await mockHashi721BridgeV2.getConnext()).to.equal(ADDRESS_1);
    await mockHashi721BridgeV2.inc(count);
    expect(await mockHashi721BridgeV2.count()).to.equal(count);
  });

  it("Call onlyOwner functions", async function () {
    const data = hashi721Bridge.interface.encodeFunctionData("setConnext", [ADDRESS_2]);

    await expect(timelockController.schedule(hashi721Bridge.address, "0", data, NULL_DATA, NULL_DATA, minTime)).to.emit(
      timelockController,
      "CallScheduled"
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await timelockController.execute(hashi721Bridge.address, "0", data, NULL_DATA, NULL_DATA);
    expect(await hashi721Bridge.getConnext()).to.equal(ADDRESS_2);
  });
});
