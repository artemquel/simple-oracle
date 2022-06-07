// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const OracleContract = await ethers.getContractFactory("Oracle");
  const oracle = await OracleContract.deploy();
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

  const simpleOracleClient = await SimpleOracleClient.deploy(oracle.address);
  await simpleOracleClient.deployed();

  console.log("Oracle address:", oracle.address);
  console.log("Client address:", simpleOracleClient.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
