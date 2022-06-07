import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Oracle, OracleExtensions, SimpleOracleClient } from "../typechain";
import { ethers } from "hardhat";

describe("Oracle client", () => {
  let oracle: Oracle;
  let simpleOracleClient: SimpleOracleClient;
  let deployer: SignerWithAddress;

  beforeEach(async () => {
    const OracleContract = await ethers.getContractFactory("Oracle");
    oracle = await OracleContract.deploy();
    await oracle.deployed();

    const OracleExtensionsLibrary = await ethers.getContractFactory(
      "OracleExtensions"
    );
    const oracleExtensionsLibrary = await OracleExtensionsLibrary.deploy();
    await oracleExtensionsLibrary.deployed();

    const SimpleOracleClient = await ethers.getContractFactory(
      "SimpleOracleClient",
      {
        libraries: {
          OracleExtensions: oracleExtensionsLibrary.address,
        },
      }
    );

    simpleOracleClient = await SimpleOracleClient.deploy(oracle.address);
    await simpleOracleClient.deployed();

    [deployer] = await ethers.getSigners();
  });

  it("Add request", async () => {
    await simpleOracleClient.testRequest();

    const createdJob = await oracle.getTask(1);

    expect(createdJob.request.url).to.equal(
      "https://my-json-server.typicode.com/typicode/demo/profile",
      "Created job should have correct url"
    );
    expect(createdJob.request.jsonPath).to.equal(
      "$.name",
      "Created job should have correct json path"
    );
  });

  it("Add request and fulfill result", async () => {
    await simpleOracleClient.testRequest();
    await oracle.fulfill(1, "test response");
    expect(await simpleOracleClient.getFulfillResult()).to.equal(
      "test response"
    );
  });
});
