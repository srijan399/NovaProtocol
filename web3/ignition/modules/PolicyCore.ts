import "@nomicfoundation/hardhat-ethers";
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners(); // Get the deployer account

  console.log("Deploying contract with account:", deployer.address);

  // Get the ContractFactory and attach a signer
  const PolicyManager = await ethers.getContractFactory(
    "PolicyManager",
    deployer
  );
  const pManager = await PolicyManager.deploy();

  console.log("Deploying PolicyManager...");

  // Wait for the deployment to complete
  await pManager.waitForDeployment();

  const contractAddress = await pManager.getAddress();
  console.log("PolicyManager deployed to:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
