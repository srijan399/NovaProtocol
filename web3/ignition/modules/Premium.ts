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
        "0x0e6376582D0edad3d08482Fe46ce1c5f0E2f7023",
        "0xF4D06cDDAD6a5bB12246769Cd64eA04586d885b6"
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
