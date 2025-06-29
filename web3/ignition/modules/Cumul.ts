import "@nomicfoundation/hardhat-ethers";
import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners(); // Get the deployer account

    console.log("Deploying contract with account:", deployer.address);

    // Deploy PolicyManager
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

    // Deploy YieldPool
    const YieldPool = await ethers.getContractFactory("YieldPool", deployer);
    const yieldManager = await YieldPool.deploy();

    console.log("Deploying YieldPool...");

    // Wait for the deployment to complete
    await yieldManager.waitForDeployment();

    const yieldContractAddress = await yieldManager.getAddress();
    console.log("YieldPool deployed to:", yieldContractAddress);

    // Deploy PremiumForwarder
    const PremiumForwarder = await ethers.getContractFactory(
        "PremiumForwarder",
        deployer
    );
    const premiumManager = await PremiumForwarder.deploy(
        contractAddress,
        yieldContractAddress
    );

    console.log("Deploying PremiumForwarder...");

    // Wait for the deployment to complete
    await premiumManager.waitForDeployment();

    const premiumContractAddress = await premiumManager.getAddress();
    console.log("PremiumForwarder deployed to:", premiumContractAddress);

    // Set PremiumForwarder address in PolicyManager
    console.log("Setting PremiumForwarder address in PolicyManager...");
    await pManager.setPremiumForwarder(premiumContractAddress);
    console.log("PremiumForwarder address set in PolicyManager");

    // Set PremiumForwarder address in YieldPool
    console.log("Setting PremiumForwarder address in YieldPool...");
    await yieldManager.setPremiumForwarder(premiumContractAddress);
    console.log("PremiumForwarder address set in YieldPool");

    console.log("\n=== Deployment Summary ===");
    console.log("PolicyManager:", contractAddress);
    console.log("YieldPool:", yieldContractAddress);
    console.log("PremiumForwarder:", premiumContractAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
