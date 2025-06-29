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
        "0x80Ba88E6EC0b4C228E16DcD2805FF611d2454e6E",
        "0x411b798C0bBE8eFC92B2F6569B7ffb6AE7f50462"
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
