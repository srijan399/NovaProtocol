import "@nomicfoundation/hardhat-ethers";
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners(); // Get the deployer account

  console.log("Deploying contract with account:", deployer.address);

  // Get the ContractFactory and attach a signer
  const YieldPool = await ethers.getContractFactory("YieldPool", deployer);
  const yieldManager = await YieldPool.deploy();

  console.log("Deploying PolicyManager...");

  // Wait for the deployment to complete
  await yieldManager.waitForDeployment();

  const contractAddress = await yieldManager.getAddress();
  console.log("YieldPool deployed to:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
