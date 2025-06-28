import "@nomicfoundation/hardhat-ethers";
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners(); // Get the deployer account

  console.log("Deploying contract with account:", deployer.address);

  // Get the ContractFactory and attach a signer
  const PremiumForwarder = await ethers.getContractFactory(
    "PremiumForwarder",
    deployer
  );
  const pManager = await PremiumForwarder.deploy(
    "0x40E1f2b0263cf92b33Fb4a4367417A23a513063A",
    "0x3Db4466B64173A3d380453278CF11086128e7D4e"
  );

  console.log("Deploying PremiumManager...");

  // Wait for the deployment to complete
  await pManager.waitForDeployment();

  const contractAddress = await pManager.getAddress();
  console.log("PremiumForwarder deployed to:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
