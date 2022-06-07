import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Oracle } from "../typechain";

describe("Oracle", () => {
  let oracle: Oracle;
  let deployer: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async () => {
    const OracleContract = await ethers.getContractFactory("Oracle");
    oracle = await OracleContract.deploy();
    await oracle.deployed();

    [deployer, addr1] = await ethers.getSigners();
  });

  it("Queue task", async () => {
    await oracle.addToQueue({
      request: {
        url: "https://localhost:8080",
        method: 0,
        payload: "",
        jsonPath: "",
      },
      callbackAddress: ethers.constants.AddressZero,
      callbackSelector: ethers.utils.randomBytes(4),
      completed: false,
      gasUsed: 0,
    });

    const createdTask = await oracle.getTask(1);
    expect(createdTask.request.url).to.equal(
      "https://localhost:8080",
      "Created job should have correct url"
    );
  });

  it("onlyFulfillAllowed modifier", async () => {
    await oracle.addToQueue({
      request: {
        url: "https://localhost:8080",
        method: 0,
        payload: "",
        jsonPath: "",
      },
      callbackAddress: ethers.constants.AddressZero,
      callbackSelector: ethers.utils.randomBytes(4),
      completed: false,
      gasUsed: 0,
    });
    let revertReason;
    try {
      await oracle.connect(addr1).getTask(1);
    } catch ({ reason }) {
      revertReason = reason;
    }
    expect(revertReason).to.equal(
      "This address cannot call this method",
      "Should return correct revert reason"
    );

    await oracle.setFulfillAllowance(addr1.address, true);

    const task = await oracle.connect(addr1).getTask(1);
    expect(task.request.url).to.equal(
      "https://localhost:8080",
      "Should return correct request url of task"
    );
  });

  it("Test onlyOwner and transferOwnership", async () => {
    let error;
    try {
      await oracle.connect(addr1).transferOwnership(deployer.address);
    } catch (e) {
      error = e;
    }
    expect(error, "Error should be defined").to.not.be.undefined;
    error = undefined;
    await oracle.transferOwnership(addr1.address);
    try {
      await oracle.connect(addr1).transferOwnership(deployer.address);
    } catch (e) {
      error = e;
    }
    expect(error, "Error should be undefined").to.be.undefined;
  });
});
